import Link from "next/link";
import { products } from "../../data/products";
import { formatNaira } from "../../lib/format";

export const metadata = { title: "Products" };

export default function AdminProductsPage() {
    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta">Products</p>
                    <h1 className="mt-3 font-display text-4xl font-medium md:text-5xl">The collection</h1>
                </div>
                <Link
                    href="/admin/products/new"
                    className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                    + Add product
                </Link>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white/60">
                <div className="hidden grid-cols-[64px_1.6fr_0.8fr_0.8fr_1.2fr_auto] gap-4 border-b border-border px-6 py-3 text-xs uppercase tracking-[0.15em] text-brown/60 md:grid">
                    <span />
                    <span>Product</span>
                    <span>Category</span>
                    <span className="text-right">Price</span>
                    <span>Options</span>
                    <span className="w-14" />
                </div>
                <ul className="divide-y divide-border">
                    {products.map((product) => (
                        <li
                            key={product.id}
                            className="grid grid-cols-[64px_1fr_auto] items-center gap-4 px-6 py-4 md:grid-cols-[64px_1.6fr_0.8fr_0.8fr_1.2fr_auto]"
                        >
                            <img
                                src={product.image}
                                alt=""
                                className="h-16 w-16 rounded-lg bg-soft-green object-cover"
                            />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">{product.name}</p>
                                <p className="mt-0.5 text-xs text-brown/60">
                                    <span className="mr-2 inline-block rounded-full bg-mint px-2 py-0.5 text-forest">Live</span>
                                    {product.id}
                                </p>
                            </div>
                            <span className="hidden text-sm md:block">{product.category}</span>
                            <span className="text-right text-sm font-semibold md:text-right">{formatNaira(product.price)}</span>
                            <span className="col-span-2 text-xs text-brown/70 md:col-span-1">
                                {(product.sizes ?? []).join(", ") || "No sizes"}
                                <br />
                                {(product.colors ?? []).map((color) => color.name).join(", ") || "No colours"}
                            </span>
                            <Link
                                href={`/admin/products/${product.id}`}
                                className="w-14 rounded-lg border border-border px-3 py-1.5 text-center text-sm hover:border-brown"
                            >
                                Edit
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
