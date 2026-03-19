"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await fetch("/api/auth/signout", { method: "POST" });
            } catch {
                // Silent fail
            } finally {
                router.push("/admin/login");
                router.refresh();
            }
        };
        performLogout();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1b294b]">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#cfb659] mx-auto mb-4" />
                <p className="text-white/70 text-sm font-medium">Signing out...</p>
            </div>
        </div>
    );
}
