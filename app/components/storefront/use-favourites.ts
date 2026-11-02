"use client";

import { useCallback, useSyncExternalStore } from "react";
import { z } from "zod";
import { products } from "../../data/products";

/*
 * Favourites are product IDs saved in localStorage — guests only, no account.
 * Same pattern as the cart: read lazily on the client, written only when the
 * customer changes something, and kept in sync across open tabs.
 */

const FAVOURITES_STORAGE_KEY = "little-orbit-favourites";

const storedFavouritesSchema = z.array(z.string());
const knownProductIds = new Set(products.map((product) => product.id));

let cachedIds: string[] | null = null;
const listeners = new Set<() => void>();

/** Keeps only unique IDs of products that still exist in the catalogue. */
export function parseStoredFavourites(raw: string | null): string[] {
    if (!raw) return [];
    try {
        const parsed = storedFavouritesSchema.safeParse(JSON.parse(raw));
        if (!parsed.success) return [];
        return [...new Set(parsed.data)].filter((id) => knownProductIds.has(id));
    } catch {
        return [];
    }
}

function readIds(): string[] {
    if (cachedIds === null) {
        try {
            cachedIds = parseStoredFavourites(localStorage.getItem(FAVOURITES_STORAGE_KEY));
        } catch {
            cachedIds = [];
        }
    }
    return cachedIds;
}

function writeIds(next: string[]) {
    cachedIds = next;
    try {
        localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
        console.error("Could not save favourites:", error);
    }
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);

    function onStorage(event: StorageEvent) {
        if (event.key !== FAVOURITES_STORAGE_KEY && event.key !== null) return;
        cachedIds = null;
        listener();
    }
    window.addEventListener("storage", onStorage);

    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

const getServerSnapshot = (): string[] | null => null;

export function useFavourites() {
    const snapshot = useSyncExternalStore(subscribe, readIds, getServerSnapshot);
    const favouriteIds = snapshot ?? [];

    const toggleFavourite = useCallback((productId: string) => {
        if (!knownProductIds.has(productId)) return;
        const current = readIds();
        writeIds(
            current.includes(productId)
                ? current.filter((id) => id !== productId)
                : [...current, productId]
        );
    }, []);

    return {
        favouriteIds,
        /** False during server render and hydration, before localStorage is read. */
        isLoaded: snapshot !== null,
        isFavourite: (productId: string) => favouriteIds.includes(productId),
        toggleFavourite,
    };
}
