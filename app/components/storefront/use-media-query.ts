"use client";

import { useSyncExternalStore } from "react";

/**
 * True while the CSS media query matches; updates on resize/rotation.
 * During server render and hydration it returns `serverValue`.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
    return useSyncExternalStore(
        (onChange) => {
            const list = window.matchMedia(query);
            list.addEventListener("change", onChange);
            return () => list.removeEventListener("change", onChange);
        },
        () => window.matchMedia(query).matches,
        () => serverValue
    );
}
