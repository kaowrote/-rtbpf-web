import { NextResponse } from "next/server";
import { signOut } from "@/auth";

export async function POST() {
    try {
        await signOut({ redirect: false });
        return NextResponse.json({ success: true });
    } catch {
        // signOut may throw redirect — treat as success
        return NextResponse.json({ success: true });
    }
}
