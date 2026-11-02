# ADR-0002: Postgres on Neon, images on Vercel Blob

Status: **Postgres accepted; Neon and Blob proposed** · Date: 2026-10-31

## Context
Data is relational: products → sizes → order items, users → carts → orders. Checkout needs transactions. The shop is low-traffic and should stay on free tiers.

## Decision
- **Postgres**, hosted on **Neon** and connected through the Vercel Marketplace.
- **Vercel Blob** for product photos, served through `next/image`.

## Alternatives considered
- **Supabase:** Postgres + storage + auth in one. Free projects pause after about a week without activity, which is risky for a quiet shop. We are also already using a separate auth library.
- **Headless CMS (e.g. Sanity):** gives a ready-made admin editor, but carts, orders and accounts would still need a database, and the admin experience would be split across two tools.
- **Document database:** no benefit for this clearly relational data.

## Consequences
- Pros: managed in the Vercel dashboard; free tier suspends when idle and resumes automatically (first request after idle can be slightly slower); database branches for preview deployments.
- Cons: two services to configure; images are public by URL (acceptable for product photos).

## Revisit when
Traffic or data outgrows the free tier, or a CMS-style editing experience becomes more important than custom admin features.
