import Link from "next/link";

type FooterLink = { label: string; href: string };

const footerLinks: Record<"shop" | "help" | "about", FooterLink[]> = {
    shop: [
        { label: "All products", href: "/products" },
        { label: "Favourites", href: "/favourites" },
        { label: "Your cart", href: "/cart" },
    ],
    help: [
        { label: "Contact us", href: "/contact" },
        { label: "How ordering works", href: "/our-little-world#how-it-works" },
        { label: "Email us", href: "mailto:hello@littleorbit.com" },
    ],
    about: [
        { label: "Our story", href: "/our-little-world" },
        { label: "What we care about", href: "/our-little-world" },
    ],
};

function FooterColumn({ title, links, className = "" }: { title: string; links: FooterLink[]; className?: string }) {
    return (
        <div className={className}>
            <h3 className="text-sm font-semibold text-brown">{title}</h3>
            <ul className="mt-3 space-y-2 md:mt-4 md:space-y-2.5">
                {links.map((link) => (
                    <li key={link.label}>
                        <a
                            href={link.href}
                            className="text-sm text-brown/75 transition-colors hover:text-terracotta"
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function SiteFooter() {
    return (
        <footer className="border-t border-border bg-[#F0E9DE] px-6 py-8 md:px-16 md:py-12">
            {/* Mobile: only Shop and Help, 2 centred columns. Tablet+: all four columns. */}
            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4 md:gap-10 md:text-left">
                <div className="hidden md:block">
                    <Link
                        href="/"
                        className="font-display text-2xl font-semibold tracking-tight text-brown"
                    >
                        Little Orbit
                    </Link>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-brown/75">
                        Feel-good clothing for little adventures. Made for every hop, skip,
                        and grow.
                    </p>
                </div>

                <FooterColumn title="Shop" links={footerLinks.shop} />
                <FooterColumn title="Help" links={footerLinks.help} />
                <FooterColumn title="Our world" links={footerLinks.about} className="hidden md:block" />
            </div>

            <div className="mt-8 flex flex-col items-center gap-1 border-t border-brown/15 pt-4 text-center text-xs text-brown/65 md:mt-10 md:flex-row md:justify-between md:text-left">
                <p>Copyright 2026 Little Orbit. All rights reserved.</p>
                <p>Made for little adventures.</p>
            </div>
        </footer>
    );
}
