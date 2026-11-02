"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import {
    addToItems,
    clampQuantity,
    isSameLine,
    parseStoredCart,
} from "../../lib/cart";
import type { CartItem } from "../../lib/cart";

export type { CartItem } from "../../lib/cart";

type CartContextType = {
    items: CartItem[];
    /** False during server render and hydration, before localStorage is read. */
    isLoaded: boolean;
    addItem: (item: CartItem) => void;
    updateQuantity: (productId: string, selectedSize: string, selectedColor: string, quantity: number) => void;
    removeItem: (productId: string, selectedSize: string, selectedColor: string) => void;
    clearCart: () => void;
    cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "little-orbit-cart";

/*
 * localStorage-backed store. The saved cart is read lazily on the client and
 * only written when the customer changes it, so the initial empty server
 * state can never overwrite a saved cart.
 */
let cachedItems: CartItem[] | null = null;
const listeners = new Set<() => void>();

function readItems(): CartItem[] {
    if (cachedItems === null) {
        try {
            cachedItems = parseStoredCart(localStorage.getItem(CART_STORAGE_KEY));
        } catch {
            cachedItems = [];
        }
    }
    return cachedItems;
}

function writeItems(update: (items: CartItem[]) => CartItem[]) {
    const next = update(readItems());
    if (next === cachedItems) return;

    cachedItems = next;
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
        console.error("Could not save cart:", error);
    }
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);

    // Keep multiple open tabs in sync.
    function onStorage(event: StorageEvent) {
        if (event.key !== CART_STORAGE_KEY && event.key !== null) return;
        cachedItems = null;
        listener();
    }
    window.addEventListener("storage", onStorage);

    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

function getServerSnapshot(): CartItem[] | null {
    return null;
}

export function CartProvider({ children }: { children: ReactNode }) {
    const snapshot = useSyncExternalStore(subscribe, readItems, getServerSnapshot);
    const isLoaded = snapshot !== null;
    const items = useMemo(() => snapshot ?? [], [snapshot]);

    const addItem = useCallback((newItem: CartItem) => {
        writeItems((current) => addToItems(current, newItem));
    }, []);

    const updateQuantity = useCallback(
        (productId: string, selectedSize: string, selectedColor: string, quantity: number) => {
            if (quantity < 1) return;
            const target = { productId, selectedSize, selectedColor };

            writeItems((current) =>
                current.map((item) =>
                    isSameLine(item, target)
                        ? { ...item, quantity: clampQuantity(quantity) }
                        : item
                )
            );
        },
        []
    );

    const removeItem = useCallback(
        (productId: string, selectedSize: string, selectedColor: string) => {
            const target = { productId, selectedSize, selectedColor };
            writeItems((current) => current.filter((item) => !isSameLine(item, target)));
        },
        []
    );

    const clearCart = useCallback(() => {
        writeItems(() => []);
    }, []);

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    const value = useMemo(
        () => ({
            items,
            isLoaded,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
            cartCount,
        }),
        [items, isLoaded, addItem, updateQuantity, removeItem, clearCart, cartCount]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used inside a CartProvider");
    }

    return context;
}
