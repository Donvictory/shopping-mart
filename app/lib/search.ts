import { products } from "../data/products";
import type { Product } from "../data/products";

function normalize(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[–—]/g, "-")
        .trim();
}

/**
 * Matches products whose name, category, colours, sizes, age range or
 * description contain every word of the query. Name/category matches rank first.
 */
export function searchProducts(query: string, catalogue: Product[] = products): Product[] {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];

    const scored: { product: Product; score: number }[] = [];

    for (const product of catalogue) {
        const primary = normalize(`${product.name} ${product.category}`);
        const secondary = normalize(
            [
                product.description,
                product.ageRange,
                product.badge,
                ...(product.colors ?? []).map((color) => color.name),
                ...(product.sizes ?? []),
            ]
                .filter(Boolean)
                .join(" ")
        );

        let score = 0;
        let matchesAll = true;

        for (const term of terms) {
            if (primary.includes(term)) score += 2;
            else if (secondary.includes(term)) score += 1;
            else {
                matchesAll = false;
                break;
            }
        }

        if (matchesAll) scored.push({ product, score });
    }

    return scored
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.product);
}
