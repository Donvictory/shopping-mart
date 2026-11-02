import type { Metadata } from "next";
import { ArrowUpRightIcon } from "../components/icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { ReactNode } from "react";
import AdminNav, { AdminNavLinks } from "./_components/admin-nav";

export const metadata: Metadata = {
    title: { default: "Admin", template: "%s · Admin | Little Orbit" },
    robots: { index: false, follow: false },
};

/*
 * PREVIEW ONLY. There is no admin login yet (milestone M1, ADR-0003), so this
 * area is hidden in production builds unless ADMIN_PREVIEW=true is set.
 * Do not enable it on a public site until requireAdmin() protects it.
 */
const isPreviewEnabled =
    process.env.NODE_ENV !== "production" || process.env.ADMIN_PREVIEW === "true";

export default function AdminLayout({ children }: { children: ReactNode }) {
    if (!isPreviewEnabled) notFound();

    return (
        <div className="min-h-screen bg-cream text-brown lg:grid lg:grid-cols-[240px_1fr]">
            <aside className="border-b border-border bg-white/50 px-6 py-5 lg:min-h-screen lg:border-b-0 lg:border-r lg:py-8">
                <div className="flex items-center justify-between lg:block">
                    <Link href="/admin" className="font-display text-2xl font-semibold tracking-tight text-terracotta">
                        little orbit
                    </Link>
                    <p className="text-xs uppercase tracking-[0.2em] text-brown/60 lg:mt-1">Admin</p>
                </div>
                {/* usePathname suspends on dynamic product routes under Cache Components. */}
                <Suspense fallback={<AdminNavLinks pathname={null} />}>
                    <AdminNav />
                </Suspense>
                <Link
                    href="/"
                    className="mt-6 hidden items-center gap-1.5 text-sm text-brown/60 underline underline-offset-4 hover:text-terracotta lg:inline-flex"
                >
                    View shop <ArrowUpRightIcon size={14} />
                </Link>
            </aside>

            <div className="min-w-0">
                <div className="border-b border-pale-yellow bg-pale-yellow/60 px-6 py-2.5 text-center text-xs text-brown md:px-10">
                    <strong className="font-semibold">Preview:</strong> sample data. Changes aren&apos;t saved
                    until the database and admin login are connected.
                </div>
                <main className="px-6 py-8 md:px-10 md:py-10">{children}</main>
            </div>
        </div>
    );
}
