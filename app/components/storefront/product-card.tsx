import Link from "next/link";
import type { Product } from "../../data/products";
import { formatNaira } from "../../lib/format";
import FavouriteButton from "./favourite-button";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const { id, name, price, image, colors = [], ageRange } = product;
    // e.g. "Honey / Sage · 2–8 years"
    const age = ageRange ? `${ageRange.replace(/^Ages\s*/i, "")} years` : "";
    const subtitle = [colors.map((color) => color.name).join(" / "), age]
        .filter(Boolean)
        .join(" · ");

    return (
        // The favourite button sits beside the link (not inside it), since a
        // button nested in a link is invalid HTML and would trigger navigation.
        <article className="group relative h-full rounded-xl border border-border bg-white/40 p-2 transition-colors hover:border-brown/40 sm:p-3 md:p-4">
            {/* prefetch resolves this product's URL data ahead of the click, so the
                details page opens without showing its loading skeleton. */}
            <Link href={`/products/${id}`} prefetch className="block">
                <div className="aspect-[4/5] overflow-hidden rounded-lg bg-soft-green">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div
                            className="flex h-full w-full items-center justify-center"
                            aria-label="Product image coming soon"
                        >
                            <span className="font-display text-sm italic text-brown/60">
                                Image coming soon
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-3 px-1 pb-1 md:mt-4">
                    <div className="flex flex-col gap-0.5 md:flex-row md:items-start md:justify-between md:gap-3">
                        <h3 className="text-sm font-semibold leading-snug text-brown md:text-base">{name}</h3>
                        <p className="shrink-0 text-sm text-brown md:text-base">{formatNaira(price)}</p>
                    </div>

                    {subtitle && <p className="mt-1 text-xs leading-snug text-brown/60 md:text-sm">{subtitle}</p>}

                    {colors.length > 0 && (
                        <ul className="mt-2 flex gap-1.5 md:mt-2.5" aria-label={`Colours: ${colors.map((color) => color.name).join(", ")}`}>
                            {colors.map((color) => (
                                <li
                                    key={color.name}
                                    className="h-3.5 w-3.5 rounded-full border border-black/10"
                                    style={{ backgroundColor: color.hex }}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </Link>

            {/* Top-right of the image: card padding (8 / 12 / 16px) + a small inset. */}
            <FavouriteButton
                productId={id}
                productName={name}
                className="absolute right-3.5 top-3.5 sm:right-[20px] sm:top-[20px] md:right-[26px] md:top-[26px]"
            />
        </article>
    );
}
