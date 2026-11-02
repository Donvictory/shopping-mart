# Requirements — Shopping Mart (MVP)

Status: **Draft for approval** · Last updated: 2026-10-31

Legend: **[Confirmed]** decided by the product owner · **[Assumption]** default chosen in planning; change if wrong.

## 1. Product summary

An online clothing shop for children and teenagers, run by **one seller**. Shoppers browse products, pick sizes, add items to a cart, and complete the order **on WhatsApp** with the seller. No payment happens inside the app.

## 2. Users and roles

| Role | Who | Can do |
|---|---|---|
| Visitor | Anyone, not signed in | Browse catalog, filter, view products, use a guest cart |
| Customer | Signed-in shopper (parent / adult, 18+) **[Confirmed]** | Everything a visitor can, plus checkout, saved cart, saved delivery details, order history |
| Admin | Seller staff. One at launch, more later **[Confirmed]** | Manage products, sizes, images, categories, stock status; view and update orders |

## 3. Functional requirements

### 3.1 Catalog
- FR-1 Products have a name, description, base price, a gender (e.g. boys / girls / unisex) and a type category (e.g. tops, dresses, shoes). **[Confirmed: grouped by gender and type]**
- FR-2 Each product has one or more **sizes**. Each size can be marked in stock or out of stock on its own. **[Confirmed]**
- FR-3 A size may have its own price that overrides the product's base price. **[Confirmed: "in some cases"]**
- FR-4 Each product has up to **5 photos**. **[Assumption]**
- FR-5 Shoppers can filter the catalog by gender and by type. **No free-text search in the MVP.** **[Assumption]**
- FR-6 Out-of-stock sizes are shown but cannot be added to the cart. A product with all sizes out of stock is shown as "Out of stock".
- FR-7 Prices are shown in **Naira (₦) only**. **[Confirmed]**

### 3.2 Cart
- FR-8 Anyone can add items (product + size + quantity) to a cart without signing in. **[Confirmed: sign in only at checkout]**
- FR-9 The guest cart is kept when the browser is closed and reopened.
- FR-10 When a shopper signs in, the guest cart is merged into their account cart. Their cart then follows them across devices.
- FR-11 The cart always shows current prices and stock status, not the values from when the item was added.

### 3.3 Accounts
- FR-12 Shoppers can sign up and sign in with **Google** or with **email and password**. **[Confirmed]**
- FR-13 Email-and-password accounts need email verification and password reset by email.
- FR-14 During sign-up, shoppers confirm they are 18 or older and accept the privacy notice. **[Assumption]**
- FR-15 Customers can save their name, phone number and delivery address, and update them later.
- FR-16 Customers can delete their account.

### 3.4 Checkout and orders
- FR-17 Checkout requires signing in. The shopper confirms their name, phone and delivery address.
- FR-18 At checkout, the server re-checks current prices and stock. If anything changed or is out of stock, the shopper is told before continuing.
- FR-19 The app **saves the order** with an order number, then opens WhatsApp with a pre-filled message to the seller containing the order number, items, sizes, quantities, prices, total and delivery details. **[Confirmed: record orders]**
- FR-20 The order keeps a copy of the item names, sizes and prices at the time it was placed. Later product edits do not change past orders.
- FR-21 Customers can see their order history and status, and resend an order's WhatsApp message.
- FR-22 Delivery fees and final payment are agreed on WhatsApp and are **not** calculated in the app. **[Assumption]**

### 3.5 Admin dashboard
- FR-23 Admins sign in using the same login system. Only accounts with the admin role can open the dashboard.
- FR-24 Admins can create, edit, publish/unpublish (archive) products, and manage sizes, per-size prices, stock status and photos.
- FR-25 Admins can manage the gender and type categories used for filtering.
- FR-26 Admins can list orders, view details, and change order status: *Sent to WhatsApp → Confirmed → Completed*, or *Cancelled*.
- FR-27 Admin changes appear on the shop straight away.
- FR-28 There is no public admin sign-up. The first admin is created by a setup script. Later, an admin can grant the admin role to another account. **[Confirmed: support more admins later]**

## 4. Non-functional requirements
- NFR-1 **Scale:** at least 50 products at launch; low traffic. Must stay within free or low-cost tiers. **[Confirmed: "minimally big"]**
- NFR-2 **Hosting:** Vercel. **[Confirmed]** Database: Postgres. **[Confirmed]** Auth: an existing auth library. **[Confirmed]**
- NFR-3 **Security:** every admin and customer action is authorised on the server. Prices and stock are never trusted from the browser.
- NFR-4 **Privacy:** follows the Nigeria Data Protection Act. Privacy notice, collect only needed data, account deletion.
- NFR-5 **Performance:** catalog pages load quickly on mobile networks. Product images are optimised.
- NFR-6 **Accessibility:** storefront and checkout usable with a keyboard and a screen reader. Target WCAG 2.1 AA.
- NFR-7 **Mobile first:** most shoppers will use phones.

## 5. Out of scope for the MVP
Online payment · stock quantities and automatic stock deduction · delivery fee calculation · search bar · wishlist · back-in-stock alerts · discount codes · two-factor login for admins · multiple sellers · multiple currencies.

## 6. Open questions
- OQ-1 Seller's WhatsApp number (needed for configuration).
- OQ-2 Is there a maximum quantity per item in one order? (Assumption: 10.)
- OQ-3 Confirm the 5-photo limit and "no search" for the MVP.
- OQ-4 Domain name for the shop (needed for Google sign-in and email setup).
