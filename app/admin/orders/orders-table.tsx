"use client";

import { useState } from "react";
import { formatNaira } from "../../lib/format";
import StatusBadge from "../_components/status-badge";
import {
    allowedTransitions,
    formatOrderDate,
    orderItemCount,
    orderSubtotal,
    sampleOrders,
    statusLabels,
} from "../_lib/orders";
import type { Order, OrderStatus } from "../_lib/orders";

const filters: { value: OrderStatus | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "sent", label: statusLabels.sent },
    { value: "confirmed", label: statusLabels.confirmed },
    { value: "completed", label: statusLabels.completed },
    { value: "cancelled", label: statusLabels.cancelled },
];

export default function OrdersTable() {
    // Preview: status changes live in memory only until orders are stored (M6).
    const [orders, setOrders] = useState<Order[]>(sampleOrders);
    const [filter, setFilter] = useState<OrderStatus | "all">("all");
    const [openReference, setOpenReference] = useState<string | null>(null);

    const visible = filter === "all" ? orders : orders.filter((order) => order.status === filter);

    function changeStatus(reference: string, next: OrderStatus) {
        setOrders((current) =>
            current.map((order) =>
                order.reference === reference && allowedTransitions[order.status].includes(next)
                    ? { ...order, status: next }
                    : order
            )
        );
    }

    return (
        <div>
            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
                {filters.map((option) => {
                    const count =
                        option.value === "all"
                            ? orders.length
                            : orders.filter((order) => order.status === option.value).length;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setFilter(option.value)}
                            aria-pressed={filter === option.value}
                            className={`rounded-full border px-4 py-2 text-sm transition-colors ${filter === option.value
                                ? "border-brown bg-brown text-cream"
                                : "border-border text-brown hover:border-brown"
                                }`}
                        >
                            {option.label} <span className="opacity-60">{count}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white/60">
                <div className="hidden grid-cols-[1.2fr_1.4fr_0.8fr_1fr_auto] gap-4 border-b border-border px-6 py-3 text-xs uppercase tracking-[0.15em] text-brown/60 md:grid">
                    <span>Order</span>
                    <span>Customer</span>
                    <span className="text-right">Items total</span>
                    <span>Status</span>
                    <span className="w-16" />
                </div>

                {visible.length === 0 && (
                    <p className="px-6 py-10 text-center text-sm text-brown/60">No orders with this status.</p>
                )}

                <ul className="divide-y divide-border">
                    {visible.map((order) => {
                        const isOpen = openReference === order.reference;
                        const nextStatuses = allowedTransitions[order.status];
                        const subtotal = orderSubtotal(order);

                        return (
                            <li key={order.reference}>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-6 py-4 md:grid-cols-[1.2fr_1.4fr_0.8fr_1fr_auto] md:items-center">
                                    <div>
                                        <p className="text-sm font-semibold">{order.reference}</p>
                                        <p className="text-xs text-brown/60">{formatOrderDate(order.createdAt)}</p>
                                    </div>
                                    <div className="text-right md:text-left">
                                        <p className="text-sm">{order.customer.name}</p>
                                        <p className="text-xs text-brown/60">
                                            {order.customer.city}, {order.customer.state}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold md:text-right">{formatNaira(subtotal)}</p>
                                    <div className="text-right md:text-left">
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setOpenReference(isOpen ? null : order.reference)}
                                        aria-expanded={isOpen}
                                        aria-controls={`order-${order.reference}`}
                                        className="col-span-2 w-full rounded-lg border border-border px-3 py-1.5 text-sm hover:border-brown md:col-span-1 md:w-16"
                                    >
                                        {isOpen ? "Close" : "View"}
                                    </button>
                                </div>

                                {isOpen && (
                                    <div id={`order-${order.reference}`} className="grid gap-6 border-t border-border bg-cream px-6 py-6 md:grid-cols-[1.4fr_1fr]">
                                        <div>
                                            <h3 className="text-xs uppercase tracking-[0.15em] text-brown/60">
                                                Items ({orderItemCount(order)})
                                            </h3>
                                            <ul className="mt-3 space-y-2 text-sm">
                                                {order.items.map((item) => (
                                                    <li key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-4">
                                                        <span>
                                                            {item.quantity} × {item.name}
                                                            <span className="text-brown/60"> · {item.size} · {item.color}</span>
                                                        </span>
                                                        <span>{formatNaira(item.unitPrice * item.quantity)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
                                                <div className="flex justify-between">
                                                    <dt className="text-brown/70">Delivery</dt>
                                                    <dd>{order.deliveryFee === null ? "To confirm" : formatNaira(order.deliveryFee)}</dd>
                                                </div>
                                                <div className="flex justify-between font-semibold">
                                                    <dt>Total</dt>
                                                    <dd>
                                                        {formatNaira(subtotal + (order.deliveryFee ?? 0))}
                                                        {order.deliveryFee === null && " + delivery"}
                                                    </dd>
                                                </div>
                                            </dl>
                                            {order.note && (
                                                <p className="mt-4 rounded-lg bg-mint px-4 py-3 text-sm">
                                                    <span className="font-semibold">Note:</span> {order.note}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-xs uppercase tracking-[0.15em] text-brown/60">Deliver to</h3>
                                            <p className="mt-3 text-sm leading-6">
                                                {order.customer.name}
                                                <br />
                                                {order.customer.phone}
                                                <br />
                                                {order.customer.address}
                                                <br />
                                                {order.customer.city}, {order.customer.state}
                                            </p>

                                            <h3 className="mt-6 text-xs uppercase tracking-[0.15em] text-brown/60">Update status</h3>
                                            {nextStatuses.length === 0 ? (
                                                <p className="mt-3 text-sm text-brown/60">
                                                    This order is {statusLabels[order.status].toLowerCase()}. No further changes.
                                                </p>
                                            ) : (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {nextStatuses.map((next) => (
                                                        <button
                                                            key={next}
                                                            type="button"
                                                            onClick={() => changeStatus(order.reference, next)}
                                                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 ${next === "cancelled"
                                                                ? "border border-terracotta text-terracotta"
                                                                : "bg-forest text-white"
                                                                }`}
                                                        >
                                                            {next === "cancelled" ? "Cancel order" : `Mark ${statusLabels[next].toLowerCase()}`}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
