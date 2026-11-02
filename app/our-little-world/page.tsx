import type { Metadata } from "next";
import Link from "next/link";
import { FlowerIcon } from "../components/storefront/brand-story";
import SiteFooter from "../components/storefront/site-footer";
import SiteHeader from "../components/storefront/site-header";

export const metadata: Metadata = {
    title: "Our little world",
    description:
        "Why we make Little Orbit clothes the way we do: soft fabrics, room to grow, and a real person on the other end of every order.",
};

const values = [
    {
        title: "Soft comes first",
        text: "If it isn't comfortable, it doesn't matter how cute it is. We think about how something feels on their skin before we think about how it looks on a hanger.",
    },
    {
        title: "Room to grow",
        text: "Children grow on their own schedule, usually overnight. We leave a little extra room so a favourite lasts longer than one season, and we size by age so choosing is simple.",
    },
    {
        title: "Made for real days",
        text: "Playgrounds, birthday parties, long car rides and nap time. Our clothes are meant to be climbed in, spilled on, washed and worn again the next morning.",
    },
    {
        title: "A real person, every time",
        text: "When you order, you chat with one of us on WhatsApp. No bots and no waiting on hold. Just someone who can tell you how a size runs and when your parcel will arrive.",
    },
];

const steps = [
    { title: "Pick your favourites", text: "Browse, choose sizes and colours, and add them to your cart. No account needed." },
    { title: "Send your cart on WhatsApp", text: "One tap turns your cart into a message to us, with everything already filled in." },
    { title: "We confirm the details", text: "We check stock, agree the delivery fee and sort out payment with you in the chat." },
    { title: "It's on its way", text: "We pack your order and send it to your door. Then the fun part is theirs." },
];

export default function OurLittleWorldPage() {
    return (
        <>
            <SiteHeader />
            <main>
                {/* Opening */}
                <section className="bg-soft-green px-6 py-14 md:px-16 md:py-20">
                    <div className="max-w-3xl">
                        <div className="text-terracotta">
                            <FlowerIcon />
                        </div>
                        <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-terracotta">
                            Our little world
                        </p>
                        <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight text-brown md:text-6xl">
                            Clothes for the days they&apos;ll remember
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-brown/80">
                            Children don&apos;t care about labels. They care about whether the tag
                            itches, whether they can climb a tree in it, and whether it&apos;s the
                            one with the stripes. Honestly, we think they have their priorities right.
                        </p>
                    </div>
                </section>

                {/* Story */}
                <section className="grid items-center gap-10 bg-cream px-6 py-14 md:px-16 md:py-20 lg:grid-cols-2 lg:gap-16">
                    <div className="overflow-hidden rounded-2xl bg-pale-yellow">
                        <img
                            src="https://images.unsplash.com/photo-1770871821382-60ea99b0a941?w=900&h=700&q=70&auto=format&fit=crop"
                            alt="A family running together through a sunlit garden"
                            loading="lazy"
                            decoding="async"
                            className="aspect-[9/7] h-full w-full object-cover"
                        />
                    </div>

                    <div className="max-w-xl">
                        <h2 className="font-display text-3xl font-medium tracking-tight text-brown md:text-4xl">
                            Why we do this
                        </h2>
                        <div className="mt-5 space-y-4 text-base leading-7 text-brown/80">
                            <p>
                                If you&apos;ve ever watched a child refuse to take off the same
                                t-shirt for three days running, you already understand Little Orbit.
                                The clothes they love are the ones they forget they&apos;re wearing.
                            </p>
                            <p>
                                So that&apos;s what we try to make. Fabrics that feel soft from the
                                very first wear. Cuts that leave space for cartwheels and growth
                                spurts. Colours that still look good after the hundredth wash.
                                Nothing too precious to get muddy, and nothing so stiff they ask to
                                change by lunchtime.
                            </p>
                            <p>
                                We&apos;re a small team, and we like it that way. It means we know our
                                pieces well, we answer our own messages, and we care about every
                                parcel that leaves us.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="bg-cream px-6 pb-14 md:px-16 md:pb-20" aria-labelledby="values-heading">
                    <h2 id="values-heading" className="font-display text-3xl font-medium tracking-tight text-brown md:text-4xl">
                        What we care about
                    </h2>
                    <ul className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
                        {values.map((value) => (
                            <li key={value.title} className="rounded-2xl border border-border bg-white/60 p-6 md:p-7">
                                <h3 className="text-lg font-semibold text-brown">{value.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-brown/75">{value.text}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* How it works */}
                <section
                    id="how-it-works"
                    className="bg-mint px-6 py-14 md:px-16 md:py-20"
                    aria-labelledby="how-heading"
                >
                    <h2 id="how-heading" className="font-display text-3xl font-medium tracking-tight text-brown md:text-4xl">
                        How shopping with us works
                    </h2>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-brown/75">
                        We kept it simple on purpose. There&apos;s no account to create and no card
                        details to type in. You shop here and we finish the rest together in a chat.
                    </p>
                    <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, index) => (
                            <li key={step.title} className="rounded-2xl bg-cream p-6">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-forest text-sm text-forest">
                                    {index + 1}
                                </span>
                                <h3 className="mt-4 font-semibold text-brown">{step.title}</h3>
                                <p className="mt-1.5 text-sm leading-6 text-brown/70">{step.text}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Closing */}
                <section className="bg-cream px-6 py-14 text-center md:px-16 md:py-20">
                    <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium tracking-tight text-brown md:text-4xl">
                        Thanks for letting us be a small part of their big days
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-brown/75">
                        Have a look around, and if anything isn&apos;t clear, just ask. We&apos;re always happy to help.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/products"
                            className="rounded-full bg-terracotta px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        >
                            Shop the collection
                        </Link>
                        <Link
                            href="/contact"
                            className="rounded-full border border-brown px-8 py-4 text-sm font-semibold text-brown transition-colors hover:bg-brown hover:text-cream"
                        >
                            Say hello
                        </Link>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </>
    );
}
