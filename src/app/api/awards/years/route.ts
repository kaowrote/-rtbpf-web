import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireEditor } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
// GET /api/awards/years — List all award years
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "20");

        const years = await prisma.awardYear.findMany({
            include: {
                _count: {
                    select: { nominees: true }
                },
                nominees: {
                    where: { isWinner: true },
                    select: { id: true }
                }
            },
            orderBy: { year: "desc" },
            take: limit,
        });

        // Transform to include winner count
        const result = years.map((y) => ({
            ...y,
            totalNominees: y._count.nominees,
            totalWinners: y.nominees.length,
            nominees: undefined,
            _count: undefined,
        }));

        return successResponse(result);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch award years", 500);
    }
}

// POST /api/awards/years — Create a new award year
export async function POST(request: NextRequest) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const data = await request.json();

        if (!data.year) {
            return errorResponse("Year is required", 400);
        }

        const newYear = await prisma.awardYear.create({
            data: {
                year: data.year,
                edition: data.edition,
                theme: data.theme,
                ceremonyDate: data.ceremonyDate ? new Date(data.ceremonyDate) : null,
            },
        });

        return successResponse(newYear, { message: "Award year created successfully" }, 201);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to create award year");
    }
}
