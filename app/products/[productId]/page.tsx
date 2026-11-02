import { Suspense } from "react";
import { notFound } from "next/navigation";
import { products } from "../../data/products";

import AnnouncementBar from "../../components/storefront/announcement-bar";
import SiteHeader from "../../components/storefront/site-header";
import SiteFooter from "../../components/storefront/site-footer";
import ProductDetails from "../../components/storefront/product-details";
import ProductDetailsSkeleton from "../../components/storefront/product-details-skeleton";
import BackButton from "../../components/storefront/back-button";

type ProductPageProps = {
    params: Promise<{
        productId: string;
    }>;
};

export function generateStaticParams() {
    return products.map((product) => ({
        productId: product.id,
    }));
}

// The header, footer and announcement bar form a static shell that renders
// instantly on navigation. Only the part that reads URL data (params) sits
// behind Suspense, as required by Cache Components / instant navigation.
export default function ProductPage({ params }: ProductPageProps) {
    return (
        <>
            <AnnouncementBar />
            <SiteHeader />

            <main>
                <Suspense fallback={<ProductDetailsSkeleton />}>
                    <ProductContent params={params} />
                </Suspense>
            </main>

            <SiteFooter />
        </>
    );
}

async function ProductContent({ params }: ProductPageProps) {
    const { productId } = await params;

    const product = products.find(
        (item) => item.id === productId
    );

    if (!product) {
        notFound();
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border px-6 py-5 md:px-16">
                <BackButton fallbackHref="/products" />
                <p className="text-sm text-brown/60">
                    Shop all / {product.category} / {product.name}
                </p>
            </div>

            <ProductDetails product={product} />
        </>
    );
}
