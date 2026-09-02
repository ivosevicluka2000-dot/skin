# Zlatna Koka MVP — QA matrix

## Automated release gates

| Area | Checks | Gate |
|---|---|---|
| Build/runtime | Next.js production build and Node 24.x | Must pass |
| Route smoke | `/`, `/academy`, `/community`, `/shop`, `/journal`, `/ingredients`, `/quiz`, `/routine`, `/cart`, `/account`, `/admin` | HTTP 200 + HTML |
| Dynamic routes | Discover and open one linked course, lesson, product, article, and concern | HTTP 200 + HTML |
| Document quality | Serbian `lang`, unique H1, title, meta description, main landmark | Must pass |
| Basic accessibility | Image alt text, named buttons/links, unique IDs, no empty/hash links | Must pass |
| Content integrity | At least 4 linked products, 2 articles, and 3 concerns | Must pass |
| Seed integrity | 24 products, 6 brands, 8 concerns, 12 ingredients, 8 articles, 6 routines, 9 quiz questions, 3 courses; all references resolve | Must pass |
| Recommendation safety | Deterministic scoring, duplicate-answer handling, pregnancy retinal exclusion | Must pass |
| Failure handling | Unknown route returns 404, not a 500 | Must pass |
| API contract | Health and Supabase-backed endpoints return JSON; degraded storage is explicit 503 | Must pass |
| API validation | Empty writes are rejected with 4xx/503, never 500 | Must pass |
| Persistence | Optional Supabase transaction-pooler connection, idempotent migration, foreign keys, uniqueness and range constraints | Must pass |
| Source contract | All agreed App Router pages exist; starter preview removed | Must pass |
| Motion/keyboard/mobile nav | Reduced-motion, visible focus, and dedicated mobile-menu layout styles exist | Must pass |
| Asset budget | JS ≤ 350 KiB gzip, CSS ≤ 110 KiB gzip, image ≤ 2 MB, video ≤ 8 MB per file | Must pass |

Run the complete browser-free gate after a build:

```bash
node scripts/verify-mvp.mjs --build
```

Run individual Node suites:

```bash
node --test tests/source-contract.test.mjs
node --test tests/rendered-html.test.mjs
```

## Manual browser matrix

| Journey | Desktop | Mobile | Keyboard | Expected result |
|---|---:|---:|---:|---|
| Browse shop and filter products | ✓ | ✓ | ✓ | Results and count update; filters can be cleared |
| Landing → Academy → lesson → product | ✓ | ✓ | ✓ | Course structure, progress and shoppable context remain connected |
| Complete lesson and reload | ✓ | ✓ | ✓ | Completed state persists and account progress updates |
| Open community and create topic | ✓ | ✓ | ✓ | Valid topic persists; invalid input is rejected |
| Open product and add to cart | ✓ | ✓ | ✓ | Correct product, price, quantity, and cart total |
| Complete skin quiz | ✓ | ✓ | ✓ | Progress is clear; answers can be changed; result is repeatable |
| Build AM/PM routine | ✓ | ✓ | ✓ | Add/swap/remove works and survives refresh when promised |
| Read guide and follow product link | ✓ | ✓ | ✓ | Context is preserved; no dead-end links |
| Cart quantity/remove/empty state | ✓ | ✓ | ✓ | Totals stay correct; empty state has a useful next action |
| Account and admin boundaries | ✓ | ✓ | ✓ | No customer/admin data leaks; anonymous state is intentional |

## Accessibility and responsive checklist

- Test at 320, 375, 768, 1024, and 1440 px; no horizontal overflow.
- Complete navigation, quiz, filters, routine, cart, dialogs, and drawers using only a keyboard.
- Focus is visible and restored to the trigger after closing a modal/drawer.
- Mobile menu and overlays trap focus, close with Escape, and prevent background scrolling.
- Form fields have persistent labels; errors are announced and explain how to recover.
- Text and controls meet WCAG AA contrast; touch targets are approximately 44×44 px.
- Content remains usable at 200% zoom and with reduced motion enabled.
- Decorative images have empty alt text; meaningful product imagery has useful alt text.

## Performance and resilience checklist

- Capture Lighthouse mobile traces for homepage, shop, PDP, article, quiz result, and routine.
- Targets: LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms on representative mobile throttling.
- Hero media is responsive, compressed, correctly sized, and does not autoplay with sound.
- Below-fold imagery is lazy-loaded; primary LCP imagery is not lazy-loaded.
- Filter/quiz/cart interactions remain responsive during navigation and loading states.
- Test slow network, offline reload, invalid slugs, empty catalog, failed API request, and double submit.
- Verify no secrets, stack traces, seed-only admin controls, or personal data appear in HTML or logs.
