import { Suspense } from "react";
import { notFound } from "next/navigation";
import { products } from "../../data/products";
import SiteHeader from "../../components/storefront/site-header";
import SiteFooter from "../../components/storefront/site-footer";
import ProductDetails from "../../components/storefront/product-details";
import ProductDetailsSkeleton from "../../components/storefront/product-details-skeleton";
import Link from "next/link";

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
export default function ProductPage({ params }: ProductPageProps) {
    return (
        <>
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
            <nav aria-label="Breadcrumb" className="border-b border-border px-6 py-4 md:px-16">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brown/60">
                    <li>
                        <Link
                            href="/products"
                            className="font-medium text-terracotta underline-offset-4 transition-colors hover:text-brown hover:underline"
                        >
                            Shop all
                        </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li>{product.category}</li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" className="text-brown">
                        {product.name}
                    </li>
                </ol>
            </nav>

            <ProductDetails product={product} />
        </>
    );
}
