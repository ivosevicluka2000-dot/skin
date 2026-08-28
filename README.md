# EQUA commerce MVP

Custom full-stack skincare commerce platform built without Shopify. The MVP combines a curated storefront, editorial education, a deterministic skin quiz, AM/PM routine building, checkout and an operations dashboard.

## Product surface

- `/` — editorial storefront and live search
- `/shop` — filterable and sortable 24-product catalog
- `/product/[slug]` — product detail, routine actions and moderated reviews
- `/quiz` — seven-step skin check with safety exclusions
- `/routine` — persistent AM/PM routine builder
- `/cart` — three-step cart, delivery and demo payment flow
- `/journal`, `/journal/[slug]` — educational content hub
- `/ingredients`, `/concerns/[slug]` — ingredient and concern discovery
- `/account` — routine, wishlist and order lookup
- `/admin` — live commerce dashboard with a showroom fallback dataset

## Backend

Cloudflare D1 is initialized lazily in preview and production. All monetary values are stored as integer minor units.

- `POST /api/newsletter`
- `GET|POST /api/orders`
- `GET|POST /api/routines`
- `GET|POST /api/reviews`
- `GET /api/admin/overview`
- `GET /api/health`

Durable tables cover newsletter signups, orders and line items, saved routines, moderated reviews and an event log. The current card option is an explicit demo simulation; cash on delivery produces a real stored MVP order.

## Development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm run build
npm run lint
node scripts/verify-mvp.mjs --build
```

The verifier checks route rendering, catalog integrity, quiz safety, API degraded modes, accessibility basics, 404 handling and asset budgets.
