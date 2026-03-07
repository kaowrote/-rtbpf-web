import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, STORAGE_BUCKET, getPublicUrl } from "@/lib/supabase";
import { requireEditor } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
];

function generateFileName(originalName: string): string {
    const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}.${ext}`;
}

// POST /api/upload — Upload a single file
export async function POST(request: NextRequest) {
    try {
        // Auth check — require at least Editor role
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const folder = (formData.get("folder") as string) || "general";

        if (!file) {
            return NextResponse.json(
                { success: false, error: { code: "BAD_REQUEST", message: "ไม่พบไฟล์ที่อัพโหลด" } },
                { status: 400 }
            );
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: { code: "BAD_REQUEST", message: `ไม่รองรับไฟล์ประเภท ${file.type} — รองรับเฉพาะ JPEG, PNG, WebP, GIF, SVG` } },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, error: { code: "BAD_REQUEST", message: `ไฟล์ใหญ่เกินไป (${(file.size / 1024 / 1024).toFixed(1)}MB) — จำกัด 5MB` } },
                { status: 400 }
            );
        }

        // Generate unique file path
        const fileName = generateFileName(file.name);
        const filePath = `${folder}/${fileName}`;

        // Convert File to ArrayBuffer then to Buffer for upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, buffer, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json(
                { success: false, error: { code: "UPLOAD_FAILED", message: `อัพโหลดไม่สำเร็จ: ${error.message}` } },
                { status: 500 }
            );
        }

        // Get the public URL
        const publicUrl = getPublicUrl(data.path);

        return NextResponse.json({
            success: true,
            data: {
                url: publicUrl,
                path: data.path,
                fileName,
                originalName: file.name,
                size: file.size,
                type: file.type,
            },
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "เกิดข้อผิดพลาดในการอัพโหลด" } },
            { status: 500 }
        );
    }
}

// DELETE /api/upload — Delete a file from storage
export async function DELETE(request: NextRequest) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const { path } = await request.json();

        if (!path) {
            return NextResponse.json(
                { success: false, error: { code: "BAD_REQUEST", message: "กรุณาระบุ path ของไฟล์" } },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .remove([path]);

        if (error) {
            return NextResponse.json(
                { success: false, error: { code: "DELETE_FAILED", message: `ลบไฟล์ไม่สำเร็จ: ${error.message}` } },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: { message: "ลบไฟล์สำเร็จ" } });
    } catch (error: any) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "เกิดข้อผิดพลาดในการลบไฟล์" } },
            { status: 500 }
        );
    }
}
