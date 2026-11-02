import { z } from "zod";

/*
 * Zod schemas for everything a customer types at checkout.
 * Single-line fields collapse whitespace (including line breaks) so a
 * customer can't inject extra lines into the WhatsApp order message.
 */

export const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe",
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
    "Taraba", "Yobe", "Zamfara",
] as const;

export const NAME_MAX_LENGTH = 80;
export const ADDRESS_MAX_LENGTH = 200;
export const CITY_MAX_LENGTH = 60;
export const INSTRUCTIONS_MAX_LENGTH = 300;
export const NOTE_MAX_LENGTH = 500;

/** Collapses all whitespace runs (spaces, tabs, line breaks) into single spaces. */
const singleLine = () => z.string().overwrite((value) => value.replace(/\s+/g, " ").trim());

/** Removes the separators people commonly type in phone numbers. */
export function normalizePhone(phone: string): string {
    return phone.replace(/[\s\-().]/g, "");
}

/**
 * Nigerian mobile numbers (0803 123 4567, +234 803 123 4567, 234803…) or any
 * international number written with a leading + (E.164: 8–15 digits).
 */
export function isValidPhone(phone: string): boolean {
    const digits = normalizePhone(phone);
    const nigerianMobile = /^(?:\+?234|0)[789][01]\d{8}$/;
    const international = /^\+[1-9]\d{7,14}$/;
    return nigerianMobile.test(digits) || international.test(digits);
}

export const customerSchema = z.object({
    name: singleLine()
        .min(2, { error: "Please enter your full name." })
        .max(NAME_MAX_LENGTH, { error: `Please keep your name under ${NAME_MAX_LENGTH} characters.` })
        .refine((value) => /\p{L}/u.test(value), { error: "Please enter your full name." }),
    phone: singleLine()
        .min(1, { error: "Please enter a phone number." })
        .refine(isValidPhone, {
            error: "Please enter a valid phone number, e.g. 0803 123 4567 or +234 803 123 4567.",
        }),
    address: singleLine()
        .min(5, { error: "Please enter your delivery address." })
        .max(ADDRESS_MAX_LENGTH, { error: `Please keep the address under ${ADDRESS_MAX_LENGTH} characters.` }),
    city: singleLine()
        .min(2, { error: "Please enter your city or town." })
        .max(CITY_MAX_LENGTH, { error: `Please keep the city under ${CITY_MAX_LENGTH} characters.` }),
    state: z.enum(NIGERIAN_STATES, { error: "Please choose your state." }),
    instructions: singleLine().max(INSTRUCTIONS_MAX_LENGTH, {
        error: `Please keep instructions under ${INSTRUCTIONS_MAX_LENGTH} characters.`,
    }),
});

/** The optional gift note may span lines, but runs of blank lines are squeezed. */
export const noteSchema = z
    .string()
    .overwrite((value) => value.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim())
    .max(NOTE_MAX_LENGTH, { error: `Please keep your note under ${NOTE_MAX_LENGTH} characters.` });

export const checkoutSchema = customerSchema.extend({ note: noteSchema });

/** What the form holds while the customer is typing (state may still be ""). */
export type CustomerDetails = {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    instructions: string;
};

/** Cleaned, validated details that are safe to put in the order message. */
export type ValidCustomer = z.infer<typeof customerSchema>;
export type CheckoutInput = CustomerDetails & { note: string };
export type CheckoutErrors = Partial<Record<keyof CheckoutInput, string>>;

/** Turns a Zod error into one message per field (the first one). */
export function fieldErrors<T extends string>(error: z.ZodError): Partial<Record<T, string>> {
    const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
    const result: Partial<Record<T, string>> = {};
    for (const [field, messages] of Object.entries(flat)) {
        if (messages?.[0]) result[field as T] = messages[0];
    }
    return result;
}

export type ValidationResult<TData, TErrors> =
    | { success: true; data: TData }
    | { success: false; errors: TErrors };

export function validateCheckout(
    input: CheckoutInput
): ValidationResult<z.infer<typeof checkoutSchema>, CheckoutErrors> {
    const result = checkoutSchema.safeParse(input);
    return result.success
        ? { success: true, data: result.data }
        : { success: false, errors: fieldErrors<keyof CheckoutInput>(result.error) };
}

/* ---------- contact form ---------- */

export const CONTACT_TOPICS = [
    "A question about an order",
    "Help with sizing",
    "Product question",
    "Something else",
] as const;

export const CONTACT_MESSAGE_MAX_LENGTH = 1000;

export const contactSchema = z.object({
    name: customerSchema.shape.name,
    // Optional: only checked when the customer fills it in.
    phone: singleLine().refine((value) => value === "" || isValidPhone(value), {
        error: "Please enter a valid phone number, or leave it empty.",
    }),
    topic: z.enum(CONTACT_TOPICS, { error: "Please choose what it's about." }),
    message: z
        .string()
        .overwrite((value) => value.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim())
        .min(10, { error: "Please write a short message (10+ characters)." })
        .max(CONTACT_MESSAGE_MAX_LENGTH, {
            error: `Please keep your message under ${CONTACT_MESSAGE_MAX_LENGTH} characters.`,
        }),
});

export type ContactInput = { name: string; phone: string; topic: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export function validateContact(
    input: ContactInput
): ValidationResult<z.infer<typeof contactSchema>, ContactErrors> {
    const result = contactSchema.safeParse(input);
    return result.success
        ? { success: true, data: result.data }
        : { success: false, errors: fieldErrors<keyof ContactInput>(result.error) };
}

/** WhatsApp text for a contact enquiry (input must come from validateContact). */
export function buildContactMessage(contact: z.infer<typeof contactSchema>): string {
    return [
        "Hello Little Orbit!",
        "",
        `*${contact.topic}*`,
        contact.message,
        "",
        `From: ${contact.name}`,
        ...(contact.phone ? [`Phone: ${contact.phone}`] : []),
    ].join("\n");
}
