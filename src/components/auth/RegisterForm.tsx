"use client";

import * as React from "react";
import { useActionState } from "react";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(registerAction, undefined);

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="font-thai">ชื่อ</Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="ชื่อ - นามสกุล"
                        disabled={isPending}
                        required
                    />
                </div>
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
                    <Label htmlFor="password" className="font-thai">รหัสผ่าน</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="อย่างน้อย 6 ตัวอักษร"
                        disabled={isPending}
                        required
                        minLength={6}
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
                สมัครสมาชิก
            </Button>
        </form>
    );
}
