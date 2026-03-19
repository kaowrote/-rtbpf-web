import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/notifications — fetch user's notifications
export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const unreadOnly = searchParams.get("unread") === "true";
        const limit = parseInt(searchParams.get("limit") || "20");

        const notifications = await (prisma as any).notification.findMany({
            where: {
                userId: session.user.id,
                ...(unreadOnly ? { isRead: false } : {}),
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        const unreadCount = await (prisma as any).notification.count({
            where: { userId: session.user.id, isRead: false },
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error: any) {
        console.error("GET /api/notifications error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/notifications — mark notifications as read
export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const body = await req.json();
        const { notificationIds, markAllRead } = body;

        if (markAllRead) {
            await (prisma as any).notification.updateMany({
                where: { userId: session.user.id, isRead: false },
                data: { isRead: true },
            });
        } else if (notificationIds?.length) {
            await (prisma as any).notification.updateMany({
                where: {
                    id: { in: notificationIds },
                    userId: session.user.id,
                },
                data: { isRead: true },
            });
        }

        return NextResponse.json({ message: "Notifications updated" });
    } catch (error: any) {
        console.error("PATCH /api/notifications error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
