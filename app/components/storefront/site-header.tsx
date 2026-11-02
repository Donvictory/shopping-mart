import Link from "next/link";
import CartLink from "./cart-link";
import MobileNav from "./mobile-nav";
import { navigationLinks } from "./navigation";

export default function SiteHeader() {
    return (
        <header className="flex min-h-[100px] items-center justify-between border-b border-border bg-cream px-6 md:px-16">
            <Link
                href="/"
                className="font-display text-2xl font-semibold tracking-tight text-brown"
            >
                Little Orbit
            </Link>

            <nav
                aria-label="Main navigation"
                className="hidden items-center gap-8 lg:flex"
            >
                {navigationLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        className="text-sm font-medium text-brown transition-colors hover:text-terracotta"
                    >
                        {link.label}
                    </a>
                ))}
            </nav>

            <div className="flex items-center gap-3">
                <CartLink />
                <MobileNav />
            </div>
        </header>
    );
}