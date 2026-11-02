import { z } from "zod";
import { products } from "../data/products";
import type { Product } from "../data/products";

export type CartItem = {
    productId: string;
    quantity: number;
    /** Empty string when the product has no size options. */
    selectedSize: string;
    /** Empty string when the product has no colour options. */
    selectedColor: string;
};

export type CartLine = CartItem & {
    product: Product;
    lineTotal: number;
};

export const MAX_QUANTITY_PER_LINE = 20;

export function findProduct(productId: string): Product | undefined {
    return products.find((product) => product.id === productId);
}

/** Two cart entries are the same line when product, size and colour all match. */
export function isSameLine(
    a: Pick<CartItem, "productId" | "selectedSize" | "selectedColor">,
    b: Pick<CartItem, "productId" | "selectedSize" | "selectedColor">
): boolean {
    return (
        a.productId === b.productId &&
        a.selectedSize === b.selectedSize &&
        a.selectedColor === b.selectedColor
    );
}

export function lineKey(item: CartItem): string {
    return `${item.productId}::${item.selectedSize}::${item.selectedColor}`;
}

/**
 * A variant is valid when the product exists and the chosen size/colour
 * is one of its options. Products without options must use "".
 */
export function isValidVariant(
    productId: string,
    selectedSize: string,
    selectedColor: string
): boolean {
    const product = findProduct(productId);
    if (!product) return false;

    const sizes = product.sizes ?? [];
    const colors = (product.colors ?? []).map((color) => color.name);

    const sizeOk =
        sizes.length > 0 ? sizes.includes(selectedSize) : selectedSize === "";
    const colorOk =
        colors.length > 0
            ? colors.includes(selectedColor)
            : selectedColor === "";

    return sizeOk && colorOk;
}

export function clampQuantity(quantity: number): number {
    if (!Number.isFinite(quantity)) return 1;
    return Math.min(MAX_QUANTITY_PER_LINE, Math.max(1, Math.floor(quantity)));
}

/** Adds an item, merging it into an existing line with the same variant. */
export function addToItems(items: CartItem[], newItem: CartItem): CartItem[] {
    if (!cartItemSchema.safeParse(newItem).success) {
        return items;
    }

    const existing = items.find((item) => isSameLine(item, newItem));

    if (existing) {
        return items.map((item) =>
            item === existing
                ? { ...item, quantity: clampQuantity(item.quantity + newItem.quantity) }
                : item
        );
    }

    return [...items, { ...newItem, quantity: clampQuantity(newItem.quantity) }];
}

/** Shape of one cart line as saved in localStorage (untrusted until parsed). */
export const storedCartItemSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1),
    selectedSize: z.string(),
    selectedColor: z.string(),
});

/** A cart line that also refers to a real product and one of its real options. */
export const cartItemSchema = storedCartItemSchema.refine(
    (item) => isValidVariant(item.productId, item.selectedSize, item.selectedColor),
    { error: "That product option isn't available." }
);

/**
 * Turns unknown stored data into a safe cart: drops malformed entries,
 * unknown products and invalid variants, clamps quantities and merges duplicates.
 * Entries are checked one by one so a single bad entry doesn't empty the cart.
 */
export function sanitizeCart(data: unknown): CartItem[] {
    const entries = z.array(z.unknown()).safeParse(data);
    if (!entries.success) return [];

    let items: CartItem[] = [];

    for (const entry of entries.data) {
        const parsed = storedCartItemSchema.safeParse(entry);
        if (parsed.success) items = addToItems(items, parsed.data);
    }

    return items;
}

/**
 * Validates what a customer picked on a product page. Size/colour are only
 * required when the product offers them; otherwise they must be "".
 */
export function selectionSchema(product: Product) {
    const sizes = product.sizes ?? [];
    const colors = (product.colors ?? []).map((color) => color.name);

    const optionField = (options: string[], label: string) =>
        options.length > 0
            ? z.enum(options as [string, ...string[]], {
                error: (issue) =>
                    issue.input === ""
                        ? `Please choose a ${label} first.`
                        : `Sorry, that ${label} isn't available. Please choose again.`,
            })
            : z.literal("", { error: `This product has no ${label} options.` });

    return z.object({
        selectedSize: optionField(sizes, "size"),
        selectedColor: optionField(colors, "colour"),
        quantity: z
            .number({ error: "Please choose a quantity." })
            .int({ error: "Quantity must be a whole number." })
            .min(1, { error: "Please choose a quantity of at least 1." })
            .max(MAX_QUANTITY_PER_LINE, {
                error: `You can add up to ${MAX_QUANTITY_PER_LINE} of each item.`,
            }),
    });
}

/** Returns the first problem with a selection, or null when it can be added. */
export function validateSelection(
    product: Product,
    selection: { selectedSize: string; selectedColor: string; quantity: number }
): string | null {
    const result = selectionSchema(product).safeParse(selection);
    if (result.success) return null;

    // Report in the order the customer sees the controls: size, colour, quantity.
    const order = ["selectedSize", "selectedColor", "quantity"];
    const issue = [...result.error.issues].sort(
        (a, b) => order.indexOf(String(a.path[0])) - order.indexOf(String(b.path[0]))
    )[0];
    return issue.message;
}

export function parseStoredCart(raw: string | null): CartItem[] {
    if (!raw) return [];

    try {
        return sanitizeCart(JSON.parse(raw));
    } catch {
        return [];
    }
}

/** Resolves name, image and price from the catalogue; never stored in the cart. */
export function resolveCartLines(items: CartItem[]): CartLine[] {
    const lines: CartLine[] = [];

    for (const item of items) {
        const product = findProduct(item.productId);
        if (!product) continue;

        lines.push({
            ...item,
            product,
            lineTotal: product.price * item.quantity,
        });
    }

    return lines;
}

export function cartSubtotal(lines: CartLine[]): number {
    return lines.reduce((total, line) => total + line.lineTotal, 0);
}
