import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const newsletterSignups = sqliteTable(
  "newsletter_signups",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    firstName: text("first_name"),
    source: text("source").notNull().default("website"),
    consent: integer("consent", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("idx_newsletter_signups_email").on(table.email)],
);

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").notNull(),
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone"),
    addressLine1: text("address_line_1").notNull(),
    addressLine2: text("address_line_2"),
    city: text("city").notNull(),
    postalCode: text("postal_code").notNull(),
    country: text("country").notNull().default("RS"),
    paymentMethod: text("payment_method").notNull().default("cash_on_delivery"),
    subtotalCents: integer("subtotal_cents").notNull(),
    shippingCents: integer("shipping_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    currency: text("currency").notNull().default("RSD"),
    status: text("status").notNull().default("pending"),
    notes: text("notes"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_orders_order_number").on(table.orderNumber),
    index("idx_orders_email_created_at").on(table.email, table.createdAt),
    index("idx_orders_status_created_at").on(table.status, table.createdAt),
    check("orders_subtotal_nonnegative", sql`${table.subtotalCents} >= 0`),
    check("orders_shipping_nonnegative", sql`${table.shippingCents} >= 0`),
    check("orders_total_nonnegative", sql`${table.totalCents} >= 0`),
  ],
);

export const orderItems = sqliteTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull(),
    productName: text("product_name").notNull(),
    variantName: text("variant_name"),
    routineSlot: text("routine_slot"),
    quantity: integer("quantity").notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
    lineTotalCents: integer("line_total_cents").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_order_items_order_id").on(table.orderId),
    check("order_items_quantity_positive", sql`${table.quantity} > 0`),
    check("order_items_unit_price_nonnegative", sql`${table.unitPriceCents} >= 0`),
    check("order_items_line_total_nonnegative", sql`${table.lineTotalCents} >= 0`),
  ],
);

export const savedRoutines = sqliteTable(
  "saved_routines",
  {
    id: text("id").primaryKey(),
    email: text("email"),
    sessionId: text("session_id"),
    name: text("name").notNull().default("Moja rutina"),
    skinProfileJson: text("skin_profile_json").notNull().default("{}"),
    itemsJson: text("items_json").notNull().default("[]"),
    totalCents: integer("total_cents").notNull().default(0),
    currency: text("currency").notNull().default("RSD"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_saved_routines_email_updated_at").on(table.email, table.updatedAt),
    index("idx_saved_routines_session_updated_at").on(table.sessionId, table.updatedAt),
    check(
      "saved_routines_owner_present",
      sql`${table.email} IS NOT NULL OR ${table.sessionId} IS NOT NULL`,
    ),
    check("saved_routines_total_nonnegative", sql`${table.totalCents} >= 0`),
  ],
);

export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    productId: text("product_id").notNull(),
    authorName: text("author_name").notNull(),
    email: text("email"),
    rating: integer("rating").notNull(),
    title: text("title"),
    body: text("body").notNull(),
    status: text("status").notNull().default("pending"),
    verifiedPurchase: integer("verified_purchase", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_reviews_product_status_created_at").on(
      table.productId,
      table.status,
      table.createdAt,
    ),
    check("reviews_rating_range", sql`${table.rating} BETWEEN 1 AND 5`),
  ],
);

export const eventLog = sqliteTable(
  "event_log",
  {
    id: text("id").primaryKey(),
    eventType: text("event_type").notNull(),
    subjectType: text("subject_type"),
    subjectId: text("subject_id"),
    payloadJson: text("payload_json").notNull().default("{}"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_event_log_event_type_created_at").on(table.eventType, table.createdAt)],
);
