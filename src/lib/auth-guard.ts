import { auth } from "@/auth";
import { errorResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";

type AllowedRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "AUTHOR" | "TRANSLATOR" | "JURY" | "MEMBER";

/**
 * Verify the current session and check if the user has the required role.
 * Returns the session user if authorized, or a NextResponse error.
 */
export async function requireAuth(
    allowedRoles?: AllowedRole[]
): Promise<
    | { authorized: true; user: { id: string; name?: string | null; email?: string | null; role?: string; status?: string } }
    | { authorized: false; response: NextResponse }
> {
    const session = await auth();

    if (!session?.user) {
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "กรุณาเข้าสู่ระบบก่อน" } },
                { status: 401 }
            ),
        };
    }

    // Check if user status is active
    if (session.user.status === "SUSPENDED" || session.user.status === "DELETED") {
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, error: { code: "FORBIDDEN", message: "บัญชีของคุณถูกระงับ" } },
                { status: 403 }
            ),
        };
    }

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = session.user.role as AllowedRole;
        if (!allowedRoles.includes(userRole)) {
            return {
                authorized: false,
                response: NextResponse.json(
                    { success: false, error: { code: "FORBIDDEN", message: "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้" } },
                    { status: 403 }
                ),
            };
        }
    }

    return {
        authorized: true,
        user: session.user as any,
    };
}

/** Shorthand: require at least Editor role */
export const requireEditor = () => requireAuth(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

/** Shorthand: require at least Admin role */
export const requireAdmin = () => requireAuth(["SUPER_ADMIN", "ADMIN"]);

/** Shorthand: require Super Admin */
export const requireSuperAdmin = () => requireAuth(["SUPER_ADMIN"]);
