import Link from "next/link";
import { ArrowLeftIcon } from "../../../components/icons";
import ProductForm from "../product-form";

export const metadata = { title: "Add product" };

export default function NewProductPage() {
    return (
        <div>
            <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-brown/60 hover:text-terracotta"><ArrowLeftIcon size={14} /> Products</Link>
            <h1 className="mt-3 font-display text-4xl font-medium md:text-5xl">Add a product</h1>
            <ProductForm />
        </div>
    );
}
