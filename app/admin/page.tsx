import Link from "next/link";
import { ArrowRightIcon } from "../components/icons";
import { products } from "../data/products";
import { formatNaira } from "../lib/format";
import StatusBadge from "./_components/status-badge";
import { formatOrderDate, orderItemCount, orderSubtotal, sampleOrders } from "./_lib/orders";

export const metadata = { title: "Overview" };

export default function AdminOverviewPage() {
    const awaiting = sampleOrders.filter((order) => order.status === "sent").length;
    const confirmed = sampleOrders.filter((order) => order.status === "confirmed").length;
    const completedRevenue = sampleOrders
        .filter((order) => order.status === "completed")
        .reduce((total, order) => total + orderSubtotal(order), 0);

    const stats = [
        { label: "Awaiting reply", value: String(awaiting), hint: "Sent to WhatsApp", href: "/admin/orders" },
        { label: "Confirmed", value: String(confirmed), hint: "To pack and deliver", href: "/admin/orders" },
        { label: "Completed sales", value: formatNaira(completedRevenue), hint: "Items only, excl. delivery", href: "/admin/orders" },
        { label: "Products live", value: String(products.length), hint: "In the shop", href: "/admin/products" },
    ];

    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta">Dashboard</p>
            <h1 className="mt-3 font-display text-4xl font-medium md:text-5xl">Your little shop</h1>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="rounded-2xl border border-border bg-white/60 p-6 transition-colors hover:border-brown"
                    >
                        <p className="text-sm text-brown/70">{stat.label}</p>
                        <p className="mt-3 font-display text-3xl">{stat.value}</p>
                        <p className="mt-1 text-xs text-brown/60">{stat.hint}</p>
                    </Link>
                ))}
            </div>

            <section className="mt-10 rounded-2xl border border-border bg-white/60 p-6">
                <div className="flex items-baseline justify-between">
                    <h2 className="font-display text-2xl">Recent orders</h2>
                    <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:text-brown">
                        All orders <ArrowRightIcon size={14} />
                    </Link>
                </div>
                <ul className="mt-4 divide-y divide-border">
                    {sampleOrders.map((order) => (
                        <li key={order.reference} className="flex flex-wrap items-center justify-between gap-3 py-4">
                            <div>
                                <p className="text-sm font-semibold">
                                    {order.reference}
                                    <span className="ml-2 font-normal text-brown/60">{order.customer.name}</span>
                                </p>
                                <p className="mt-0.5 text-xs text-brown/60">
                                    {formatOrderDate(order.createdAt)} · {orderItemCount(order)} items · {order.customer.city}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold">{formatNaira(orderSubtotal(order))}</span>
                                <StatusBadge status={order.status} />
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
