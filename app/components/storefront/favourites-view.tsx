"use client";

import Link from "next/link";
import { products } from "../../data/products";
import { HeartIcon } from "../icons";
import ProductGrid from "./product-grid";
import { useFavourites } from "./use-favourites";

export default function FavouritesView() {
    const { favouriteIds, isLoaded } = useFavourites();

    // Most recently saved first. IDs are already checked against the catalogue.
    const favourites = [...favouriteIds]
        .reverse()
        .map((id) => products.find((product) => product.id === id))
        .filter((product) => product !== undefined);

    const count = favourites.length;

    return (
        <section aria-labelledby="favourites-heading" className="bg-cream px-6 py-12 md:px-16 md:py-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta">
                Saved for later
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
                <h1 id="favourites-heading" className="font-display text-4xl font-medium tracking-tight text-brown md:text-5xl">
                    Your favourites
                </h1>
                {isLoaded && count > 0 && (
                    <span className="rounded-full bg-pale-yellow px-3 py-1 text-sm font-medium text-brown">
                        {count} {count === 1 ? "piece" : "pieces"}
                    </span>
                )}
            </div>

            {!isLoaded ? (
                <p className="py-16 text-sm text-brown/60" role="status">
                    Loading your favourites…
                </p>
            ) : count === 0 ? (
                <div className="mx-auto max-w-md py-16 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-soft-green text-terracotta">
                        <HeartIcon size={26} />
                    </span>
                    <p className="mt-5 font-display text-2xl text-brown">No favourites yet</p>
                    <p className="mt-3 text-sm leading-6 text-brown/70">
                        Tap the heart on any product to save it here for later.
                    </p>
                    <Link
                        href="/products"
                        className="mt-8 inline-block rounded-full bg-terracotta px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        Browse all clothing
                    </Link>
                </div>
            ) : (
                <>
                    <p className="mt-3 text-sm text-brown/60">
                        Tap a heart again to remove it.
                    </p>
                    <ProductGrid products={favourites} />
                </>
            )}
        </section>
    );
}
