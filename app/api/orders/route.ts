import {
  ApiValidationError,
  boundedInteger,
  isRecord,
  json,
  normalizedEmail,
  optionalBoundedInteger,
  optionalString,
  readJsonObject,
  requiredString,
  routeError,
} from "@/lib/server/api";
import { eventStatement, getDatabase, stableId } from "@/lib/server/db";
import { products } from "@/lib/data/catalog";
import { getChatGPTUser } from "@/app/chatgpt-auth";

const ORDER_STATUSES = new Set(["pending", "confirmed", "processing", "shipped", "complete", "cancelled"]);
const PAYMENT_METHODS = new Set(["cash_on_delivery", "demo_card"]);
const CURRENCIES = new Set(["RSD", "EUR"]);

interface OrderSummaryRow {
  id: string;
  orderNumber: string;
  status: string;
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  paymentMethod: string;
  createdAt: string;
}

interface NormalizedOrderItem {
  id: string;
  productId: string;
  productName: string;
  variantName: string | null;
  routineSlot: string | null;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

function orderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `ZK-${date}-${suffix}`;
}

function currency(value: unknown): string {
  const normalized = (optionalString(value, "currency", 3) ?? "RSD").toUpperCase();
  if (!CURRENCIES.has(normalized)) {
    throw new ApiValidationError("currency must be RSD or EUR.", "currency");
  }
  return normalized;
}

