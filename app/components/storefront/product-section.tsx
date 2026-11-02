"use client";
import Link from "next/link";
import { categories, products } from "../../data/products";
import { searchProducts } from "../../lib/search";
import { ArrowRightIcon, CloseIcon, SearchIcon } from "../icons";
import ProductRail from "./product-rail";
import { useState } from "react";

const ALL_CATEGORIES = "All the good stuff";

const productCategories = [ALL_CATEGORIES, ...categories];

type ProductSectionProps = {
    /** Max products shown; the "Shop all clothing" link appears when set. */
    limit?: number;
    /** Renders the heading as the page's h1 (on /products). */
    isPageHeading?: boolean;
};

export default function ProductSection({ limit, isPageHeading = false }: ProductSectionProps) {
    const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
    const [query, setQuery] = useState("");
    const showSearch = isPageHeading;
    const hasQuery = showSearch && query.trim().length > 0;

    const inCategory =
        activeCategory === ALL_CATEGORIES
            ? products
            : products.filter(
                (product) => product.category === activeCategory
            );
    // Search narrows the chosen category and ranks name/category matches first.
    const filteredProducts = hasQuery ? searchProducts(query, inCategory) : inCategory;
    const visibleProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;
    const Heading = isPageHeading ? "h1" : "h2";

    return (
        <section id="shop" className="bg-cream px-6 py-12 md:px-16 md:py-20">
            {showSearch && (
                <form
                    role="search"
                    onSubmit={(event) => event.preventDefault()}
                    className="mb-10"
                >
                    <label htmlFor="product-search" className="sr-only">
                        Search products
                    </label>
                    <div className="flex items-center gap-3 rounded-full border border-border bg-white px-5 py-3 transition-colors focus-within:border-brown">
                        <SearchIcon className="shrink-0 text-brown/70" />
                        <input
                            id="product-search"
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Escape") setQuery("");
                            }}
                            placeholder="Search tees, dresses, colours, sizes…"
                            autoComplete="off"
                            enterKeyHint="search"
                            className="min-w-0 flex-1 bg-transparent text-base text-brown outline-none placeholder:text-brown/40 [&::-webkit-search-cancel-button]:hidden"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                aria-label="Clear search"
                                className="shrink-0 rounded-full p-1 text-brown/60 hover:text-terracotta"
                            >
                                <CloseIcon size={16} />
                            </button>
                        )}
                    </div>
                </form>
            )}

            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-terracotta">
                        {isPageHeading ? "Everything in the orbit" : "Good days start here"}
                    </p>

                    <Heading className="font-display text-4xl font-medium tracking-tight text-brown md:text-5xl">
                        {isPageHeading ? "Shop all clothing" : "The everyday edit"}
                    </Heading>
                </div>

                {limit !== undefined ? (
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta transition-colors hover:text-brown"
                    >
                        Shop all clothing
                        <ArrowRightIcon size={16} />
                    </Link>
                ) : (
                    <p className="text-sm text-brown/60" role="status">
                        {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
                    </p>
                )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
                {productCategories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => (setActiveCategory(category))}
                        aria-pressed={activeCategory === category}
                        className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${activeCategory === category
                            ? "border-brown bg-brown text-cream"
                            : "border-border bg-transparent text-brown hover:border-brown"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {visibleProducts.length > 0 ? (
                // Keyed on the filters so the swipe row restarts at the first card.
                <ProductRail key={`${activeCategory}|${query.trim()}`} products={visibleProducts} />
            ) : (
                <p className="mt-12 text-sm text-brown/70">
                    {hasQuery
                        ? <>No products match &ldquo;{query.trim()}&rdquo;{activeCategory !== ALL_CATEGORIES && ` in ${activeCategory}`}. Try another word or category.</>
                        : <>Nothing here yet. New {activeCategory.toLowerCase()} are on their way.</>}
                </p>
            )}
        </section>
    );
}
