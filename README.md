# EQUA commerce MVP

Custom full-stack skincare learning-commerce platform built without Shopify. The MVP connects a curated storefront, EQUA Academy, a deterministic Skin Blueprint, AM/PM routine building, checkout, community and an operations dashboard.

## Product surface

- `/` — editorial storefront and live search
- `/academy` — video program library
- `/academy/[course]` — modules, outcomes and enrollment
- `/academy/[course]/[lesson]` — demo video player, progress, checklist and shoppable lesson products
- `/community` — course-linked discussions and expert check-ins
- `/shop` — filterable and sortable 24-product catalog
- `/product/[slug]` — product detail, routine actions and moderated reviews
- `/quiz` — seven-step skin check with safety exclusions
- `/routine` — persistent AM/PM routine builder
- `/cart` — three-step cart, delivery and demo payment flow
- `/journal`, `/journal/[slug]` — educational content hub
- `/ingredients`, `/concerns/[slug]` — ingredient and concern discovery
- `/account` — unified blueprint, course progress, routine, wishlist and secure guest order lookup
- `/admin` — commerce, Academy and community showroom dashboard

## Backend

The production backend uses Supabase Postgres through its serverless transaction pooler. The connection string is provided to Vercel as `SUPABASE_DATABASE_URL` (with `DATABASE_URL` supported as a fallback). The storefront and device-level MVP flows work without a database; durable writes return an explicit `503` until Supabase is connected. All monetary values are stored as integer minor units.

- `POST /api/newsletter`
- `GET|POST /api/orders`
- `GET|POST /api/routines`
- `GET|POST /api/reviews`
- `GET /api/admin/overview`
- `GET|POST /api/learning`
- `GET|POST /api/community`
- `GET /api/health`

Durable tables cover newsletter signups, orders and line items, saved routines, moderated reviews, course enrollments, lesson progress, quiz results, community conversations and an event log. Checkout re-prices products and shipping from the canonical server catalog. The current card option is an explicit demo simulation; cash on delivery produces a real stored MVP order.

## Development

Requires Node.js `24.x` to match the Vercel production runtime.

```bash
npm install
npm run dev
npm run build
npm run lint
node scripts/verify-mvp.mjs --build
```

The verifier checks route rendering, catalog integrity, quiz safety, API degraded modes, accessibility basics, 404 handling and asset budgets.

## Vercel

The repository uses the standard Next.js runtime (`next build` / `next start`) and can be deployed directly to Vercel. To enable durable orders, newsletter signups, reviews, routines, learning progress and community posts, copy the Supabase **Transaction pooler** connection string into the Vercel secret `SUPABASE_DATABASE_URL`. Prepared statements are disabled for Supavisor compatibility, and the schema is initialized idempotently on the first database-backed request.
