import Link from "next/link";
import { ArrowLeftIcon } from "../../../components/icons";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { products } from "../../../data/products";
import ProductForm from "../product-form";

type Props = { params: Promise<{ productId: string }> };

export function generateStaticParams() {
    return products.map((product) => ({ productId: product.id }));
}

export default function EditProductPage({ params }: Props) {
    return (
        <div>
            <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-brown/60 hover:text-terracotta"><ArrowLeftIcon size={14} /> Products</Link>
            {/* params is URL data, so it reads behind Suspense (Cache Components). */}
            <Suspense fallback={<p className="mt-6 text-sm text-brown/60">Loading product…</p>}>
                <EditProduct params={params} />
            </Suspense>
        </div>
    );
}

async function EditProduct({ params }: Props) {
    const { productId } = await params;
    const product = products.find((item) => item.id === productId);
    if (!product) notFound();

    return (
        <>
            <h1 className="mt-3 font-display text-4xl font-medium md:text-5xl">Edit {product.name}</h1>
            <ProductForm product={product} />
        </>
    );
}
