"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { categories } from "../../data/products";
import type { Product } from "../../data/products";
import { validateProductForm } from "../_lib/product-schema";
import type { ProductFormErrors, ProductFormInput } from "../_lib/product-schema";

const CATEGORIES: readonly string[] = categories;

// The form keeps raw text while editing; Zod validates and converts on submit.
type FormState = Omit<ProductFormInput, "category"> & { category: string };
type Errors = ProductFormErrors;

function toFormState(product?: Product): FormState {
    return {
        name: product?.name ?? "",
        category: product?.category ?? CATEGORIES[0],
        price: product ? String(product.price) : "",
        description: product?.description ?? "",
        ageRange: product?.ageRange ?? "",
        badge: product?.badge ?? "",
        fabricNote: product?.fabricNote ?? "",
        sizes: (product?.sizes ?? []).join(", "),
        colors: product?.colors ?? [],
        images: (product?.gallery ?? (product ? [product.image] : [])).join("\n"),
    };
}

const inputClass =
    "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-brown outline-none transition-colors placeholder:text-brown/40 focus:border-brown";

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-brown">
                {label}
                {children}
            </label>
            {hint && !error && <p className="mt-1.5 text-xs text-brown/60">{hint}</p>}
            {error && <p className="mt-1.5 text-xs font-medium text-terracotta">{error}</p>}
        </div>
    );
}

export default function ProductForm({ product }: { product?: Product }) {
    const [form, setForm] = useState<FormState>(() => toFormState(product));
    const [errors, setErrors] = useState<Errors>({});
    const [status, setStatus] = useState("");

    function set<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
        setStatus("");
    }

    function onSubmit(event: FormEvent) {
        event.preventDefault();
        const result = validateProductForm(form as ProductFormInput);
        if (!result.success) {
            setErrors(result.errors);
            setStatus("");
            return;
        }
        setErrors({});
        // result.data is the cleaned product (price as a number, sizes/images as arrays)
        // ready to save once the database exists.
        setStatus(
            `Looks good! ${result.data.name} would be saved with ${result.data.sizes.length} sizes, ` +
            `${result.data.colors.length} colours and ${result.data.images.length} images. ` +
            "This is a preview, so nothing was saved yet."
        );
    }

    const border = (key: keyof FormState) => (errors[key] ? "border-terracotta" : "border-border");
    const previewImage = form.images.split("\n").map((line) => line.trim()).find(Boolean);

    return (
        <form onSubmit={onSubmit} noValidate className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
                <section className="space-y-5 rounded-2xl border border-border bg-white/60 p-6">
                    <h2 className="font-display text-2xl">Details</h2>
                    <Field label="Product name" error={errors.name}>
                        <input value={form.name} onChange={(e) => set("name", e.target.value)} className={`${inputClass} ${border("name")}`} placeholder="e.g. Sunny stripe tee" />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Category">
                            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={`${inputClass} border-border`}>
                                {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                            </select>
                        </Field>
                        <Field label="Price (₦)" error={errors.price}>
                            <input inputMode="numeric" value={form.price} onChange={(e) => set("price", e.target.value.replace(/[^\d]/g, ""))} className={`${inputClass} ${border("price")}`} placeholder="12000" />
                        </Field>
                    </div>
                    <Field label="Description" error={errors.description}>
                        <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${inputClass} ${border("description")}`} />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Age range" hint="Shown above the name, e.g. Ages 2–8">
                            <input value={form.ageRange} onChange={(e) => set("ageRange", e.target.value)} className={`${inputClass} border-border`} />
                        </Field>
                        <Field label="Badge" hint="Optional, e.g. New in">
                            <input value={form.badge} onChange={(e) => set("badge", e.target.value)} className={`${inputClass} border-border`} />
                        </Field>
                    </div>
                    <Field label="Fabric note">
                        <input value={form.fabricNote} onChange={(e) => set("fabricNote", e.target.value)} className={`${inputClass} border-border`} placeholder="100% organic cotton." />
                    </Field>
                </section>

                <section className="space-y-5 rounded-2xl border border-border bg-white/60 p-6">
                    <h2 className="font-display text-2xl">Options</h2>
                    <Field label="Sizes" hint="Separate with commas, e.g. 2–3, 4–5, 6–7. Leave empty if there are no sizes.">
                        <input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} className={`${inputClass} border-border`} />
                    </Field>
                    <div>
                        <p className="text-sm font-semibold">Colours</p>
                        <ul className="mt-2 space-y-2">
                            {form.colors.map((color, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        aria-label={`Colour ${index + 1} swatch`}
                                        value={/^#[0-9a-f]{6}$/i.test(color.hex) ? color.hex : "#000000"}
                                        onChange={(e) => set("colors", form.colors.map((c, i) => (i === index ? { ...c, hex: e.target.value } : c)))}
                                        className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-border bg-white p-1"
                                    />
                                    <input
                                        aria-label={`Colour ${index + 1} name`}
                                        value={color.name}
                                        onChange={(e) => set("colors", form.colors.map((c, i) => (i === index ? { ...c, name: e.target.value } : c)))}
                                        placeholder="Colour name"
                                        className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brown"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => set("colors", form.colors.filter((_, i) => i !== index))}
                                        className="shrink-0 px-2 text-sm text-brown/60 hover:text-terracotta"
                                        aria-label={`Remove colour ${color.name || index + 1}`}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            onClick={() => set("colors", [...form.colors, { name: "", hex: "#B84E35" }])}
                            className="mt-3 text-sm font-semibold text-terracotta hover:text-brown"
                        >
                            + Add colour
                        </button>
                        {errors.colors && <p className="mt-1.5 text-xs font-medium text-terracotta">{errors.colors}</p>}
                    </div>
                </section>

                <section className="space-y-5 rounded-2xl border border-border bg-white/60 p-6">
                    <h2 className="font-display text-2xl">Photos</h2>
                    <Field label="Image URLs" error={errors.images} hint="One per line. The first is the main photo. (Uploads come with the database.)">
                        <textarea rows={3} value={form.images} onChange={(e) => set("images", e.target.value)} className={`${inputClass} ${border("images")} font-mono text-xs`} />
                    </Field>
                </section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-6">
                <div className="overflow-hidden rounded-2xl border border-border bg-white/60">
                    <div className="aspect-[4/5] bg-soft-green">
                        {previewImage && <img src={previewImage} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="p-4">
                        <p className="text-xs uppercase tracking-wider text-brown/60">{form.category}</p>
                        <p className="mt-1 font-display text-lg">{form.name || "Product name"}</p>
                        <p className="mt-1 text-sm font-medium">
                            {form.price ? `₦${Number(form.price).toLocaleString("en-NG")}` : "₦—"}
                        </p>
                    </div>
                </div>
                <button type="submit" className="w-full rounded-full bg-terracotta px-6 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                    {product ? "Save changes" : "Create product"}
                </button>
                <Link href="/admin/products" className="block text-center text-sm text-brown/70 underline underline-offset-4 hover:text-terracotta">
                    Cancel
                </Link>
                <div role="status" aria-live="polite">
                    {status && <p className="rounded-xl bg-mint px-4 py-3 text-sm text-forest">{status}</p>}
                    {Object.values(errors).some(Boolean) && (
                        <p className="rounded-xl bg-pale-yellow/60 px-4 py-3 text-sm">Please fix the highlighted fields.</p>
                    )}
                </div>
            </aside>
        </form>
    );
}
