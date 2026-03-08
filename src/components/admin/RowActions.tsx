"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreVertical, Edit, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RowActions({
    editUrl,
    deleteApiUrl,
    onDeleted,
    showEdit = true,
    showDelete = true,
}: {
    editUrl: string;
    deleteApiUrl: string;
    onDeleted?: () => void;
    showEdit?: boolean;
    showDelete?: boolean;
}) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(deleteApiUrl, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error?.message || "Failed to delete item");
            }
            if (onDeleted) onDeleted();
            router.refresh();
        } catch (error: any) {
            alert(`Error deleting: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // If nothing to show, don't show the menu at all
    if (!showEdit && !showDelete) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-black dark:hover:text-white" disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-5 h-5" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] rounded-sm font-sans">
                {showEdit && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={editUrl}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                )}
                {showDelete && (
                    <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950/30">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
