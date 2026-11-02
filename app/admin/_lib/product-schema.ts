import { z } from "zod";
import { categories } from "../../data/products";
import { fieldErrors } from "../../lib/validation";

const optionalText = (max: number, label: string) =>
    z.string().trim().max(max, { error: `${label} must be ${max} characters or fewer.` });

const isHttpsUrl = (value: string) => {
    try {
        return new URL(value).protocol === "https:";
    } catch {
        return false;
    }
};

/** Splits "a, b,, c" into ["a", "b", "c"]. */
const commaList = (value: string) =>
    value.split(",").map((part) => part.trim()).filter(Boolean);

/** Splits text into one trimmed, non-empty entry per line. */
const lineList = (value: string) =>
    value.split("\n").map((line) => line.trim()).filter(Boolean);

const hasDuplicates = (values: string[]) =>
    new Set(values.map((value) => value.toLowerCase())).size !== values.length;

export const productFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { error: "Enter a product name." })
        .max(80, { error: "Keep the name under 80 characters." }),
    category: z.enum(categories, { error: "Choose a category." }),
    price: z
        .string()
        .trim()
        .regex(/^\d+$/, { error: "Enter the price in whole Naira, digits only." })
        .transform(Number)
        .pipe(
            z
                .number()
                .int()
                .min(100, { error: "Price must be at least ₦100." })
                .max(10_000_000, { error: "Price looks too high. Please check it." })
        ),
    description: z
        .string()
        .trim()
        .min(10, { error: "Add a short description (10+ characters)." })
        .max(1000, { error: "Keep the description under 1,000 characters." }),
    ageRange: optionalText(30, "Age range"),
    badge: optionalText(30, "Badge"),
    fabricNote: optionalText(120, "Fabric note"),
    sizes: z
        .string()
        .transform(commaList)
        .pipe(
            z
                .array(z.string().max(12, { error: "Each size must be 12 characters or fewer." }))
                .max(12, { error: "Use 12 sizes or fewer." })
                .refine((sizes) => !hasDuplicates(sizes), { error: "Each size should appear only once." })
        ),
    colors: z
        .array(
            z.object({
                name: z
                    .string()
                    .trim()
                    .min(1, { error: "Each colour needs a name." })
                    .max(30, { error: "Colour names must be 30 characters or fewer." }),
                hex: z.string().regex(/^#[0-9a-f]{6}$/i, { error: "Colours need a hex value like #B84E35." }),
            })
        )
        .max(10, { error: "Use 10 colours or fewer." })
        .refine((colors) => !hasDuplicates(colors.map((color) => color.name.trim())), {
            error: "Each colour name should appear only once.",
        }),
    images: z
        .string()
        .transform(lineList)
        .pipe(
            z
                .array(z.string())
                .min(1, { error: "Add at least one image URL." })
                .max(8, { error: "Use 8 images or fewer." })
                .refine((urls) => urls.every(isHttpsUrl), {
                    error: "Each image must be a full https:// URL.",
                })
        ),
});

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormData = z.output<typeof productFormSchema>;
export type ProductFormErrors = Partial<Record<keyof ProductFormInput, string>>;

export function validateProductForm(input: ProductFormInput):
    | { success: true; data: ProductFormData }
    | { success: false; errors: ProductFormErrors } {
    const result = productFormSchema.safeParse(input);
    return result.success
        ? { success: true, data: result.data }
        : { success: false, errors: fieldErrors<keyof ProductFormInput>(result.error) };
}
