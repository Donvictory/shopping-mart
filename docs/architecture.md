# Architecture — Shopping Mart

Status: **Draft for approval** · Last updated: 2026-10-31
Related: [requirements.md](requirements.md) · [system-boundary.md](system-boundary.md) · [decisions/](decisions/)

Legend: **[Confirmed]** approved · **[Proposed]** recommended, awaiting approval · **[Open]** needs a decision before the milestone that uses it.

## 1. Overview

One **Next.js 16 app** (App Router) deployed on **Vercel**. It serves both the storefront and the admin dashboard. Its server code (Server Components, Server Actions, Route Handlers) is the backend. There is no separate API service. See [ADR-0001](decisions/0001-single-nextjs-app.md).

| Concern | Choice | Status |
|---|---|---|
| Framework | Next.js 16.4, React 19, TypeScript, Tailwind 4 | Confirmed (existing project) |
| Hosting | Vercel | Confirmed |
| Database | Postgres on Neon (Vercel Marketplace) | Confirmed Postgres; Neon proposed ([ADR-0002](decisions/0002-postgres-neon.md)) |
| Database access | Typed query builder / ORM with migrations (Drizzle or Prisma) | **Open** |
| Auth | Auth library storing users and sessions in our Postgres (proposed: Better Auth) | Confirmed library; Better Auth proposed ([ADR-0003](decisions/0003-auth.md)) |
| Images | Vercel Blob + `next/image` | Proposed |
| Email | Resend (verification + password reset) | Proposed |
| Input validation | Zod schemas, shared by forms and Server Actions | Proposed |
| WhatsApp | `https://wa.me/<number>?text=<message>` link | Confirmed ([ADR-0004](decisions/0004-whatsapp-checkout-orders.md)) |

## 2. Code structure

Routes are grouped by area. Business logic lives in `lib/` so that pages and actions stay thin.

```
app/
  (shop)/                 storefront: home, /products, /products/[slug], /cart
  (account)/              /checkout, /account, /account/orders  (sign-in required)
  (auth)/                 /sign-in, /sign-up, /verify, /reset-password
  admin/                  dashboard: products, categories, orders, admins
  api/auth/[...all]/      auth library's route handler
  api/blob/upload/        signed upload route for admin photos
lib/
  db/                     schema, client, migrations
  dal/                    Data Access Layer: the ONLY place that queries the DB
    session.ts            getSession(), requireUser(), requireAdmin()
    catalog.ts            cached catalog reads
    cart.ts, orders.ts, admin/*.ts
  domain/                 pure functions, unit-tested: pricing, cart merge,
                          WhatsApp message builder, order-status transitions
  validation/             Zod schemas
proxy.ts                  optimistic redirects only (/admin, /account, /checkout)
```

Rule: anything under `lib/dal` imports `server-only`, so it can never be bundled into client code.

## 3. Data model

```
user (from auth library) ── profile (1:1)
  │  role: 'customer' | 'admin'
  ├──< cart_item >── product_variant
  └──< order ──< order_item

category ──< product ──< product_variant
                   └──< product_image
```

| Table | Key fields | Notes |
|---|---|---|
| `user`, `session`, `account`, `verification` | Managed by the auth library | Add `role` (default `customer`) to `user` |
| `profile` | `user_id` PK/FK, `full_name`, `phone`, `delivery_address`, `adult_confirmed_at`, `privacy_accepted_at` | Saved checkout details and consent record |
| `category` | `id`, `name`, `slug` unique, `sort_order` | Product **type** (tops, dresses…) |
| `product` | `id`, `slug` unique, `name`, `description`, `gender` enum (`boys`/`girls`/`unisex`), `category_id`, `base_price_kobo` int, `status` enum (`draft`/`active`/`archived`), timestamps | Gender as an enum: fixed small set, used in filters |
| `product_variant` | `id`, `product_id`, `size_label` (e.g. "6–7Y"), `sort_order`, `price_override_kobo` int null, `in_stock` bool | Unique (`product_id`, `size_label`) |
| `product_image` | `id`, `product_id`, `blob_url`, `alt_text`, `sort_order` | Max 5 per product, enforced on the server |
| `cart_item` | `user_id`, `variant_id`, `quantity` (1–10), `updated_at` | PK (`user_id`, `variant_id`) |
| `order` | `id`, `order_number` unique (e.g. `SM-000123`), `user_id`, `status` enum, `customer_name`, `customer_phone`, `delivery_address`, `total_kobo`, `idempotency_key`, timestamps | Unique (`user_id`, `idempotency_key`) |
| `order_item` | `order_id`, `variant_id` null, `product_name`, `size_label`, `unit_price_kobo`, `quantity`, `line_total_kobo` | **Snapshot**: copies of the values at order time |

