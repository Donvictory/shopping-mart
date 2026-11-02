import type { Product } from "../../data/products";
import ProductCard from "./product-card";

/**
 * Product grid (products and favourites pages):
 *   under 430px: 1 column · 430–599px: 2 · 600–749px: 3 · 750px and up: 4
 */
export default function ProductGrid({ products }: { products: Product[] }) {
    return (
        <ul
            aria-label="Products"
            className="mt-10 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 min-[600px]:grid-cols-3 min-[750px]:grid-cols-4 sm:gap-4 md:gap-6"
        >
            {products.map((product) => (
                <li key={product.id}>
                    <ProductCard product={product} />
                </li>
            ))}
        </ul>
    );
}
