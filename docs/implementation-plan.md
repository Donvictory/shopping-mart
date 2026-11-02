# Implementation Plan — Shopping Mart (MVP)

Status: **Draft for approval** · Last updated: 2026-10-31
Related: [architecture.md](architecture.md)

Each milestone ends with something working that can be deployed to a Vercel preview and checked.

## M0 — Decisions and setup
- Decide the **Open** items: ORM (Drizzle or Prisma); confirm Better Auth and Resend.
- Create the Neon database through Vercel Marketplace; create Vercel Blob storage.
- Set environment variables (local, Preview, Production).
- Add a test runner for unit tests, and Playwright for end-to-end tests.
- **Done when:** the app deploys to Vercel and connects to the database.

## M1 — Database and admin sign-in
- Schema and first migration (all tables in architecture §3).
- Auth library set up with email-and-password; `role` on `user`.
- `lib/dal/session.ts`: `requireUser()`, `requireAdmin()`; `proxy.ts` redirects.
- `create-admin` script; seed script with sample categories and products.
- **Done when:** the admin can sign in to `/admin`; a customer account is rejected (tested).

## M2 — Admin product management
- Categories: create, edit, reorder.
- Products: create, edit, draft/active/archive, gender, category, base price.
- Sizes: add, remove, reorder, price override, in-stock switch.
- Photos: direct Blob upload, alt text, reorder, max 5.
- Cache tags cleared on every change.
- **Done when:** the admin can create a full product with sizes and photos, and every admin action rejects non-admins (tested).
- Depends on: M1.

## M3 — Storefront catalog
- Home, product list with gender and type filters, product page with size picker.
- Out-of-stock display rules (FR-6); Naira formatting.
- Cached catalog reads; mobile-first layout.
- **Done when:** an admin change appears on the shop straight away; Lighthouse targets met on the product page.
- Depends on: M2 (needs real data to display).

## M4 — Cart and shopper accounts
- Guest cart in `localStorage`; cart page with current prices and stock.
- Google sign-in; email-and-password with verification and password reset (Resend).
- 18+ and privacy consent at sign-up; privacy notice page.
- Account cart in the DB; guest cart merge on sign-in.
- **Done when:** a guest cart survives a browser restart and merges correctly after sign-in (unit + end-to-end tests).
- Depends on: M3. Needs a domain or Vercel URL configured in Google Cloud for OAuth.

## M5 — Checkout, orders and WhatsApp
- Checkout page with saved contact details.
- `placeOrder` action: re-price, re-check stock, transaction, idempotency, rate limit.
- WhatsApp message builder and redirect; order confirmation page with "Resend".
- **Done when:** end-to-end test — browse → add to cart → sign in → checkout → order saved → correct `wa.me` link; double-submit creates one order.
- Depends on: M4. Needs the seller's WhatsApp number (OQ-1).

## M6 — Orders for admin and customers
- Admin order list, detail view, status changes (enforced transitions).
- Customer order history and order detail.
- Admin page to grant or remove the admin role (last-admin safeguard).
- **Done when:** the full order lifecycle works and customers can only see their own orders (tested).
- Depends on: M5.

## M7 — Hardening and release
- Account deletion with order anonymisation.
- Error pages, logging review, backup-restore test.
- Accessibility pass and security review (`/application-security-review`, `/release-review`).
- Production domain, Google OAuth and email domain verification.
- **Done when:** the release review passes.

## Order and dependencies
```
M0 ─► M1 ─► M2 ─► M3 ─► M4 ─► M5 ─► M6 ─► M7
```
M3 storefront layout work can start alongside M2 using seed data.

## Information needed before certain milestones
| Needed | By |
|---|---|
| ORM choice | M0 |
| Seller WhatsApp number | M5 |
| Production domain | M4 (OAuth), M7 (launch) |
| Max quantity per item (assumed 10) | M4 |
