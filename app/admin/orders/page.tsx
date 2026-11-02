import OrdersTable from "./orders-table";

export const metadata = { title: "Orders" };

export default function AdminOrdersPage() {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta">Orders</p>
            <h1 className="mt-3 font-display text-4xl font-medium md:text-5xl">Little orders</h1>
            <p className="mt-3 max-w-2xl text-sm text-brown/70">
                Orders arrive as <strong>Sent to WhatsApp</strong>. Confirm them once you&apos;ve agreed
                stock, delivery and payment with the customer in the chat.
            </p>
            <OrdersTable />
        </div>
    );
}
