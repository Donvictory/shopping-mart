"use client";

import { useFavourites } from "./use-favourites";

type FavouriteButtonProps = {
    productId: string;
    productName: string;
    className?: string;
};

export default function FavouriteButton({ productId, productName, className = "" }: FavouriteButtonProps) {
    const { isFavourite, toggleFavourite } = useFavourites();
    const saved = isFavourite(productId);

    return (
        <button
            type="button"
            onClick={() => toggleFavourite(productId)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${productName} from favourites` : `Save ${productName} to favourites`}
            title={saved ? "Saved to favourites" : "Save to favourites"}
            className={`flex h-9 w-9 items-center justify-center rounded-full bg-cream/95 shadow-sm transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown ${className}`}
        >
            <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
                className={saved ? "text-terracotta" : "text-brown"}
            >
                <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4 7.4 4c2 0 3.5 1.1 4.6 2.7C13.1 5.1 14.6 4 16.6 4c3.5 0 5.8 3.6 4.6 7.1-1.7 4.8-9.2 9.4-9.2 9.4Z" />
            </svg>
        </button>
    );
}
