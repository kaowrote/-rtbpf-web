import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
// GET /api/users — List all users
export async function GET(request: NextRequest) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.authorized) return authResult.response;

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "50");
        const page = parseInt(searchParams.get("page") || "1");
        const role = searchParams.get("role");
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const skip = (page - 1) * limit;

        const where: any = {};
        if (role) where.role = role;
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    status: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                    // Exclude sensitive fields
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip,
            }),
            prisma.user.count({ where }),
        ]);

        return successResponse(users, {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch users", 500);
    }
}

// POST /api/users — Create (invite) a new user
export async function POST(request: NextRequest) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.authorized) return authResult.response;

        const data = await request.json();

        if (!data.email) {
            return errorResponse("Email is required", 400);
        }

        // Check existing
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            return errorResponse("อีเมลนี้มีผู้ใช้งานแล้ว", 400);
        }

        const hashedPassword = data.password
            ? await bcrypt.hash(data.password, 10)
            : await bcrypt.hash("rtbpf2024", 10); // Default temp password

        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                hashedPassword,
                role: data.role || "MEMBER",
                status: data.status || "ACTIVE",
                bio: data.bio,
                phone: data.phone,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });

        return successResponse(newUser, { message: "User created successfully" }, 201);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to create user", 500);
    }
}
