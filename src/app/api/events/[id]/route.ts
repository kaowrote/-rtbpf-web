import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireEditor } from "@/lib/auth-guard";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const event = await prisma.event.findUnique({
            where: {
                id: resolvedParams.id
            }
        });

        if (!event) return errorResponse("Event not found", 404);
        return successResponse(event);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch event", 500);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const data = await request.json();
        const resolvedParams = await params;

        const updatedEvent = await prisma.event.update({
            where: {
                id: resolvedParams.id
            },
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                description: data.description,
                eventType: data.eventType,
                status: data.status,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : null,
                location: data.location,
                imageUrl: data.imageUrl,
                tags: data.tags,
                capacity: data.capacity,
                ticketPrice: data.ticketPrice,
                registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
                registerUrl: data.registerUrl,
                mapEmbedUrl: data.mapEmbedUrl,
                mapDirectionUrl: data.mapDirectionUrl,
                agenda: data.agenda,
                speakers: data.speakers,
                resources: data.resources,
            }
        });

        return successResponse(updatedEvent, { message: "Event updated successfully" });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to update event", 500);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const resolvedParams = await params;
        await prisma.event.delete({
            where: {
                id: resolvedParams.id
            }
        });

        return successResponse(null, { message: "Event deleted successfully" });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to delete event", 500);
    }
}
