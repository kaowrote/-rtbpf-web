import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireEditor } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
// GET /api/awards/nominees — List all nominees (with filters)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const yearId = searchParams.get("yearId");
        const year = searchParams.get("year");
        const categoryId = searchParams.get("categoryId");
        const winnersOnly = searchParams.get("winnersOnly") === "true";
        const limit = parseInt(searchParams.get("limit") || "50");
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};
        if (yearId) where.yearId = yearId;
        if (categoryId) where.categoryId = categoryId;
        if (winnersOnly) where.isWinner = true;
        if (year) {
            where.year = { year: parseInt(year) };
        }

        const [nominees, total] = await Promise.all([
            prisma.awardNominee.findMany({
                where,
                include: {
                    year: { select: { year: true, edition: true } },
                    category: { select: { name: true, type: true } },
                },
                orderBy: [
                    { isWinner: "desc" },
                    { nomineeName: "asc" },
                ],
                take: limit,
                skip,
            }),
            prisma.awardNominee.count({ where }),
        ]);

        return successResponse(nominees, {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch nominees", 500);
    }
}

// POST /api/awards/nominees — Create a new nominee
export async function POST(request: NextRequest) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const data = await request.json();

        if (!data.yearId || !data.categoryId || !data.nomineeName) {
            return errorResponse("Year, category, and nominee name are required", 400);
        }

        const newNominee = await prisma.awardNominee.create({
            data: {
                yearId: data.yearId,
                categoryId: data.categoryId,
                nomineeName: data.nomineeName,
                workTitle: data.workTitle,
                broadcastingChannel: data.broadcastingChannel,
                imageUrl: data.imageUrl,
                isWinner: data.isWinner || false,
            },
            include: {
                year: { select: { year: true } },
                category: { select: { name: true } },
            },
        });

        return successResponse(newNominee, { message: "Nominee created successfully" }, 201);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to create nominee", 500);
    }
}
