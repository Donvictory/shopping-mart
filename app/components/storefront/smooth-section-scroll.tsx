"use client";

import { animate } from "framer-motion";
import type { AnimationPlaybackControls } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const HEADER_GAP = 16;

let activeAnimation: AnimationPlaybackControls | null = null;
let pendingSectionId: string | null = null;

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToSection(element: HTMLElement) {
    const target = Math.max(
        0,
        element.getBoundingClientRect().top + window.scrollY - HEADER_GAP
    );

    activeAnimation?.stop();

    if (prefersReducedMotion()) {
        window.scrollTo(0, target);
        return;
    }

    const distance = Math.abs(target - window.scrollY);
    activeAnimation = animate(window.scrollY, target, {
        // Longer trips take a little longer, within comfortable bounds.
        duration: Math.min(1.1, Math.max(0.45, distance / 2200)),
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (value) => window.scrollTo(0, value),
        onComplete: () => {
            activeAnimation = null;
        },
    });

    // Let the user take over by scrolling themselves.
    const cancel = () => {
        activeAnimation?.stop();
        activeAnimation = null;
    };
    window.addEventListener("wheel", cancel, { once: true, passive: true });
    window.addEventListener("touchstart", cancel, { once: true, passive: true });
}

/**
 * Animates scrolling to page sections (links like "#shop" or "/#shop") with
 * Framer Motion, including when the section lives on another page.
 * Works for both plain <a> tags and Next <Link>.
 */
export default function SmoothSectionScroll() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        function onClick(event: MouseEvent) {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const anchor = (event.target as Element | null)?.closest?.("a[href]");
            if (!(anchor instanceof HTMLAnchorElement)) return;
            if (anchor.target && anchor.target !== "_self") return;

            const url = new URL(anchor.href);
            if (url.origin !== window.location.origin || !url.hash) return;

            const sectionId = decodeURIComponent(url.hash.slice(1));

            if (url.pathname === window.location.pathname) {
                const section = document.getElementById(sectionId);
                if (!section) return;

                event.preventDefault();
                window.history.pushState(null, "", url.hash);
                scrollToSection(section);
            } else {
                event.preventDefault();
                pendingSectionId = sectionId;
                router.push(`${url.pathname}${url.search}`);
            }
        }

        // Capture phase runs before React/Next <Link> handlers; Link skips its
        // own navigation when the event is already defaultPrevented.
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, [router]);

    // After navigating to another page, animate down to the requested section.
    useEffect(() => {
        if (!pendingSectionId) return;

        const sectionId = pendingSectionId;
        pendingSectionId = null;

        const frame = requestAnimationFrame(() => {
            const section = document.getElementById(sectionId);
            if (!section) return;
            window.history.replaceState(null, "", `#${sectionId}`);
            scrollToSection(section);
        });

        return () => cancelAnimationFrame(frame);
    }, [pathname]);

    return null;
}
