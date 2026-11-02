# ADR-0001: One Next.js app, no separate backend

Status: **Accepted** · Date: 2026-10-31

## Context
The shop needs a storefront, shopper accounts, a cart, checkout that saves orders, and an admin dashboard. One seller, about 50+ products, low traffic, hosted on Vercel. One developer.

## Decision
Build everything in a single Next.js 16 app. Server Components, Server Actions and Route Handlers act as the backend and talk directly to Postgres. Business rules live in `lib/domain` and `lib/dal`, not in pages.

## Alternatives considered
- **Separate Express/Node API + Next.js frontend:** two deployments, CORS and cross-domain cookie problems, types and validation duplicated. It would only help with clients we don't have.
- **Microservices:** far beyond the needs of a one-seller shop.

## Consequences
- Pros: one codebase, one deployment, shared types, simplest security model (same-origin cookies).
- Cons: Server Actions are reachable by direct POST, so each one must check auth itself (handled by the DAL helpers). There is no public API for other clients.

## Revisit when
A mobile app or third party needs the data, or long-running background jobs are required.
