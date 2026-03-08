import { prisma } from "./prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";

/**
 * Log a system activity
 * @param action The action performed (e.g., "CREATE_ARTICLE", "UPDATE_USER")
 * @param entity The type of entity (e.g., "ARTICLE", "USER", "SETTING")
 * @param entityId The ID of the affected entity
 * @param metadata Optional JSON data for more context
 */
export async function logActivity(
    action: string,
    entity: string,
    entityId?: string,
    metadata?: any
) {
    try {
        const session = await auth();
        if (!session?.user?.id) return;

        const headerList = await headers();
        const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "unknown";
        const userAgent = headerList.get("user-agent") || "unknown";

        await prisma.activityLog.create({
            data: {
                userId: session.user.id,
                action,
                entity,
                entityId,
                metadata,
                ipAddress: ip,
                userAgent: userAgent
            }
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}
