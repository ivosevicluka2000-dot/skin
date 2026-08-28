// D1 is initialized lazily because preview and production resources are injected
// at runtime by Sites. Keep every entry to exactly one prepared SQL statement.
export const runtimeSchemaStatements = [
  "PRAGMA foreign_keys = ON",
  `CREATE TABLE IF NOT EXISTS newsletter_signups (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    source TEXT NOT NULL DEFAULT 'website',
    consent INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_signups_email
   ON newsletter_signups (email)`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY NOT NULL,
    order_number TEXT NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'RS',
    payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
    subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents >= 0),
    shipping_cents INTEGER NOT NULL DEFAULT 0 CHECK (shipping_cents >= 0),
    total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
    currency TEXT NOT NULL DEFAULT 'RSD',
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number
   ON orders (order_number)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_email_created_at
   ON orders (email, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_status_created_at
   ON orders (status, created_at)`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY NOT NULL,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    variant_name TEXT,
    routine_slot TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
    line_total_cents INTEGER NOT NULL CHECK (line_total_cents >= 0),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_order_items_order_id
   ON order_items (order_id)`,
  `CREATE TABLE IF NOT EXISTS saved_routines (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT,
    session_id TEXT,
    name TEXT NOT NULL DEFAULT 'Moja rutina',
    skin_profile_json TEXT NOT NULL DEFAULT '{}',
    items_json TEXT NOT NULL DEFAULT '[]',
    total_cents INTEGER NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
    currency TEXT NOT NULL DEFAULT 'RSD',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (email IS NOT NULL OR session_id IS NOT NULL)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_saved_routines_email_updated_at
   ON saved_routines (email, updated_at)`,
  `CREATE INDEX IF NOT EXISTS idx_saved_routines_session_updated_at
   ON saved_routines (session_id, updated_at)`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    email TEXT,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title TEXT,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    verified_purchase INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_product_status_created_at
   ON reviews (product_id, status, created_at)`,
  `CREATE TABLE IF NOT EXISTS event_log (
    id TEXT PRIMARY KEY NOT NULL,
    event_type TEXT NOT NULL,
    subject_type TEXT,
    subject_id TEXT,
    payload_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_event_log_event_type_created_at
   ON event_log (event_type, created_at)`,
  "PRAGMA optimize",
] as const;
