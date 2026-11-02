/*
 * Shared line icons (SVG). The project uses these instead of emoji or
 * symbol characters, so icons look the same on every device.
 * All are decorative (aria-hidden); give the surrounding control a label.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 18, children, ...props }: IconProps) {
    return (
        <svg
            aria-hidden="true"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {children}
        </svg>
    );
}

export function ArrowLeftIcon(props: IconProps) {
    return <Icon {...props}><path d="M19 12H5M11 6l-6 6 6 6" /></Icon>;
}

export function ArrowRightIcon(props: IconProps) {
    return <Icon {...props}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
}

export function ArrowUpRightIcon(props: IconProps) {
    return <Icon {...props}><path d="M7 17 17 7M8 7h9v9" /></Icon>;
}

export function CheckIcon(props: IconProps) {
    return <Icon {...props}><path d="m5 12.5 4.5 4.5L19 7.5" /></Icon>;
}

export function CloseIcon(props: IconProps) {
    return <Icon {...props}><path d="M6 6l12 12M18 6 6 18" /></Icon>;
}

export function SearchIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </Icon>
    );
}

export function HeartIcon({ filled = false, ...props }: IconProps & { filled?: boolean }) {
    return (
        <Icon fill={filled ? "currentColor" : "none"} {...props}>
            <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4 7.4 4c2 0 3.5 1.1 4.6 2.7C13.1 5.1 14.6 4 16.6 4c3.5 0 5.8 3.6 4.6 7.1-1.7 4.8-9.2 9.4-9.2 9.4Z" />
        </Icon>
    );
}

export function StarIcon({ filled = true, ...props }: IconProps & { filled?: boolean }) {
    return (
        <Icon fill={filled ? "currentColor" : "none"} strokeWidth="1.4" {...props}>
            <path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8Z" />
        </Icon>
    );
}

export function CartIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M3 4h2.2l2.1 10.4a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.1" />
            <circle cx="9.5" cy="19.5" r="1.3" />
            <circle cx="17" cy="19.5" r="1.3" />
        </Icon>
    );
}