**Rules**
- **Money is stored as integer kobo** (₦1 = 100 kobo). Never floats.
- Effective price = `price_override_kobo ?? product.base_price_kobo`. Computed only in `lib/domain/pricing.ts`.
- Products are **archived, not deleted**, so carts and history stay consistent. Variants that are in old orders are kept; `order_item.variant_id` is `ON DELETE SET NULL`, because the order already has its own copy.
- Archived or draft products, and out-of-stock variants, cannot be added to carts or ordered (checked on the server).

## 4. Key flows

### 4.1 Browsing (cached)
Catalog reads in `lib/dal/catalog.ts` use `'use cache'` with `cacheTag('catalog')` and `cacheTag('product:<id>')`. The project already has `cacheComponents: true` in `next.config.ts`. Pages are fast and rarely hit the database.

### 4.2 Admin edits a product
1. Admin submits a form → Server Action.
2. Action calls `requireAdmin()` (reads session from the DB, checks role). It fails with `forbidden` if not admin.
3. Input is validated with Zod and written to the DB.
4. Action calls `updateTag('product:<id>')` and `updateTag('catalog')`, so the admin and shoppers see the change immediately.

**Photo upload:** the browser uploads directly to Vercel Blob using a short-lived token from `/api/blob/upload`. That route runs `requireAdmin()` and limits types (JPEG/PNG/WebP) and size (≤ 4 MB). Direct upload avoids Vercel's request-body size limit for server functions. The resulting URL is saved by a separate admin Server Action that enforces the 5-photo limit.

### 4.3 Guest cart → sign-in → merged cart
- Guest cart = `localStorage` list of `{variantId, quantity}` only. No prices are stored.
- The cart page asks the server for current details of those variant IDs and shows current prices and stock (FR-11).
- After sign-in, a `mergeGuestCart(items)` action adds guest items to the account cart: quantities add up, capped at 10; unknown, archived or out-of-stock variants are skipped and reported. Then `localStorage` is cleared.
- From then on, a signed-in shopper's cart is read and written only on the server, filtered by the session user ID.

### 4.4 Checkout → order → WhatsApp
```
Shopper ─► /checkout (requireUser) ─► confirm name, phone, address
        ─► placeOrder(idempotencyKey, contact) Server Action:
             1. requireUser(); validate input (Zod); rate-limit per user
             2. load cart FROM DB (never from the browser)
             3. re-price + re-check stock; if anything changed → return the
                changes, shopper reviews and retries
             4. in ONE transaction: insert order + order_items (snapshots),
                save contact to profile, clear cart
             5. if (user, idempotencyKey) already exists → return that order
                (prevents duplicates from double-clicks or retries)
             6. return order number + WhatsApp URL
        ─► browser opens wa.me link; order page shows "Resend on WhatsApp"
```
- The message is built by `lib/domain/whatsapp.ts` from the **saved order**, so it always matches the database. It includes order number, items, sizes, quantities, line prices, total in ₦ and delivery details, and is URL-encoded.
- Seller number comes from an environment variable (`SELLER_WHATSAPP_NUMBER`), in international format without `+`.

### 4.5 Order status (admin)
Allowed changes, enforced in `lib/domain/orderStatus.ts`:
`sent_to_whatsapp → confirmed → completed`, and `sent_to_whatsapp | confirmed → cancelled`. Every change is made by an admin action that runs `requireAdmin()`.

