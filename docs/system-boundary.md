# System Boundary — Shopping Mart

Status: **Draft for approval** · Last updated: 2026-10-31

## 1. What the application is responsible for
- Showing the catalog: products, sizes, prices, stock status, photos, filters.
- The guest cart (in the browser) and the account cart (in the database).
- Shopper and admin accounts, sessions and roles.
- Checking prices and stock on the server at checkout.
- Saving orders and building the WhatsApp message.
- The admin dashboard: products, categories, images, orders, admin role grants.
- Privacy features: privacy notice, consent at sign-up, account deletion.

## 2. What belongs to external services

| Service | Responsibility | Data it holds |
|---|---|---|
| **Vercel** | Hosting, server functions, CDN, image optimisation, logs | Request logs |
| **Neon Postgres** (via Vercel Marketplace) | All application data | Users, sessions, products, carts, orders |
| **Vercel Blob** | Storing product photos | Image files (public) |
| **Google OAuth** | Verifying Google sign-in | Google holds the account; we receive name, email, picture |
| **Email provider** (proposed: Resend) | Sending verification and password-reset emails | Recipient email addresses, message logs |
| **WhatsApp** (`wa.me` link) | The conversation where the order is confirmed and paid | The chat. The app never reads or controls it. |

The app does **not** handle payments, delivery or the WhatsApp conversation itself.

## 3. Context diagram

```
                       ┌──────────────── Vercel ────────────────┐
  Shopper (browser) ──►│  Next.js app                            │
   - guest cart in     │   ├─ Storefront pages (cached)          │──► Neon Postgres
     localStorage      │   ├─ Account & checkout (per-request)   │
                       │   ├─ Admin dashboard (/admin)           │──► Vercel Blob (photos)
  Admin (browser) ────►│   ├─ Server Actions / Route Handlers    │
                       │   └─ Auth library (sessions, roles)     │──► Email provider
                       └─────────────────────────────────────────┘
         │                         ▲
         │ Google sign-in          │ OAuth callback
         └──────► Google ──────────┘

  Shopper ── clicks "Send on WhatsApp" ──► WhatsApp ──► Seller's phone
           (message pre-filled by the app; sent by the shopper)
```

## 4. Trust boundaries

| # | Boundary | Rule |
|---|---|---|
| TB-1 | **Browser → server** | Everything from the browser is untrusted: form data, cart contents, prices, IDs, URL parameters. The server validates every input and looks up prices and stock itself. |
| TB-2 | **Customer → another customer's data** | Cart, profile and order queries are always filtered by the signed-in user's ID from the session, never by an ID sent from the browser. |
| TB-3 | **Customer → admin** | Every admin page, Server Action and upload route checks `role = admin` on the server. Proxy redirects are a convenience only, not protection. |
| TB-4 | **App → external services** | Secrets (database URL, Blob token, OAuth secret, email API key, auth secret) live only in Vercel environment variables. They are never sent to the browser or committed to git. |
| TB-5 | **WhatsApp** | The app cannot know whether a message was sent or an order was paid. Order status after "Sent to WhatsApp" is set only by an admin. |
| TB-6 | **Public images** | Product photos in Blob are public by URL. Nothing private may be uploaded there. |

## 5. Explicitly out of scope
Payments and refunds · delivery tracking · reading or automating WhatsApp (no WhatsApp Business API) · multiple sellers · a separate backend service · a mobile app.
