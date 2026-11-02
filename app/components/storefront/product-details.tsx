
"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "../../data/products";
import {
    clampQuantity,
    isSameLine,
    MAX_QUANTITY_PER_LINE,
    validateSelection,
} from "../../lib/cart";
import { formatNaira } from "../../lib/format";
import { CheckIcon, StarIcon } from "../icons";
import { useCart } from "./cart-provider";

type ProductDetailsProps = {
    product: Product;
};

export default function ProductDetails({
    product,
}: ProductDetailsProps) {
    const gallery =
        product.gallery && product.gallery.length > 0
            ? product.gallery
            : [product.image];

    const [selectedImage, setSelectedImage] = useState(gallery[0]);
    const { addItem, items } = useCart();

    // Colour defaults to the first swatch (it is visibly selected). Size is
    // only pre-selected when there is a single option, so customers choose fit.
    const [selectedColor, setSelectedColor] = useState(
        product.colors?.[0]?.name ?? ""
    );
    const [selectedSize, setSelectedSize] = useState(
        product.sizes?.length === 1 ? product.sizes[0] : ""
    );
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");
    const [addedMessage, setAddedMessage] = useState("");

    function changeQuantity(next: number) {
        // Always a whole number between 1 and the per-line maximum.
        setQuantity(clampQuantity(next));
    }

    function handleAddToCart() {
        // Zod checks size, colour (only when the product has them) and quantity.
        const problem = validateSelection(product, { selectedSize, selectedColor, quantity });
        if (problem) {
            setAddedMessage("");
            setError(problem);
            return;
        }

        const variantLine = { productId: product.id, selectedSize, selectedColor };
        const alreadyInCart =
            items.find((item) => isSameLine(item, variantLine))?.quantity ?? 0;
        const added = Math.min(quantity, MAX_QUANTITY_PER_LINE - alreadyInCart);

        if (added <= 0) {
            setAddedMessage("");
            setError(`You already have the maximum of ${MAX_QUANTITY_PER_LINE} of this item in your cart.`);
            return;
        }

        addItem({ ...variantLine, quantity: added });

        const variant = [selectedSize && `size ${selectedSize}`, selectedColor]
            .filter(Boolean)
            .join(", ");
        setError("");
        setAddedMessage(
            `Added ${added} × ${product.name}${variant ? ` (${variant})` : ""} to your cart.` +
            (added < quantity ? ` (Limit of ${MAX_QUANTITY_PER_LINE} per item reached.)` : "")
        );
        setQuantity(1);
    }

    return (
        <section className="bg-cream px-6 py-12 md:px-16">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                <div>
                    <div className="relative overflow-hidden rounded-2xl bg-soft-green">
                        <div className="h-[460px] md:h-[540px] lg:h-[626px]">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {product.badge && (
                            <span className="absolute left-5 top-5 rounded-full bg-cream px-4 py-2 text-xs font-medium text-brown">
                                {product.badge}
                            </span>
                        )}
                    </div>

                    {gallery.length > 1 && (
                        <div className="mt-4 flex gap-3">
                            {gallery.map((image, index) => (
                                <button
                                    key={image}
                                    type="button"
                                    onClick={() => setSelectedImage(image)}
                                    aria-label={`View product image ${index + 1}`}
                                    aria-pressed={selectedImage === image}
                                    className={`h-[82px] w-[82px] overflow-hidden rounded-lg border-2 ${selectedImage === image
                                        ? "border-brown"
                                        : "border-transparent"
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} view ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {product.galleryCaption && (
                        <p className="mt-5 text-sm text-brown/70">
                            {product.galleryCaption}
                        </p>
                    )}

                    {product.fabricNote && (
                        <p className="mt-3 border-t border-border pt-4 text-sm text-brown">
                            {product.fabricNote}
                        </p>
                    )}
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                        The everyday edit / {product.ageRange ?? "Made for little adventures"}
                    </p>

                    <h1 className="mt-5 font-display text-5xl font-medium leading-tight text-brown">
                        {product.name}
                    </h1>

                    <p className="mt-4 text-xl font-medium text-brown">
                        {formatNaira(product.price)}
                    </p>

                    {product.rating !== undefined && (
                        <div className="mt-5 flex items-center gap-2 text-sm">
                            <span
                                role="img"
                                aria-label={`Rated ${product.rating} out of 5`}
                                className="flex gap-0.5 text-terracotta"
                            >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        size={16}
                                        filled={star <= Math.round(product.rating ?? 0)}
                                    />
                                ))}
                            </span>
                            <span className="text-brown">
                                {product.rating} ({product.reviewCount ?? 0} reviews)
                            </span>
                        </div>
                    )}

                    {product.description && (
                        <p className="mt-7 max-w-lg text-base leading-7 text-brown/75">
                            {product.description}
                        </p>
                    )}

                    {product.colors && product.colors.length > 0 && (
                        <div className="mt-9">
                            <p className="text-sm font-semibold text-brown">
                                Colour: {selectedColor}
                            </p>

                            <div className="mt-4 flex gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => {
                                            setSelectedColor(color.name);
                                            setError("");
                                        }}
                                        aria-label={`Select ${color.name} colour`}
                                        aria-pressed={selectedColor === color.name}
                                        className={`flex h-11 w-11 items-center justify-center rounded-full border ${selectedColor === color.name
                                            ? "border-brown"
                                            : "border-transparent hover:border-border"
                                            }`}
                                    >
                                        <span
                                            className="h-8 w-8 rounded-full border border-black/10"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mt-9">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-brown">
                                    Select size
                                </p>

                                <button
                                    type="button"
                                    className="text-sm font-medium text-terracotta underline underline-offset-4 transition-colors hover:text-brown"
                                >
                                    Find their fit · Size guide
                                </button>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setError("");
                                        }}
                                        aria-pressed={selectedSize === size}
                                        className={`min-w-[88px] rounded-full border px-5 py-3.5 text-sm font-medium transition-colors ${selectedSize === size
                                            ? "border-brown bg-brown text-cream"
                                            : "border-border bg-transparent text-brown hover:border-brown"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-9">
                        <p className="text-sm font-semibold text-brown" id="quantity-label">
                            Quantity
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                            <div
                                role="group"
                                aria-labelledby="quantity-label"
                                className="flex h-12 w-[140px] items-center justify-between rounded-full border border-border bg-white"
                            >
                                <button
                                    type="button"
                                    onClick={() => changeQuantity(quantity - 1)}
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                    className="flex h-full w-11 items-center justify-center text-lg text-brown disabled:opacity-30"
                                >
                                    −
                                </button>
                                <span className="text-sm font-semibold text-brown" aria-live="polite">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => changeQuantity(quantity + 1)}
                                    disabled={quantity >= MAX_QUANTITY_PER_LINE}
                                    aria-label="Increase quantity"
                                    className="flex h-full w-11 items-center justify-center text-lg text-brown disabled:opacity-30"
                                >
                                    +
                                </button>
                            </div>

                            <p className="text-right text-sm text-brown/70">
                                {formatNaira(product.price)} each
                                <span className="block text-lg font-semibold text-brown">
                                    Total {formatNaira(product.price * quantity)}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            aria-describedby="add-to-cart-status"
                            className="w-full rounded-full bg-terracotta px-6 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        >
                            Add to cart · {formatNaira(product.price * quantity)}
                        </button>

                        <div
                            id="add-to-cart-status"
                            role="status"
                            aria-live="polite"
                            className="mt-4 min-h-6 text-sm"
                        >
                            {error && (
                                <p className="font-medium text-terracotta">{error}</p>
                            )}
                            {addedMessage && (
                                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-soft-green px-4 py-3 text-brown">
                                    <span className="flex items-center gap-2">
                                        <CheckIcon size={16} className="shrink-0 text-forest" />
                                        {addedMessage}
                                    </span>
                                    <Link
                                        href="/cart"
                                        className="font-semibold text-terracotta underline underline-offset-4 hover:text-brown"
                                    >
                                        View cart
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
