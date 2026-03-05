"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, undefined);

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="font-thai">อีเมล</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        disabled={isPending}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="font-thai">รหัสผ่าน</Label>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-accent hover:underline font-thai"
                        >
                            ลืมรหัสผ่าน?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        disabled={isPending}
                        required
                    />
                </div>
            </div>

            {state?.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-thai">
                        {state.error}
                    </AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full font-thai text-lg" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                เข้าสู่ระบบ
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-thai">
                        หรือดำเนินการต่อด้วย
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" disabled={isPending} className="font-thai">
                    Google
                </Button>
                <Button variant="outline" type="button" disabled={isPending} className="font-thai">
                    Facebook
                </Button>
            </div>
        </form>
    );
}
