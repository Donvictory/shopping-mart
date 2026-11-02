"use client";
import Link from "next/link";
import { useState } from "react";
import { navigationLinks } from "./navigation";


export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative z-[110] lg:hidden">
            <button
                type="button"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-[110] flex h-10 w-10 items-center justify-center text-brown"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="absolute transition-transform duration-300 ease-in-out"
                >
                    <path
                        d="M4 7h16"
                        className={`origin-center transition-all duration-300 ${isOpen ? "translate-y-[5px] rotate-45" : ""
                            }`}
                    />
                    <path
                        d="M4 12h16"
                        className={`transition-opacity duration-200 ${isOpen ? "opacity-0" : "opacity-100"
                            }`}
                    />
                    <path
                        d="M4 17h16"
                        className={`origin-center transition-all duration-300 ${isOpen ? "-translate-y-[5px] -rotate-45" : ""
                            }`}
                    />
                </svg>
            </button>

            <div
                id="mobile-navigation"
                aria-label="Mobile navigation"
                aria-hidden={!isOpen}
                inert={!isOpen}
                className={`fixed inset-0 z-[100] flex min-h-screen flex-col bg-[#FCF9F2] px-6 py-8 transition-all duration-300 ease-in-out ${isOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-3 opacity-0 pointer-events-none"
                    }`}
            >
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="font-display text-2xl font-semibold tracking-tight text-brown"
                    >
                        Little Orbit
                    </Link>
                </div>

                <nav className="mt-20 flex flex-col gap-8">
                    {navigationLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="font-display text-3xl text-brown transition-colors hover:text-terracotta"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="mt-auto border-t border-border pt-6">
                    <p className="text-sm text-brown/70">
                        Feel-good clothing for little adventures.
                    </p>
                </div>
            </div>
        </div>
    );
}