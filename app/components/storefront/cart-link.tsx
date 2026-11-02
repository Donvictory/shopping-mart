"use client";

import Link from "next/link";
import { CartIcon } from "../icons";
import { useCart } from "./cart-provider";

export default function CartLink() {
    const { cartCount, isLoaded } = useCart();

    // Until localStorage has been read, don't claim "0" — the cart may not be empty.
    const label = isLoaded
        ? `Shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`
        : "Shopping cart";

    return (
        <Link
            href="/cart"
            aria-label={label}
            title="Cart"
            className="relative flex h-10 w-10 items-center justify-center text-brown transition-colors hover:text-terracotta"
        >
            <CartIcon size={24} />
            {isLoaded && cartCount > 0 && (
                <span
                    aria-hidden="true"
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-semibold leading-none text-white"
                >
                    {cartCount > 99 ? "99+" : cartCount}
                </span>
            )}
        </Link>
    );
}
