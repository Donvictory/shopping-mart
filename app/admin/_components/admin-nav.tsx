"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/products", label: "Products" },
];

/** Nav links; `pathname` null renders them without an active state (Suspense fallback). */
export function AdminNavLinks({ pathname }: { pathname: string | null }) {
    return (
        <nav aria-label="Admin" className="mt-5 flex gap-2 overflow-x-auto lg:mt-10 lg:flex-col lg:gap-1">
            {links.map((link) => {
                const isActive =
                    pathname !== null &&
                    (link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href));
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-brown text-cream" : "text-brown hover:bg-soft-green"
                            }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function AdminNav() {
    return <AdminNavLinks pathname={usePathname()} />;
}
