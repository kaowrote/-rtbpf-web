import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminRoute = nextUrl.pathname.startsWith("/admin");
            const isAdminLogin = nextUrl.pathname === "/admin/login";

            // Allow access to the admin login page without auth
            if (isAdminLogin) {
                // If already logged in, redirect to admin dashboard
                if (isLoggedIn) {
                    return Response.redirect(new URL("/admin", nextUrl));
                }
                return true;
            }

            // Protect all /admin/* routes
            if (isAdminRoute) {
                if (!isLoggedIn) {
                    return false; // Redirects to signIn page (/admin/login)
                }

                // Check role — only SUPER_ADMIN, ADMIN, EDITOR, AUTHOR allowed
                const allowedRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR", "TRANSLATOR", "JURY"];
                const userRole = auth?.user?.role;
                if (userRole && !allowedRoles.includes(userRole)) {
                    // Members cannot access admin
                    return Response.redirect(new URL("/", nextUrl));
                }

                return true;
            }

            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.status = user.status;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                if (token.sub) {
                    session.user.id = token.sub;
                }
                session.user.role = token.role as string;
                session.user.status = token.status as string;
            }
            return session;
        },
    },
    providers: [], // Overridden by auth.ts where Database connection allows bcryptjs
} satisfies NextAuthConfig;
