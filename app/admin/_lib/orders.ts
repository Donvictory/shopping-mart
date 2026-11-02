/**
 * PREVIEW DATA. Sample orders shaped like ADR-0004: each order keeps a copy
 * of item name, size, colour and price at the time of ordering. Replace
 * with database reads in milestone M6.
 */

export type OrderStatus = "sent" | "confirmed" | "completed" | "cancelled";

export type OrderItem = {
    productId: string;
    name: string;
    size: string;
    color: string;
    unitPrice: number;
    quantity: number;
};

export type Order = {
    reference: string;
    createdAt: string;
    customer: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
    };
    items: OrderItem[];
    deliveryFee: number | null;
    note?: string;
    status: OrderStatus;
};

export const statusLabels: Record<OrderStatus, string> = {
    sent: "Sent to WhatsApp",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
};

export const statusStyles: Record<OrderStatus, string> = {
    sent: "bg-pale-yellow text-brown",
    confirmed: "bg-mint text-forest",
    completed: "bg-forest text-white",
    cancelled: "bg-border text-brown/70",
};

/** Allowed status changes (ADR-0004): only forward, or cancel before completion. */
export const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    sent: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
};

export function orderSubtotal(order: Order): number {
    return order.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

export function orderItemCount(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
}

export const sampleOrders: Order[] = [
    {
        reference: "LO-K3F9QZ",
        createdAt: "2026-11-02T09:14:00+01:00",
        customer: { name: "Sample Customer A", phone: "0803 000 0001", address: "1 Sample Street", city: "Ikeja", state: "Lagos" },
        items: [
            { productId: "product-1", name: "Sunny stripe tee", size: "4–5", color: "Honey", unitPrice: 12000, quantity: 2 },
            { productId: "product-2", name: "Everyday play shorts", size: "4–5", color: "Chambray", unitPrice: 14000, quantity: 1 },
        ],
        deliveryFee: null,
        note: "Gift wrap please",
        status: "sent",
    },
    {
        reference: "LO-K3E1MA",
        createdAt: "2026-11-01T16:40:00+01:00",
        customer: { name: "Sample Customer B", phone: "0803 000 0002", address: "2 Sample Close", city: "Wuse", state: "FCT" },
        items: [
            { productId: "product-3", name: "Meadow day dress", size: "6–7", color: "Meadow green", unitPrice: 22000, quantity: 1 },
        ],
        deliveryFee: 3000,
        status: "confirmed",
    },
    {
        reference: "LO-K3C7TR",
        createdAt: "2026-10-30T11:05:00+01:00",
        customer: { name: "Sample Customer C", phone: "0803 000 0003", address: "3 Sample Avenue", city: "Port Harcourt", state: "Rivers" },
        items: [
            { productId: "product-4", name: "Cloud knit cardigan", size: "2–3", color: "Mint", unitPrice: 26000, quantity: 3 },
        ],
        deliveryFee: 3500,
        status: "completed",
    },
    {
        reference: "LO-K3B2PL",
        createdAt: "2026-10-29T14:22:00+01:00",
        customer: { name: "Sample Customer D", phone: "0803 000 0004", address: "4 Sample Road", city: "Ibadan", state: "Oyo" },
        items: [
            { productId: "product-1", name: "Sunny stripe tee", size: "6–7", color: "Sage", unitPrice: 12000, quantity: 1 },
        ],
        deliveryFee: null,
        status: "cancelled",
    },
];

export function formatOrderDate(iso: string): string {
    return new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Africa/Lagos",
    }).format(new Date(iso));
}
