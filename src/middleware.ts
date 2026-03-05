import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
    // Match only admin routes (excluding API, static, and image routes)
    matcher: [
        "/admin/:path*",
    ],
};
