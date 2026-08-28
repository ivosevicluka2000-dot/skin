import {
  ApiValidationError,
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

interface RoutineRow {
  id: string;
  email: string | null;
  sessionId: string | null;
  name: string;
  skinProfileJson: string;
  itemsJson: string;
  totalCents: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function presentRoutine(row: RoutineRow) {
  return {
    id: row.id,
    email: row.email,
    sessionId: row.sessionId,
    name: row.name,
    skinProfile: parseJson<Record<string, unknown>>(row.skinProfileJson, {}),
    items: parseJson<unknown[]>(row.itemsJson, []),
    totalCents: row.totalCents,
    currency: row.currency,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await readJsonObject(request);
    const email = normalizedEmail(body.email, false);
    const sessionId =
      optionalString(body.sessionId, "sessionId", 128) ?? stableId("session");
    const name = optionalString(body.name, "name", 100) ?? "Moja rutina";
    const skinProfile = body.skinProfile ?? {};
    if (!isRecord(skinProfile)) {
      throw new ApiValidationError("skinProfile must be an object.", "skinProfile");
    }

    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20) {
      throw new ApiValidationError("items must contain between 1 and 20 products.", "items");
    }

    const items = body.items.map((candidate, index) => {
      if (!isRecord(candidate)) {
        throw new ApiValidationError(`items[${index}] must be an object.`, `items[${index}]`);
      }

      return {
        productId: requiredString(candidate.productId, `items[${index}].productId`, 120),
        productName: optionalString(
          candidate.productName ?? candidate.name,
          `items[${index}].productName`,
          200,
        ),
        slot: optionalString(candidate.slot ?? candidate.routineSlot, `items[${index}].slot`, 40),
        quantity: optionalBoundedInteger(candidate.quantity, `items[${index}].quantity`, 1, 20, 1),
        unitPriceCents: optionalBoundedInteger(
          candidate.unitPriceCents,
          `items[${index}].unitPriceCents`,
          0,
          100_000_000,
          0,
        ),
      };
    });
    const totalCents = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPriceCents,
      0,
    );
    if (!Number.isSafeInteger(totalCents) || totalCents > 2_000_000_000) {
      throw new ApiValidationError("Routine total is outside the supported range.", "items");
    }

    const skinProfileJson = JSON.stringify(skinProfile);
    const itemsJson = JSON.stringify(items);
    if (skinProfileJson.length > 20_000 || itemsJson.length > 100_000) {
      throw new ApiValidationError("Routine data is too large.", "items");
    }

    const selectedCurrency = (optionalString(body.currency, "currency", 3) ?? "RSD").toUpperCase();
    if (selectedCurrency !== "RSD" && selectedCurrency !== "EUR") {
      throw new ApiValidationError("currency must be RSD or EUR.", "currency");
    }

    const routineId = stableId("rtn");
    const database = await getDatabase();
    await database.batch([
      database
        .prepare(
          `INSERT INTO saved_routines (
            id, email, session_id, name, skin_profile_json, items_json,
            total_cents, currency
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          routineId,
          email,
          sessionId,
          name,
          skinProfileJson,
          itemsJson,
          totalCents,
          selectedCurrency,
        ),
      eventStatement(database, "routine.saved", "saved_routine", routineId, {
        itemCount: items.length,
        totalCents,
        currency: selectedCurrency,
      }),
    ]);

    const routine = await database
      .prepare(
        `SELECT
          id, email, session_id AS sessionId, name,
          skin_profile_json AS skinProfileJson, items_json AS itemsJson,
          total_cents AS totalCents, currency,
          created_at AS createdAt, updated_at AS updatedAt
         FROM saved_routines WHERE id = ?`,
      )
      .bind(routineId)
      .first<RoutineRow>();

    return json({ ok: true, routine: routine ? presentRoutine(routine) : null }, 201);
  } catch (error) {
    return routeError(error);
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const email = normalizedEmail(url.searchParams.get("email"), false);
    const sessionId = optionalString(url.searchParams.get("sessionId"), "sessionId", 128);
    if (!email && !sessionId) {
      throw new ApiValidationError("email or sessionId is required.", "email");
    }

    const rawLimit = url.searchParams.get("limit");
    const limit = optionalBoundedInteger(
      rawLimit === null ? undefined : Number(rawLimit),
      "limit",
      1,
      20,
      10,
    );
    const database = await getDatabase();
    const result = await database
      .prepare(
        `SELECT
          id, email, session_id AS sessionId, name,
          skin_profile_json AS skinProfileJson, items_json AS itemsJson,
          total_cents AS totalCents, currency,
          created_at AS createdAt, updated_at AS updatedAt
         FROM saved_routines
         WHERE ${email ? "email = ?" : "session_id = ?"}
         ORDER BY updated_at DESC
         LIMIT ?`,
      )
      .bind(email ?? sessionId, limit)
      .all<RoutineRow>();

    return json({ ok: true, routines: (result.results ?? []).map(presentRoutine) });
  } catch (error) {
    return routeError(error);
  }
}
