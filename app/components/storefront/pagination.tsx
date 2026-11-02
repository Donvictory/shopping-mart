import { ArrowLeftIcon, ArrowRightIcon } from "../icons";

type PaginationProps = {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
    label?: string;
};

/** Page numbers to show, with "gap" where pages are skipped: 1 … 4 5 6 … 12 */
export function pageList(page: number, totalPages: number): (number | "gap")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
    const pages = new Set([1, totalPages, page - 1, page, page + 1]);
    const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);
    const result: (number | "gap")[] = [];
    sorted.forEach((value, index) => {
        if (index > 0 && value - sorted[index - 1] > 1) result.push("gap");
        result.push(value);
    });
    return result;
}

const buttonClass =
    "flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition-colors disabled:opacity-30";

export default function Pagination({ page, totalPages, onChange, label = "Product pages" }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <nav aria-label={label} className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
                className={`${buttonClass} border-border text-brown hover:border-brown`}
            >
                <ArrowLeftIcon size={16} />
            </button>

            {pageList(page, totalPages).map((item, index) =>
                item === "gap" ? (
                    <span key={`gap-${index}`} className="px-1 text-sm text-brown/50" aria-hidden="true">
                        ...
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onChange(item)}
                        aria-current={item === page ? "page" : undefined}
                        aria-label={`Page ${item}`}
                        className={`${buttonClass} ${item === page
                            ? "border-brown bg-brown text-cream"
                            : "border-border text-brown hover:border-brown"
                            }`}
                    >
                        {item}
                    </button>
                )
            )}

            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
                className={`${buttonClass} border-border text-brown hover:border-brown`}
            >
                <ArrowRightIcon size={16} />
            </button>
        </nav>
    );
}
