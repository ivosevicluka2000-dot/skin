// The schema is initialized lazily when a Supabase Postgres connection is present.
// Keep every entry to exactly one prepared SQL statement.
export const runtimeSchemaStatements = [
  `CREATE TABLE IF NOT EXISTS newsletter_signups (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    source TEXT NOT NULL DEFAULT 'website',
    consent INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_product_status_created_at
   ON reviews (product_id, status, created_at)`,
  `CREATE TABLE IF NOT EXISTS event_log (
    id TEXT PRIMARY KEY NOT NULL,
    event_type TEXT NOT NULL,
    subject_type TEXT,
    subject_id TEXT,
    payload_json TEXT NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_event_log_event_type_created_at
   ON event_log (event_type, created_at)`,
  `CREATE TABLE IF NOT EXISTS course_enrollments (
    id TEXT PRIMARY KEY NOT NULL,
    owner_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_course_enrollments_owner_course
   ON course_enrollments (owner_id, course_id)`,
  `CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_status
   ON course_enrollments (course_id, status)`,
  `CREATE TABLE IF NOT EXISTS lesson_progress (
    id TEXT PRIMARY KEY NOT NULL,
    owner_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    progress_seconds INTEGER NOT NULL DEFAULT 0 CHECK (progress_seconds >= 0),
    completed INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_lesson_progress_owner_lesson
   ON lesson_progress (owner_id, lesson_id)`,
  `CREATE INDEX IF NOT EXISTS idx_lesson_progress_owner_course
   ON lesson_progress (owner_id, course_id)`,
  `CREATE TABLE IF NOT EXISTS quiz_results (
    id TEXT PRIMARY KEY NOT NULL,
    owner_id TEXT NOT NULL,
    quiz_version TEXT NOT NULL DEFAULT '2026-09',
    routine_id TEXT NOT NULL,
    routine_name TEXT NOT NULL,
    primary_signal TEXT NOT NULL,
    answers_json TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_quiz_results_owner_created_at
   ON quiz_results (owner_id, created_at)`,
  `CREATE TABLE IF NOT EXISTS community_posts (
    id TEXT PRIMARY KEY NOT NULL,
    owner_id TEXT NOT NULL,
    space_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    like_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_community_posts_space_status_created
   ON community_posts (space_id, status, created_at)`,
  `CREATE TABLE IF NOT EXISTS community_comments (
    id TEXT PRIMARY KEY NOT NULL,
    post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    owner_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_community_comments_post_status_created
   ON community_comments (post_id, status, created_at)`,
] as const;
