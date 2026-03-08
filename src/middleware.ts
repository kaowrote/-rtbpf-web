import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const handleI18nRouting = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    if (isApiRoute) return;

    // For admin routes, we rely on auth middleware
    if (isAdminRoute) return;

    // For all other routes, apply i18n routing
    return handleI18nRouting(req);
});

export const config = {
    // Matcher for both i18n and auth
    matcher: [
        // Enable a redirect to a matching locale at the root
        "/",

        // Set a cookie to remember the last locale for these paths
        "/(th|en|ko|ja|zh|fr|de|es)/:path*",

        // Admin routes
        "/admin/:path*",
    ],
};
