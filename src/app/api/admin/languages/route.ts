import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
    try {
        const languages = await prisma.language.findMany({
            where: { isActive: true },
            orderBy: { isDefault: "desc" }
        });
        return successResponse(languages);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch languages", 500);
    }
}
