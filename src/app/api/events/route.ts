import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireEditor } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const status = searchParams.get("status");
        const type = searchParams.get("type");

        const events = await prisma.event.findMany({
            where: {
                ...(status ? { status: status as any } : {}),
                ...(type ? { eventType: type as any } : {}),
            },
            orderBy: {
                startDate: "asc" // Usually order upcoming events by start date
            },
            take: limit
        });

        return successResponse(events);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch events", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const data = await request.json();

        if (!data.title || !data.slug || !data.startDate) {
            return errorResponse("Title, slug, and start date are required", 400);
        }

        const newEvent = await prisma.event.create({
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                description: data.description,
                eventType: data.eventType || "OTHER",
                status: data.status || "UPCOMING",
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                location: data.location,
                imageUrl: data.imageUrl,
                tags: data.tags || [],
                capacity: data.capacity,
                ticketPrice: data.ticketPrice,
                registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
                registerUrl: data.registerUrl,
                mapEmbedUrl: data.mapEmbedUrl,
                mapDirectionUrl: data.mapDirectionUrl,
                agenda: data.agenda || [],
                speakers: data.speakers || [],
                resources: data.resources || [],
            }
        });

        return successResponse(newEvent, { message: "Event created successfully" }, 201);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to create event", 500);
    }
}
