"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type BackButtonProps = {
    fallbackHref?: string;
    label?: string;
    className?: string;
    iconOnly?: boolean;
};

export function BackButton({
    fallbackHref = "/products",
    label = "Назад",
    className = "",
    iconOnly = false,
}: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackHref);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={label}
            className={`inline-flex items-center gap-2 self-start rounded-full border border-zinc-200 bg-white ${iconOnly ? "px-2.5 py-2" : "p-2"} text-md font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 ${className}`}
        >
            ←
            {!iconOnly && <span>{label}</span>}
        </button>
    );
}

export function BackLink({
    href = "/products",
    label = "Назад",
    className = "",
    iconOnly = false,
}: {
    href?: string;
    label?: string;
    className?: string;
    iconOnly?: boolean;
}) {
    return (
        <Link
            href={href}
            aria-label={label}
            className={`inline-flex items-center gap-2 self-start rounded-full border border-zinc-200 bg-white ${iconOnly ? "px-2.5 py-2" : "px-3.5 py-1.5"} text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 ${className}`}
        >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-700">←</span>
            {!iconOnly && <span>{label}</span>}
        </Link>
    );
}
