# ADR-0004: Save orders, then hand off to WhatsApp

Status: **Accepted** · Date: 2026-10-31

## Context
Orders are completed and paid on WhatsApp with the seller. The seller and customers want an order list and history. The app cannot see the WhatsApp chat.

## Decision
- At checkout the server re-prices the cart, checks stock, and saves the order and a **copy** of each item (name, size, price) in one transaction, with an idempotency key.
- It then opens a `wa.me` link to the seller with a message built from the saved order, including the order number.
- Order status starts as *Sent to WhatsApp*. Only an admin moves it to *Confirmed*, *Completed* or *Cancelled*.

## Alternatives considered
- **Don't save orders (WhatsApp only):** simpler, but no order history or admin order list.
- **WhatsApp Business API:** could confirm messages automatically, but needs Meta business verification, has per-conversation costs, and is far more complex.

## Consequences
- Some orders will never be sent by the shopper. They remain *Sent to WhatsApp* until an admin cancels them.
- Prices in past orders never change, even if products are edited.

## Revisit when
Online payment is added, or message volume justifies the WhatsApp Business API.
