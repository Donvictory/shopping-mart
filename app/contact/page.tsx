import type { Metadata } from "next";
import ContactForm from "../components/storefront/contact-form";
import SiteFooter from "../components/storefront/site-footer";
import SiteHeader from "../components/storefront/site-header";
import { storeConfig } from "../lib/store-config";

export const metadata: Metadata = {
    title: "Contact",
    description: "Questions about sizes, orders or anything else? Chat with the Little Orbit team.",
};

const CONTACT_EMAIL = "hello@littleorbit.com";

/** 2349091735644 -> +234 909 173 5644 */
function formatPhone(digits: string) {
    const match = digits.match(/^234(\d{3})(\d{3})(\d{4})$/);
    return match ? `+234 ${match[1]} ${match[2]} ${match[3]}` : `+${digits}`;
}

export default function ContactPage() {
    const whatsapp = storeConfig.whatsappNumber;

    return (
        <>
            <SiteHeader />
            <main className="bg-cream px-6 py-12 md:px-16 md:py-16">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta">
                    Real people, happy to help
                </p>
                <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-brown md:text-5xl">
                    Say hello
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-brown/75">
                    Not sure which size to pick? Wondering where your order is? Or just want to tell
                    us how the new dress went down at the party? We&apos;d love to hear from you.
                </p>

                <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
                    <div className="space-y-4">
                        {whatsapp && (
                            <a
                                href={`https://wa.me/${whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-2xl border border-border bg-white/60 p-6 transition-colors hover:border-brown"
                            >
                                <p className="text-xs uppercase tracking-[0.15em] text-brown/60">WhatsApp</p>
                                <p className="mt-2 text-lg font-semibold text-brown">{formatPhone(whatsapp)}</p>
                                <p className="mt-1 text-sm text-brown/70">
                                    The quickest way to reach us, and where every order is confirmed.
                                </p>
                            </a>
                        )}
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="block rounded-2xl border border-border bg-white/60 p-6 transition-colors hover:border-brown"
                        >
                            <p className="text-xs uppercase tracking-[0.15em] text-brown/60">Email</p>
                            <p className="mt-2 text-lg font-semibold text-brown">{CONTACT_EMAIL}</p>
                            <p className="mt-1 text-sm text-brown/70">
                                For anything longer, or if you&apos;d rather not use WhatsApp.
                            </p>
                        </a>
                        {storeConfig.supportHours && (
                            <p className="px-1 text-sm text-brown/60">We reply {storeConfig.supportHours}.</p>
                        )}
                    </div>

                    <ContactForm />
                </div>
            </main>
            <SiteFooter />
        </>
    );
}
