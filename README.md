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

Cloudflare D1 is initialized lazily in preview and production. All monetary values are stored as integer minor units.

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

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm run build
npm run lint
node scripts/verify-mvp.mjs --build
```

The verifier checks route rendering, catalog integrity, quiz safety, API degraded modes, accessibility basics, 404 handling and asset budgets.