function normalizeItems(value: unknown): NormalizedOrderItem[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) {
    throw new ApiValidationError("items must contain between 1 and 50 products.", "items");
  }

  return value.map((candidate, index) => {
    if (!isRecord(candidate)) {
      throw new ApiValidationError(`items[${index}] must be an object.`, `items[${index}]`);
    }

    const quantity = optionalBoundedInteger(candidate.quantity, `items[${index}].quantity`, 1, 20, 1);
    const productId = requiredString(candidate.productId, `items[${index}].productId`, 120);
    const product = products.find((item) => item.id === productId);
    if (!product) throw new ApiValidationError("Unknown product.", `items[${index}].productId`);
    if (product.stock.status === "nema-na-stanju" || product.stock.quantity < quantity) {
      throw new ApiValidationError(`${product.name} is not available in the requested quantity.`, `items[${index}].quantity`);
    }
    const unitPriceCents = product.priceRsd * 100;

    return {
      id: stableId("itm"),
      productId: product.id,
      productName: product.name,
      variantName: product.size,
      routineSlot: product.routineStep,
      quantity,
      unitPriceCents,
      lineTotalCents: quantity * unitPriceCents,
    };
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await readJsonObject(request);
    const customer = isRecord(body.customer) ? body.customer : body;
    const shipping = isRecord(body.shippingAddress)
      ? body.shippingAddress
      : isRecord(body.shipping)
        ? body.shipping
        : body;
    const items = normalizeItems(body.items);
    const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
    if (!Number.isSafeInteger(subtotalCents) || subtotalCents > 2_000_000_000) {
      throw new ApiValidationError("Order total is outside the supported range.", "items");
    }

    const shippingCents = subtotalCents >= 600_000 ? 0 : 39_000;
    const totalCents = subtotalCents + shippingCents;
    const email = normalizedEmail(customer.email) as string;
    const firstName = requiredString(customer.firstName, "firstName", 80);
    const lastName = requiredString(customer.lastName, "lastName", 80);
    const phone = optionalString(customer.phone, "phone", 40);
    const addressLine1 = requiredString(shipping.addressLine1, "addressLine1", 180);
    const addressLine2 = optionalString(shipping.addressLine2, "addressLine2", 180);
    const city = requiredString(shipping.city, "city", 100);
    const postalCode = requiredString(shipping.postalCode, "postalCode", 20);
    const country = (optionalString(shipping.country, "country", 2) ?? "RS").toUpperCase();
    const paymentMethod = optionalString(body.paymentMethod, "paymentMethod", 40) ?? "cash_on_delivery";
    if (!PAYMENT_METHODS.has(paymentMethod)) {
      throw new ApiValidationError(
        "paymentMethod must be cash_on_delivery or demo_card.",
        "paymentMethod",
      );
    }

    const orderId = stableId("ord");
    const publicOrderNumber = orderNumber();
    const selectedCurrency = currency(body.currency);
    const notes = optionalString(body.notes, "notes", 1000);
    const database = await getDatabase();
    const statements: D1PreparedStatement[] = [
      database
        .prepare(
          `INSERT INTO orders (
            id, order_number, email, first_name, last_name, phone,
            address_line_1, address_line_2, city, postal_code, country,
            payment_method, subtotal_cents, shipping_cents, total_cents,
            currency, status, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
        )
        .bind(
          orderId,
          publicOrderNumber,
          email,
          firstName,
          lastName,
          phone,
          addressLine1,
          addressLine2,
          city,
          postalCode,
          country,
          paymentMethod,
          subtotalCents,
          shippingCents,
          totalCents,
          selectedCurrency,
          notes,
        ),
      ...items.map((item) =>
        database
          .prepare(
            `INSERT INTO order_items (
              id, order_id, product_id, product_name, variant_name,
              routine_slot, quantity, unit_price_cents, line_total_cents
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            item.id,
            orderId,
            item.productId,
            item.productName,
            item.variantName,
            item.routineSlot,
            item.quantity,
            item.unitPriceCents,
            item.lineTotalCents,
          ),
      ),
      eventStatement(database, "order.created", "order", orderId, {
        orderNumber: publicOrderNumber,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        totalCents,
        currency: selectedCurrency,
        paymentMethod,
      }),
    ];

    await database.batch(statements);

    return json(
      {
        ok: true,
        order: {
          id: orderId,
          orderNumber: publicOrderNumber,
          status: "pending",
          items,
          subtotalCents,
          shippingCents,
          totalCents,
          currency: selectedCurrency,
          paymentMethod,
        },
      },
      201,
    );
  } catch (error) {
    return routeError(error);
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const user = await getChatGPTUser();
    const emailParam = url.searchParams.get("email");
    const email = user?.email ?? normalizedEmail(emailParam, false);
    const requestedOrderNumber = optionalString(url.searchParams.get("orderNumber"), "orderNumber", 40);
    if (!user && (!email || !requestedOrderNumber)) {
      throw new ApiValidationError("Email and order number are required for guest lookup.", "orderNumber");
    }
    const status = optionalString(url.searchParams.get("status"), "status", 20);
    if (status && !ORDER_STATUSES.has(status)) {
      throw new ApiValidationError("Unknown order status.", "status");
    }

    const rawLimit = url.searchParams.get("limit");
    const parsedLimit = rawLimit === null ? 20 : Number(rawLimit);
    const limit = boundedInteger(parsedLimit, "limit", 1, 50);
    const predicates: string[] = [];
    const bindings: Array<string | number> = [];
    if (email) {
      predicates.push("o.email = ?");
      bindings.push(email);
    }
    if (requestedOrderNumber) {
      predicates.push("o.order_number = ?");
      bindings.push(requestedOrderNumber.toUpperCase());
    }
    if (status) {
      predicates.push("o.status = ?");
      bindings.push(status);
    }

    const database = await getDatabase();
    const result = await database
      .prepare(
        `SELECT
          o.id AS id,
          o.order_number AS orderNumber,
          o.status AS status,
          COALESCE(SUM(oi.quantity), 0) AS itemCount,
          o.subtotal_cents AS subtotalCents,
          o.shipping_cents AS shippingCents,
          o.total_cents AS totalCents,
          o.currency AS currency,
          o.payment_method AS paymentMethod,
          o.created_at AS createdAt
         FROM orders o
         LEFT JOIN order_items oi ON oi.order_id = o.id
         ${predicates.length ? `WHERE ${predicates.join(" AND ")}` : ""}
         GROUP BY o.id
         ORDER BY o.created_at DESC
         LIMIT ?`,
      )
      .bind(...bindings, limit)
      .all<OrderSummaryRow>();

    return json({ ok: true, orders: result.results ?? [] });
  } catch (error) {
    return routeError(error);
  }
}
