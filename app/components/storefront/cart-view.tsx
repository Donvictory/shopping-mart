"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { FormEvent, InputHTMLAttributes } from "react";
import {
    cartSubtotal,
    lineKey,
    MAX_QUANTITY_PER_LINE,
    resolveCartLines,
} from "../../lib/cart";
import type { CartLine } from "../../lib/cart";
import { formatNaira } from "../../lib/format";
import { getDeliveryFee, storeConfig } from "../../lib/store-config";
import {
    ADDRESS_MAX_LENGTH,
    CITY_MAX_LENGTH,
    INSTRUCTIONS_MAX_LENGTH,
    NAME_MAX_LENGTH,
    NIGERIAN_STATES,
    NOTE_MAX_LENGTH,
    validateCheckout,
} from "../../lib/validation";
import type { CheckoutErrors, CheckoutInput, CustomerDetails } from "../../lib/validation";
import { buildOrderMessage, buildWhatsAppUrl, createOrderReference } from "../../lib/whatsapp";
import { HeartIcon } from "../icons";
import { useCart } from "./cart-provider";

const emptyCustomer: CustomerDetails = {
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    instructions: "",
};

// Order of fields on the page, used to focus the first one with an error.
const fieldOrder: (keyof CheckoutInput)[] = [
    "note",
    "name",
    "phone",
    "address",
    "city",
    "state",
    "instructions",
];

const inputClass =
    "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-brown outline-none transition-colors placeholder:text-brown/40 focus:border-brown";

const steps = [
    { title: "Share your cart", text: "Send your items, sizes and quantities." },
    { title: "Confirm the details", text: "We'll check stock and your delivery address." },
    { title: "Arrange payment", text: "Our team will guide you in the chat." },
];

function itemsLabel(count: number) {
    return `${count} ${count === 1 ? "item" : "items"}`;
}

/* ---------- small icons ---------- */

function WhatsAppIcon({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M3.5 20.5 5 16.3A8.5 8.5 0 1 1 8 19.2Z" />
        </svg>
    );
}

function ArrowLeftIcon() {
    return (
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
    );
}

function TruckIcon() {
    return (
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
            <circle cx="7" cy="17.5" r="1.5" />
            <circle cx="17" cy="17.5" r="1.5" />
        </svg>
    );
}

function GiftIcon() {
    return (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3.5-2-5 1" />
        </svg>
    );
}

/* ---------- page sections ---------- */

