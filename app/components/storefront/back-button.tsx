"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "../icons";

type BackButtonProps = {
    /** Where to go when there is no earlier page in this tab (e.g. opened from a shared link). */
    fallbackHref: string;
    label?: string;
};

export default function BackButton({ fallbackHref, label = "Back" }: BackButtonProps) {
    const router = useRouter();

    function goBack() {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackHref);
        }
    }

    return (
        <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-4 py-2 text-sm font-medium text-brown transition-colors hover:border-brown"
        >
            <ArrowLeftIcon size={16} />
            {label}
        </button>
    );
}
