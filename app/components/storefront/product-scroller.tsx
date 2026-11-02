"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "../../data/products";
import { ArrowLeftIcon, ArrowRightIcon } from "../icons";
import ProductCard from "./product-card";

/**
 * Horizontal, swipeable product row used on the home page at every size.
 * Card widths leave the next card partly visible so it's clear there's more:
 *   phones: 1 card + half of the next, growing to about 4.5 cards on desktop.
 * Arrow buttons appear from tablet up for mouse users.
 */
export default function ProductScroller({ products }: { products: Product[] }) {
    const trackRef = useRef<HTMLUListElement>(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollForward, setCanScrollForward] = useState(products.length > 1);

    function updateArrows() {
        const track = trackRef.current;
        if (!track) return;
        setCanScrollBack(track.scrollLeft > 4);
        setCanScrollForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
    }

    useEffect(() => {
        updateArrows();
        window.addEventListener("resize", updateArrows);
        return () => window.removeEventListener("resize", updateArrows);
    }, []);

    function scrollByCards(direction: 1 | -1) {
        const track = trackRef.current;
        const card = track?.firstElementChild as HTMLElement | null;
        if (!track || !card) return;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        // Move by the number of whole cards that fit, at least one.
        const perView = Math.max(1, Math.floor(track.clientWidth / (card.offsetWidth + gap)));
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        track.scrollBy({
            left: direction * perView * (card.offsetWidth + gap),
            behavior: reduceMotion ? "auto" : "smooth",
        });
    }

    return (
        <div className="relative mt-8 md:mt-10">
            <ul
                ref={trackRef}
                onScroll={updateArrows}
                aria-label="Products"
                className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 pb-1 [scrollbar-width:none] sm:gap-4 md:-mx-16 md:scroll-px-16 md:gap-6 md:px-16 [&::-webkit-scrollbar]:hidden"
            >
                {products.map((product) => (
                    <li
                        key={product.id}
                        className="w-[64%] shrink-0 snap-start min-[430px]:w-[46%] sm:w-[36%] md:w-[30%] lg:w-[22%]"
                    >
                        <ProductCard product={product} />
                    </li>
                ))}
            </ul>

            {products.length > 1 && (
                <div className="mt-5 hidden justify-end gap-3 md:flex">
                    <button
                        type="button"
                        onClick={() => scrollByCards(-1)}
                        disabled={!canScrollBack}
                        aria-label="Scroll to previous products"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/60 text-brown transition-colors hover:border-brown disabled:opacity-30"
                    >
                        <ArrowLeftIcon />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollByCards(1)}
                        disabled={!canScrollForward}
                        aria-label="Scroll to more products"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/60 text-brown transition-colors hover:border-brown disabled:opacity-30"
                    >
                        <ArrowRightIcon />
                    </button>
                </div>
            )}
        </div>
    );
}
