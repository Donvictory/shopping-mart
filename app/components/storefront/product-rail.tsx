"use client";

import { useRef, useState } from "react";
import type { Product } from "../../data/products";
import { ArrowLeftIcon, ArrowRightIcon } from "../icons";
import ProductCard from "./product-card";

/**
 * Mobile (< 768px): a horizontal, swipeable row showing one full-width card
 * at a time, snapping to each card, with previous/next buttons and a counter.
 * Tablet (md): 2-column grid. Desktop (lg): 4-column grid.
 */
export default function ProductRail({ products }: { products: Product[] }) {
    const trackRef = useRef<HTMLUListElement>(null);
    const [index, setIndex] = useState(0);

    /** Width of one card plus the gap, i.e. the distance between snap points. */
    function stepSize(track: HTMLUListElement) {
        const first = track.firstElementChild as HTMLElement | null;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return first ? first.offsetWidth + gap : track.clientWidth;
    }

    function onScroll() {
        const track = trackRef.current;
        if (!track) return;
        const next = Math.round(track.scrollLeft / stepSize(track));
        setIndex(Math.max(0, Math.min(products.length - 1, next)));
    }

    function goTo(target: number) {
        const track = trackRef.current;
        if (!track) return;
        const clamped = Math.max(0, Math.min(products.length - 1, target));
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        track.scrollTo({ left: clamped * stepSize(track), behavior: reduceMotion ? "auto" : "smooth" });
    }

    return (
        <div className="mt-10">
            <ul
                ref={trackRef}
                onScroll={onScroll}
                aria-label="Products"
                className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
            >
                {products.map((product, position) => (
                    <li
                        key={product.id}
                        aria-label={`${position + 1} of ${products.length}`}
                        className="w-full shrink-0 snap-start snap-always md:w-auto"
                    >
                        <ProductCard product={product} />
                    </li>
                ))}
            </ul>

            {products.length > 1 && (
                <div className="mt-5 flex items-center justify-between md:hidden">
                    <button
                        type="button"
                        onClick={() => goTo(index - 1)}
                        disabled={index === 0}
                        aria-label="Previous product"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/60 text-brown transition-colors hover:border-brown disabled:opacity-30"
                    >
                        <ArrowLeftIcon />
                    </button>

                    <p className="text-sm text-brown/70" aria-live="polite">
                        <span className="font-semibold text-brown">{index + 1}</span> of {products.length}
                    </p>

                    <button
                        type="button"
                        onClick={() => goTo(index + 1)}
                        disabled={index === products.length - 1}
                        aria-label="Next product"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/60 text-brown transition-colors hover:border-brown disabled:opacity-30"
                    >
                        <ArrowRightIcon />
                    </button>
                </div>
            )}
        </div>
    );
}
