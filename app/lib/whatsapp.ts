import { cartSubtotal } from "./cart";
import type { CartLine } from "./cart";
import { formatNaira } from "./format";
import { storeConfig } from "./store-config";
import type { ValidCustomer } from "./validation";

// Validation lives in ./validation (Zod). Re-exported for existing imports.
export {
    INSTRUCTIONS_MAX_LENGTH,
    NOTE_MAX_LENGTH,
    isValidPhone,
    validateCheckout,
} from "./validation";
export type { CustomerDetails, CheckoutErrors } from "./validation";

/** Seller's WhatsApp number (digits only) — set in store-config.ts / NEXT_PUBLIC_WHATSAPP_NUMBER. */
export const SELLER_WHATSAPP_NUMBER = storeConfig.whatsappNumber;

export type OrderExtras = {
    /** Known delivery fee (0 = free) or null when it will be confirmed on WhatsApp. */
    deliveryFee?: number | null;
    /** Optional gift note / request for the team (already validated). */
    note?: string;
};

/** Short, human-readable reference the seller can quote back, e.g. LO-K3F9QZ. */
export function createOrderReference(now: number = Date.now()): string {
    const random = Math.floor(Math.random() * 36 ** 2)
        .toString(36)
        .padStart(2, "0");
    return `LO-${now.toString(36).slice(-4)}${random}`.toUpperCase();
}

/**
 * Builds the WhatsApp order text. `customer` must come from customerSchema /
 * validateCheckout, so every field is trimmed and single-line.
 */
export function buildOrderMessage(
    lines: CartLine[],
    customer: ValidCustomer,
    reference: string,
    { deliveryFee = null, note = "" }: OrderExtras = {}
): string {
    const itemLines = lines.map((line, index) => {
        const variant = [
            line.selectedSize && `Size: ${line.selectedSize}`,
            line.selectedColor && `Colour: ${line.selectedColor}`,
        ]
            .filter(Boolean)
            .join(" · ");

        return [
            `${index + 1}. ${line.product.name}`,
            variant && `   ${variant}`,
            `   Qty: ${line.quantity} × ${formatNaira(line.product.price)} = ${formatNaira(line.lineTotal)}`,
        ]
            .filter(Boolean)
            .join("\n");
    });

    const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotal = cartSubtotal(lines);
    // Defensive: a whitespace-only note must never add an empty "Note" section.
    const trimmedNote = note.trim();

    const totals =
        deliveryFee === null
            ? [
                `*Subtotal:* ${formatNaira(subtotal)}`,
                "_Delivery fee to be confirmed._",
            ]
            : [
                `*Subtotal:* ${formatNaira(subtotal)}`,
                `*Delivery:* ${deliveryFee === 0 ? "Free" : formatNaira(deliveryFee)}`,
                `*Total:* ${formatNaira(subtotal + deliveryFee)}`,
            ];

    return [
        "Hello Little Orbit! I'd like to place an order.",
        "",
        `*Order ref:* ${reference}`,
        "",
        `*Items (${itemCount})*`,
        ...itemLines,
        "",
        ...totals,
        "",
        ...(trimmedNote ? ["*Note for the team*", trimmedNote, ""] : []),
        "*Delivery details*",
        `Name: ${customer.name}`,
        `Phone: ${customer.phone}`,
        `Address: ${customer.address}`,
        `City/State: ${customer.city}, ${customer.state}`,
        ...(customer.instructions ? [`Instructions: ${customer.instructions}`] : []),
        "",
        "Please confirm availability, delivery and payment. Thank you!",
    ].join("\n");
}

export function buildWhatsAppUrl(
    message: string,
    phoneNumber: string = SELLER_WHATSAPP_NUMBER
): string {
    const digits = phoneNumber.replace(/\D/g, "");
    const base = digits ? `https://wa.me/${digits}` : "https://wa.me/";
    return `${base}?text=${encodeURIComponent(message)}`;
}
