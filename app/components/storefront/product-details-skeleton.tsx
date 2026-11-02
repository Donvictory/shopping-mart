// Placeholder matching the product details layout, shown while the product
// for the current URL resolves.
export default function ProductDetailsSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading product">
            <div className="border-b border-border px-6 py-6 md:px-16">
                <div className="h-5 w-56 animate-pulse rounded bg-border" />
            </div>

            <section className="bg-cream px-6 py-12 md:px-16">
                <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    <div className="h-[460px] animate-pulse rounded-2xl bg-soft-green md:h-[540px] lg:h-[626px]" />

                    <div className="space-y-5">
                        <div className="h-4 w-48 animate-pulse rounded bg-border" />
                        <div className="h-12 w-3/4 animate-pulse rounded bg-border" />
                        <div className="h-6 w-24 animate-pulse rounded bg-border" />
                        <div className="h-24 w-full animate-pulse rounded bg-border" />
                        <div className="flex gap-3 pt-4">
                            <div className="h-11 w-11 animate-pulse rounded-full bg-border" />
                            <div className="h-11 w-11 animate-pulse rounded-full bg-border" />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <div className="h-12 w-[88px] animate-pulse rounded-full bg-border" />
                            <div className="h-12 w-[88px] animate-pulse rounded-full bg-border" />
                            <div className="h-12 w-[88px] animate-pulse rounded-full bg-border" />
                        </div>
                        <div className="h-14 w-full animate-pulse rounded-full bg-border pt-6" />
                    </div>
                </div>
            </section>
        </div>
    );
}
