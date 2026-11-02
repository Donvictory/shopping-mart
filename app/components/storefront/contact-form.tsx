"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
    buildContactMessage,
    CONTACT_MESSAGE_MAX_LENGTH,
    CONTACT_TOPICS,
    NAME_MAX_LENGTH,
    validateContact,
} from "../../lib/validation";
import type { ContactErrors, ContactInput } from "../../lib/validation";
import { buildWhatsAppUrl } from "../../lib/whatsapp";
import { CheckIcon } from "../icons";

const emptyForm: ContactInput = { name: "", phone: "", topic: "", message: "" };
const fieldOrder: (keyof ContactInput)[] = ["name", "phone", "topic", "message"];

const inputClass =
    "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-brown outline-none transition-colors placeholder:text-brown/40 focus:border-brown";

export default function ContactForm() {
    const [form, setForm] = useState<ContactInput>(emptyForm);
    const [errors, setErrors] = useState<ContactErrors>({});
    const [sentUrl, setSentUrl] = useState<string | null>(null);

    function update(field: keyof ContactInput, value: string) {
        setForm((current) => ({ ...current, [field]: value }));
        if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    }

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const result = validateContact(form);

        if (!result.success) {
            setErrors(result.errors);
            const first = fieldOrder.find((field) => result.errors[field]);
            if (first) document.getElementById(`contact-${first}`)?.focus();
            return;
        }

        setErrors({});
        const url = buildWhatsAppUrl(buildContactMessage(result.data));
        setSentUrl(url);
        window.open(url, "_blank", "noopener,noreferrer");
    }

    const border = (field: keyof ContactInput) => (errors[field] ? "border-terracotta" : "border-border");
    const describedBy = (field: keyof ContactInput) => (errors[field] ? `contact-${field}-error` : undefined);
    const errorText = (field: keyof ContactInput) =>
        errors[field] && (
            <p id={`contact-${field}-error`} className="mt-1.5 text-xs font-medium text-terracotta">
                {errors[field]}
            </p>
        );

    if (sentUrl) {
        return (
            <div className="rounded-2xl border border-border bg-white/60 p-7" role="status">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint text-forest">
                    <CheckIcon size={22} />
                </span>
                <h2 className="mt-4 font-display text-2xl text-brown">Your message is ready in WhatsApp</h2>
                <p className="mt-2 text-sm leading-6 text-brown/70">
                    Tap send in WhatsApp and it comes straight to us. A real person will reply in the chat.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                    <a
                        href={sentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-forest px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        WhatsApp didn&apos;t open? Tap here
                    </a>
                    <button
                        type="button"
                        onClick={() => {
                            setSentUrl(null);
                            setForm(emptyForm);
                        }}
                        className="text-brown/70 underline underline-offset-4 hover:text-terracotta"
                    >
                        Write another message
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={onSubmit}
            noValidate
            aria-labelledby="contact-form-heading"
            className="space-y-5 rounded-2xl border border-border bg-white/60 p-6 md:p-7"
        >
            <div>
                <h2 id="contact-form-heading" className="font-display text-2xl text-brown">
                    Send us a message
                </h2>
                <p className="mt-1 text-sm text-brown/60">
                    We&apos;ll open WhatsApp with your message ready to send.
                </p>
            </div>

            <div>
                <label htmlFor="contact-name" className="text-sm font-semibold text-brown">Your name</label>
                <input
                    id="contact-name"
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    autoComplete="name"
                    maxLength={NAME_MAX_LENGTH}
                    placeholder="e.g. Ada Okafor"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={describedBy("name")}
                    className={`${inputClass} ${border("name")}`}
                />
                {errorText("name")}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="contact-phone" className="text-sm font-semibold text-brown">
                        Phone <span className="font-normal text-brown/60">(optional)</span>
                    </label>
                    <input
                        id="contact-phone"
                        type="tel"
                        inputMode="tel"
                        value={form.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        autoComplete="tel"
                        placeholder="e.g. 0803 123 4567"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={describedBy("phone")}
                        className={`${inputClass} ${border("phone")}`}
                    />
                    {errorText("phone")}
                </div>
                <div>
                    <label htmlFor="contact-topic" className="text-sm font-semibold text-brown">What&apos;s it about?</label>
                    <select
                        id="contact-topic"
                        value={form.topic}
                        onChange={(event) => update("topic", event.target.value)}
                        aria-invalid={Boolean(errors.topic)}
                        aria-describedby={describedBy("topic")}
                        className={`${inputClass} ${border("topic")} ${form.topic ? "" : "text-brown/40"}`}
                    >
                        <option value="">Choose a topic</option>
                        {CONTACT_TOPICS.map((topic) => (
                            <option key={topic} value={topic} className="text-brown">{topic}</option>
                        ))}
                    </select>
                    {errorText("topic")}
                </div>
            </div>

            <div>
                <label htmlFor="contact-message" className="text-sm font-semibold text-brown">Message</label>
                <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(event) => update("message", event.target.value)}
                    maxLength={CONTACT_MESSAGE_MAX_LENGTH}
                    placeholder="Tell us how we can help…"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={describedBy("message")}
                    className={`${inputClass} ${border("message")}`}
                />
                {errorText("message")}
            </div>

            <button
                type="submit"
                className="w-full rounded-lg bg-forest px-6 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
                Send on WhatsApp
            </button>
        </form>
    );
}
