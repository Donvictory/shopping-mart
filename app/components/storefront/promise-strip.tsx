const promises = [
    "Kinder fabrics. Happier skin.",
    "Free US shipping $75+",
    "Easy 30-day returns",
];

export default function PromiseStrip() {
    return (
        <section className="hidden grid grid-cols-1 border-b border-border bg-cream px-6 py-8 sm:grid-cols-3 md:px-16">
            {promises.map((promise, index) => (
                <div
                    key={promise}
                    className={`flex items-center justify-center px-4 py-3 text-center text-sm font-medium text-brown ${index !== 0 ? "sm:border-l sm:border-border" : ""
                        }`}
                >
                    {promise}
                </div>
            ))}
        </section>
    );
}