function DeliveryBanner({ subtotal }: { subtotal: number }) {
    const threshold = storeConfig.freeDeliveryThreshold;

    if (threshold !== null && subtotal >= threshold) {
        return (
            <div className="flex items-center gap-4 rounded-xl border border-soft-green bg-soft-green px-5 py-4 text-brown">
                <TruckIcon />
                <div className="flex-1">
                    <p className="text-sm font-semibold">Hooray! Your cart ships free.</p>
                    <p className="mt-0.5 text-sm text-brown/70">
                        You&apos;ve unlocked free delivery on orders {formatNaira(threshold)}+.
                    </p>
                </div>
                <span className="text-forest"><CheckIcon /></span>
            </div>
        );
    }

    if (threshold !== null) {
        const remaining = threshold - subtotal;
        const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
        return (
            <div className="rounded-xl border border-soft-green bg-soft-green px-5 py-4 text-brown">
                <div className="flex items-center gap-4">
                    <TruckIcon />
                    <p className="text-sm">
                        You&apos;re <span className="font-semibold">{formatNaira(remaining)}</span> away from free delivery.
                    </p>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream" aria-hidden="true">
                    <div className="h-full rounded-full bg-forest" style={{ width: `${progress}%` }} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 rounded-xl border border-soft-green bg-soft-green px-5 py-4 text-brown">
            <TruckIcon />
            <div>
                <p className="text-sm font-semibold">Delivered to your door.</p>
                <p className="mt-0.5 text-sm text-brown/70">
                    We&apos;ll confirm your delivery fee with you on WhatsApp before you pay.
                </p>
            </div>
        </div>
    );
}

function CartRow({ line }: { line: CartLine }) {
    const { updateQuantity, removeItem } = useCart();
    const { productId, selectedSize, selectedColor, quantity, product } = line;

    return (
        <li className="grid grid-cols-[96px_1fr] gap-x-5 gap-y-4 border-b border-border py-6 md:grid-cols-[132px_1fr_auto_110px] md:items-center md:gap-x-6">
            <Link
                href={`/products/${productId}`}
                className="row-span-2 h-[120px] overflow-hidden rounded-lg bg-soft-green md:row-span-1 md:h-[158px]"
            >
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </Link>

            <div className="min-w-0">
                <Link
                    href={`/products/${productId}`}
                    className="text-lg font-semibold text-brown hover:text-terracotta"
                >
                    {product.name}
                </Link>
                {selectedColor && <p className="mt-1.5 text-sm text-brown/60">{selectedColor}</p>}
                {selectedSize && (
                    <p className="mt-1.5 text-sm text-brown">
                        Size: {selectedSize} years{" "}
                        <Link
                            href={`/products/${productId}`}
                            className="ml-1 text-terracotta underline underline-offset-2 hover:text-brown"
                        >
                            Edit<span className="sr-only"> {product.name} options</span>
                        </Link>
                    </p>
                )}
                <p className="mt-1.5 text-sm text-brown/60">{formatNaira(product.price)} each</p>
                <button
                    type="button"
                    onClick={() => removeItem(productId, selectedSize, selectedColor)}
                    className="mt-2 text-sm text-brown/60 underline underline-offset-2 hover:text-terracotta"
                >
                    Remove<span className="sr-only"> {product.name}</span>
                </button>
            </div>

            <div className="col-start-2 flex items-center justify-between gap-4 md:col-start-auto md:contents">
                <div
                    role="group"
                    aria-label={`Quantity for ${product.name}`}
                    className="flex h-11 w-[112px] items-center justify-between rounded-lg border border-border bg-white md:justify-self-center"
                >
                    <button
                        type="button"
                        onClick={() => updateQuantity(productId, selectedSize, selectedColor, quantity - 1)}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-full w-9 items-center justify-center text-lg text-brown disabled:opacity-30"
                    >
                        −
                    </button>
                    <span className="text-sm font-medium text-brown" aria-live="polite">{quantity}</span>
                    <button
                        type="button"
                        onClick={() => updateQuantity(productId, selectedSize, selectedColor, quantity + 1)}
                        disabled={quantity >= MAX_QUANTITY_PER_LINE}
                        aria-label="Increase quantity"
                        className="flex h-full w-9 items-center justify-center text-lg text-brown disabled:opacity-30"
                    >
                        +
                    </button>
                </div>
                <p className="text-lg font-semibold text-brown md:text-right">{formatNaira(line.lineTotal)}</p>
            </div>
        </li>
    );
}

function TrustStrip() {
    const items = [
        { title: "Small brand, big heart", text: "A friendly team behind every order." },
        { title: "Room to change your mind", text: "Easy 30-day returns." },
        { title: "Kinder fabrics", text: "Happier skin, every little day." },
    ];
    return (
        <div className="mt-16 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
            {items.map((item) => (
                <div key={item.title} className="flex gap-3">
                    <HeartIcon size={18} className="mt-0.5 shrink-0 text-terracotta" />
                    <div>
                        <p className="text-sm font-semibold text-brown">{item.title}</p>
                        <p className="mt-1 text-sm text-brown/60">{item.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ---------- main view ---------- */

export default function CartView() {
    const { items, isLoaded, cartCount, clearCart } = useCart();
    const lines = resolveCartLines(items);
    const subtotal = cartSubtotal(lines);
    const deliveryFee = getDeliveryFee(subtotal);

    const [customer, setCustomer] = useState<CustomerDetails>(emptyCustomer);
    const [note, setNote] = useState("");
    const [errors, setErrors] = useState<CheckoutErrors>({});
    const [sentOrder, setSentOrder] = useState<{ reference: string; url: string } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    function clearError(field: keyof CheckoutInput) {
        if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    }

    function updateField(field: keyof CustomerDetails, value: string) {
        setCustomer((current) => ({ ...current, [field]: value }));
        clearError(field);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (lines.length === 0) return;

        const result = validateCheckout({ ...customer, note });

        if (!result.success) {
            setErrors(result.errors);
            const firstInvalid = fieldOrder.find((field) => result.errors[field]);
            if (firstInvalid) document.getElementById(`checkout-${firstInvalid}`)?.focus();
            return;
        }

        setErrors({});
        // Only cleaned, validated values reach the WhatsApp message.
        const { note: cleanNote, ...cleanCustomer } = result.data;
        const reference = createOrderReference();
        const message = buildOrderMessage(lines, cleanCustomer, reference, {
            deliveryFee,
            note: cleanNote,
        });
        const url = buildWhatsAppUrl(message);

        setSentOrder({ reference, url });
        window.open(url, "_blank", "noopener,noreferrer");
    }

    function field(
        name: keyof CustomerDetails,
        label: string,
        props: InputHTMLAttributes<HTMLInputElement> = {},
        optional = false
    ) {
        const error = errors[name];
        return (
            <div>
                <label htmlFor={`checkout-${name}`} className="text-sm font-semibold text-brown">
                    {label}
                    {optional && <span className="ml-1 font-normal text-brown/60">(optional)</span>}
                </label>
                <input
                    id={`checkout-${name}`}
                    name={name}
                    value={customer[name]}
                    onChange={(event) => updateField(name, event.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `checkout-${name}-error` : undefined}
                    className={`${inputClass} ${error ? "border-terracotta" : "border-border"}`}
                    {...props}
                />
                {error && (
                    <p id={`checkout-${name}-error`} className="mt-1.5 text-xs font-medium text-terracotta">
                        {error}
                    </p>
                )}
            </div>
        );
    }

    const hasItems = isLoaded && lines.length > 0;

    return (
        <section className="bg-cream px-6 py-12 md:px-16" aria-labelledby="cart-heading">
            {/* Heading row */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta">
                        Good things, all together
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <h1 id="cart-heading" className="font-display text-4xl font-medium text-brown md:text-5xl">
                            Your cart
                        </h1>
                        {isLoaded && (
                            <span className="rounded-full bg-pale-yellow px-3 py-1 text-sm font-medium text-brown">
                                {itemsLabel(cartCount)}
                            </span>
                        )}
                    </div>
                </div>
                <Link
                    href="/#shop"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:text-brown"
                >
                    <ArrowLeftIcon />
                    Keep exploring
                </Link>
            </div>

            {!isLoaded ? (
                <p className="py-16 text-sm text-brown/60" role="status">Loading your cart…</p>
            ) : !hasItems && !sentOrder ? (
                <div className="mx-auto max-w-md py-20 text-center">
                    <p className="font-display text-2xl text-brown">Your cart is empty</p>
                    <p className="mt-3 text-sm leading-6 text-brown/70">
                        Little adventures need little outfits. Find something they&apos;ll love.
                    </p>
                    <Link
                        href="/products"
                        className="mt-8 inline-block rounded-full bg-terracotta px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        Start shopping
                    </Link>
                </div>
            ) : (
                <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-14">
                    {/* Left column: items, note, delivery details */}
                    <div>
                        <DeliveryBanner subtotal={subtotal} />

                        <div className="mt-6 hidden grid-cols-[132px_1fr_auto_110px] gap-x-6 border-b border-border pb-3 text-xs uppercase tracking-[0.15em] text-brown/60 md:grid">
                            <span className="col-span-2">Your little finds</span>
                            <span className="w-[112px] text-center">Quantity</span>
                            <span className="text-right">Total</span>
                        </div>

                        <ul aria-label="Items in your cart">
                            {lines.map((line) => (
                                <CartRow key={lineKey(line)} line={line} />
                            ))}
                        </ul>

                        <div className="mt-8">
                            <label htmlFor="checkout-note" className="flex items-center gap-2 text-sm font-semibold text-brown">
                                <span className="text-terracotta"><GiftIcon /></span>
                                A gift? A little request?
                                <span className="font-normal text-brown/60">(optional)</span>
                            </label>
                            <textarea
                                id="checkout-note"
                                name="note"
                                rows={3}
                                maxLength={NOTE_MAX_LENGTH}
                                value={note}
                                onChange={(event) => {
                                    setNote(event.target.value);
                                    clearError("note");
                                }}
                                aria-invalid={Boolean(errors.note)}
                                aria-describedby="checkout-note-hint"
                                placeholder="Leave a note for our team…"
                                className={`${inputClass} ${errors.note ? "border-terracotta" : "border-border"}`}
                            />
                            <p
                                id="checkout-note-hint"
                                className={`mt-2 text-xs ${errors.note ? "font-medium text-terracotta" : "text-brown/60"}`}
                            >
                                {errors.note ??
                                    "We'll include your note when you complete your order on WhatsApp."}
                            </p>
                        </div>

                        <form
                            id="checkout-form"
                            ref={formRef}
                            onSubmit={handleSubmit}
                            noValidate
                            className="mt-10 space-y-5 border-t border-border pt-8"
                            aria-labelledby="delivery-heading"
                        >
                            <div>
                                <h2 id="delivery-heading" className="font-display text-2xl text-brown">
                                    Where should we send it?
                                </h2>
                                <p className="mt-1 text-sm text-brown/60">
                                    We need these to arrange delivery. They&apos;re only sent to us in your WhatsApp message.
                                </p>
                            </div>

                            {field("name", "Full name", {
                                autoComplete: "name",
                                maxLength: NAME_MAX_LENGTH,
                                placeholder: "e.g. Ada Okafor",
                            })}
                            {field("phone", "Phone number", {
                                type: "tel",
                                autoComplete: "tel",
                                inputMode: "tel",
                                placeholder: "e.g. 0803 123 4567",
                            })}
                            {field("address", "Delivery address", {
                                autoComplete: "street-address",
                                maxLength: ADDRESS_MAX_LENGTH,
                                placeholder: "House number, street, area",
                            })}
                            <div className="grid gap-5 sm:grid-cols-2">
                                {field("city", "City or town", {
                                    autoComplete: "address-level2",
                                    maxLength: CITY_MAX_LENGTH,
                                    placeholder: "e.g. Ikeja",
                                })}
                                <div>
                                    <label htmlFor="checkout-state" className="text-sm font-semibold text-brown">
                                        State
                                    </label>
                                    <select
                                        id="checkout-state"
                                        name="state"
                                        value={customer.state}
                                        onChange={(event) => updateField("state", event.target.value)}
                                        autoComplete="address-level1"
                                        aria-invalid={Boolean(errors.state)}
                                        aria-describedby={errors.state ? "checkout-state-error" : undefined}
                                        className={`${inputClass} ${errors.state ? "border-terracotta" : "border-border"} ${customer.state ? "" : "text-brown/40"}`}
                                    >
                                        <option value="">Choose a state</option>
                                        {NIGERIAN_STATES.map((state) => (
                                            <option key={state} value={state} className="text-brown">
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.state && (
                                        <p id="checkout-state-error" className="mt-1.5 text-xs font-medium text-terracotta">
                                            {errors.state}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {field(
                                "instructions",
                                "Delivery instructions",
                                { maxLength: INSTRUCTIONS_MAX_LENGTH, placeholder: "Landmarks, gate codes, best time…" },
                                true
                            )}
                        </form>
                    </div>

                    {/* Right column: The Total */}
                    <aside
                        aria-label="Order summary"
                        className="rounded-2xl border border-border bg-white/40 p-7 lg:sticky lg:top-6"
                    >
                        {sentOrder ? (
                            <div role="status">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta">
                                    Order ref {sentOrder.reference}
                                </p>
                                <h2 className="mt-3 font-display text-3xl text-brown">Almost there</h2>
                                <p className="mt-3 text-sm leading-6 text-brown/70">
                                    We&apos;ve opened WhatsApp with your order ready to send. Your order
                                    isn&apos;t confirmed yet. Once you tap send, our team will reply to
                                    confirm stock, delivery and payment.
                                </p>
                                <a
                                    href={sentOrder.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 flex items-center justify-center gap-3 rounded-lg bg-forest px-6 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                                >
                                    <WhatsAppIcon className="h-5 w-5" />
                                    WhatsApp didn&apos;t open? Tap here
                                </a>
                                <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setSentOrder(null)}
                                        className="text-brown/70 underline underline-offset-4 hover:text-terracotta"
                                    >
                                        Edit my order
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            clearCart();
                                            setSentOrder(null);
                                            setNote("");
                                            setCustomer(emptyCustomer);
                                        }}
                                        className="font-medium text-terracotta underline underline-offset-4 hover:text-brown"
                                    >
                                        I&apos;ve sent it — clear my cart
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="font-display text-3xl text-brown">The Total</h2>

                                <dl className="mt-6 space-y-3 border-b border-border pb-6 text-sm text-brown/80">
                                    <div className="flex justify-between">
                                        <dt>Subtotal ({itemsLabel(cartCount)})</dt>
                                        <dd className="text-brown">{formatNaira(subtotal)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt>Delivery</dt>
                                        <dd className={deliveryFee === 0 ? "font-medium text-forest" : "text-brown"}>
                                            {deliveryFee === null
                                                ? "Confirmed on WhatsApp"
                                                : deliveryFee === 0
                                                    ? "FREE"
                                                    : formatNaira(deliveryFee)}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-5 flex items-end justify-between">
                                    <span className="text-lg font-semibold text-brown">Total</span>
                                    <span className="text-right">
                                        <span className="mr-2 text-xs text-brown/60">NGN</span>
                                        <span className="text-3xl font-semibold text-brown">
                                            {formatNaira(subtotal + (deliveryFee ?? 0))}
                                        </span>
                                        {deliveryFee === null && (
                                            <span className="block text-xs text-brown/60">+ delivery</span>
                                        )}
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    form="checkout-form"
                                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-forest px-6 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90"
                                >
                                    <WhatsAppIcon className="h-5 w-5" />
                                    Complete order via WhatsApp
                                </button>
                                {Object.values(errors).some(Boolean) && (
                                    <p className="mt-3 text-center text-xs font-medium text-terracotta" role="alert">
                                        Please check the highlighted details first.
                                    </p>
                                )}
                                <p className="mt-4 text-center text-xs leading-5 text-brown/60">
                                    Your order will be completed in a WhatsApp chat with our team, not on this website.
                                </p>

                                <div className="mt-6 rounded-xl bg-mint p-5">
                                    <p className="text-sm text-forest">A real person, every little step.</p>
                                    <ol className="mt-4 space-y-4">
                                        {steps.map((step, index) => (
                                            <li key={step.title} className="flex gap-3">
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-forest text-xs text-forest">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-semibold text-brown">{step.title}</p>
                                                    <p className="mt-0.5 text-xs text-brown/60">{step.text}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                {storeConfig.supportHours && (
                                    <p className="mt-5 text-center text-xs text-brown/60">
                                        Replies {storeConfig.supportHours}
                                    </p>
                                )}
                            </>
                        )}
                    </aside>
                </div>
            )}

            <TrustStrip />
        </section>
    );
}
