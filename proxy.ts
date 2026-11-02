import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
 * The admin area is a PREVIEW with no login yet (milestone M1, ADR-0003).
 * Block it in production before any rendering happens, unless explicitly
 * enabled with ADMIN_PREVIEW=true for a private review deployment.
 * Replace this with a real requireAdmin() session check when auth lands.
 */
export function proxy(request: NextRequest) {
    const isPreviewEnabled =
        process.env.NODE_ENV !== "production" || process.env.ADMIN_PREVIEW === "true";

    if (!isPreviewEnabled) {
        return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/admin/:path*",
};