### 4.6 Adding admins later
- First admin: a one-off script (`npm run create-admin -- <email>`) run against the production DB.
- Later: an admin page "Grant admin" that sets `role = 'admin'` on an existing account by email. It must stop an admin from removing their own role if they are the last admin.
- All checks use `requireAdmin()`. More granular roles (e.g. `owner`, `staff`) can be added by extending the enum, without a redesign.

## 5. Security

| Area | Approach |
|---|---|
| Authorisation | Every Server Action and Route Handler re-checks the session and role itself. Server Actions can be called by direct POST, so a check on the page is not enough. Central helpers: `requireUser()`, `requireAdmin()` in `lib/dal/session.ts`. |
| Proxy (`proxy.ts`) | Optimistic redirect only: if there is no session cookie on `/admin`, `/account` or `/checkout`, redirect to sign-in. It never replaces the server checks. |
| Data ownership | Customer queries always use `session.user.id`. IDs from the browser are only used together with that filter. |
| Input | Zod validation on every action. Prices, totals and stock always come from the DB. |
| Sessions | Database sessions in HTTP-only, Secure, SameSite=Lax cookies (auth library default). Sessions can be revoked, e.g. when admin rights are removed. |
| Passwords | Hashed by the auth library. Minimum length 8. Email verification required before checkout. |
| Rate limiting | Auth library's limiter on sign-in, sign-up and reset. Per-user limit on `placeOrder` (e.g. 5 orders / 10 min) checked against the `order` table. |
| Data leaks to client | DAL returns small, plain objects (DTOs), never whole user rows. `server-only` on DAL modules. |
| Uploads | Admin-only token route; type and size limits; images are public by design. |
| Secrets | Vercel environment variables only. Separate values for Preview and Production. |
| Privacy (NDPA) | Privacy notice page; 18+ and privacy consent stored with timestamps; account deletion removes profile, cart and sessions, and anonymises the customer fields on their orders (order totals stay for the seller's records). |

## 6. Quality attributes

| Attribute | Approach | How it is checked |
|---|---|---|
| Performance | Cached catalog, `next/image` with sized, modern-format images | Lighthouse on mobile ≥ 90 performance for home and product pages; Vercel Speed Insights |
| Accessibility | Semantic HTML, labelled form fields, visible focus, colour contrast | Lighthouse a11y ≥ 95, keyboard-only test of browse → checkout, `/design:accessibility-review` before release |
| Correctness | Pure domain functions | Unit tests: pricing, cart merge, WhatsApp message, status transitions |
| Security | Server-side checks | Automated tests that customer and anonymous users get rejected from every admin action; security review before release |
| Reliability | Transactions for checkout; idempotency key | Test: double-submit creates one order |
| Observability | Vercel runtime logs; errors logged with order number or user ID (never passwords or full addresses); `error.tsx` boundaries | Manual check after each deploy |
| Backups / recovery | Neon point-in-time restore (check the free plan's history window) | Restore test once before launch |
| Migrations | Versioned migration files in git, applied before each production deploy | Preview deployments use a Neon branch database |

## 7. Environments
- **Local:** `next dev` with a Neon dev branch (or local Postgres).
- **Preview:** each pull request gets a Vercel preview with its own Neon branch.
- **Production:** main branch. Google OAuth and email sending need the production domain (OQ-4).

## 8. Failure modes

| Failure | Handling |
|---|---|
| Price or stock changed between cart and checkout | `placeOrder` returns the differences; shopper reviews; nothing is saved |
| Double-click / network retry on checkout | Idempotency key returns the existing order |
| WhatsApp not installed or the shopper never sends | Order stays "Sent to WhatsApp"; shopper can resend from order history; admin can cancel stale orders |
| Product archived while in carts | Shown as unavailable in the cart; skipped at checkout |
| Database or Blob outage | Error page with a retry; cached catalog pages may still be served |
| Email provider down | Sign-up shows "try again"; Google sign-in still works |

## 9. When to revisit
- A mobile app or third-party integration needs the data → add a versioned API.
- Payments are added → payment provider webhooks, payment status on orders, stricter idempotency.
- Stock counts are needed → quantity column, stock reserved in the checkout transaction.
- Catalog grows to thousands of products or search is requested → Postgres full-text search first, then a search service.
