/**
 * Store settings the business must confirm. Nothing here is invented:
 * anything left as null is shown to customers as "confirmed on WhatsApp".
 */
export const storeConfig = {
    /**
     * The seller's WhatsApp number, international format, digits only.
     * NEXT_PUBLIC_WHATSAPP_NUMBER (in .env.local / hosting settings) overrides
     * the default below, which is the number supplied by the store owner.
     */
    whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2349091735644").replace(/\D/g, ""),

    /** Flat delivery fee in Naira, or null if it is quoted per order on WhatsApp. */
    deliveryFee: null as number | null,

    /** Subtotal (Naira) at which delivery becomes free, or null for no free-delivery offer. */
    freeDeliveryThreshold: null as number | null,

    /** Customer service hours shown under the checkout button, or null to hide. */
    supportHours: null as string | null,
};

/**
 * Delivery fee for a subtotal: a number (0 means free) when it is known,
 * or null when it will be confirmed on WhatsApp.
 */
export function getDeliveryFee(
    subtotal: number,
    config: Pick<typeof storeConfig, "deliveryFee" | "freeDeliveryThreshold"> = storeConfig
): number | null {
    if (config.freeDeliveryThreshold !== null && subtotal >= config.freeDeliveryThreshold) {
        return 0;
    }
    return config.deliveryFee;
}
