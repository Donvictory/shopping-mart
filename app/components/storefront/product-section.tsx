"use client";
import Link from "next/link";
import { categories, products } from "../../data/products";
import { searchProducts } from "../../lib/search";
import { ArrowRightIcon, CloseIcon, SearchIcon } from "../icons";
import Pagination from "./pagination";
import ProductGrid from "./product-grid";
import ProductScroller from "./product-scroller";
import { useRef, useState } from "react";

const ALL_CATEGORIES = "All the good stuff";
const PRODUCTS_PER_PAGE = 10;

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
    const [page, setPage] = useState(1);
    const resultsRef = useRef<HTMLDivElement>(null);
    const showSearch = isPageHeading;
    const hasQuery = showSearch && query.trim().length > 0;
    // Home page: horizontal scroll row. Products page: paginated grid.
    const isHome = !isPageHeading;

    function chooseCategory(category: string) {
        setActiveCategory(category);
        setPage(1);
    }

    function changeQuery(value: string) {
        setQuery(value);
        setPage(1);
    }

    function goToPage(next: number) {
        setPage(next);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        resultsRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }

    const inCategory =
        activeCategory === ALL_CATEGORIES
            ? products
            : products.filter(
                (product) => product.category === activeCategory
            );
    // Search narrows the chosen category and ranks name/category matches first.
    const filteredProducts = hasQuery ? searchProducts(query, inCategory) : inCategory;
    const visibleProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

    const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const firstIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const pageProducts = isHome
        ? visibleProducts
        : visibleProducts.slice(firstIndex, firstIndex + PRODUCTS_PER_PAGE);

    const Heading = isPageHeading ? "h1" : "h2";

    return (
        <section id="shop" className="bg-cream px-6 py-4 md:px-16 md:py-20">
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
                            onChange={(event) => changeQuery(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Escape") changeQuery("");
                            }}
                            placeholder="Search tees, dresses, colours, sizes…"
                            autoComplete="off"
                            enterKeyHint="search"
                            className="min-w-0 flex-1 bg-transparent text-base text-brown outline-none placeholder:text-brown/40 [&::-webkit-search-cancel-button]:hidden"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => changeQuery("")}
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

            {/* Mobile: one swipeable row of categories (home and products page). Wraps from tablet up. */}
            <div
                role="group"
                aria-label="Filter by category"
                className="-mx-6 mt-6 flex items-center gap-2.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] md:mx-0 md:mt-8 md:flex-wrap md:gap-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
            >
                {productCategories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => chooseCategory(category)}
                        aria-pressed={activeCategory === category}
                        className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm transition-colors ${activeCategory === category
                            ? "border-brown bg-brown text-cream"
                            : "border-border bg-transparent text-brown hover:border-brown"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div ref={resultsRef} className="scroll-mt-6">
            {visibleProducts.length === 0 ? null : isHome ? (
                // Keyed on the category so the row starts again from the first card.
                <ProductScroller key={activeCategory} products={pageProducts} />
            ) : (
                <>
                    <ProductGrid products={pageProducts} />
                    <p className="mt-6 text-center text-sm text-brown/60">
                        Showing {firstIndex + 1}–{firstIndex + pageProducts.length} of {visibleProducts.length}
                    </p>
                    <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
                </>
            )}
            </div>

            {visibleProducts.length === 0 && (
                <p className="mt-12 text-sm text-brown/70">
                    {hasQuery
                        ? <>No products match &ldquo;{query.trim()}&rdquo;{activeCategory !== ALL_CATEGORIES && ` in ${activeCategory}`}. Try another word or category.</>
                        : <>Nothing here yet. New {activeCategory.toLowerCase()} are on their way.</>}
                </p>
            )}
        </section>
    );
}
