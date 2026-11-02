function FlowerIcon() {
    return (
        <svg
            aria-hidden="true"
            width="64"
            height="84"
            viewBox="0 0 64 84"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* petals */}
            <circle cx="32" cy="12" r="9" />
            <circle cx="32" cy="40" r="9" />
            <circle cx="18" cy="26" r="9" />
            <circle cx="46" cy="26" r="9" />
            <circle cx="32" cy="26" r="5" />
            {/* stem and leaves */}
            <path d="M32 49v32" />
            <path d="M32 74c-4-9-14-12-24-10 3 9 12 13 24 10Z" />
            <path d="M32 74c4-9 14-12 24-10-3 9-12 13-24 10Z" />
        </svg>
    );
}

export default function BrandStory() {
    return (
        <section
            id="our-little-world"
            aria-labelledby="brand-story-heading"
            className="bg-soft-green px-6 py-14 md:px-16 md:py-16"
        >
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-16">
                <div className="shrink-0 text-terracotta md:pl-6">
                    <FlowerIcon />
                </div>

                <div className="max-w-2xl">
                    <h2
                        id="brand-story-heading"
                        className="font-display text-3xl font-medium tracking-tight text-brown md:text-4xl"
                    >
                        Less fuss. More childhood.
                    </h2>
                    <p className="mt-4 text-base leading-7 text-brown/80">
                        We make the clothes. They make the memories. Thoughtful details, gentle
                        fabrics, and room to grow — because the best outfits are the ones they
                        forget they&apos;re wearing.
                    </p>
                </div>
            </div>
        </section>
    );
}
