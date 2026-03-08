"use client";

import * as React from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
    { code: "th", name: "ภาษาไทย", flag: "TH" },
    { code: "en", name: "English", flag: "US" },
    { code: "ko", name: "한국어", flag: "KR" },
    { code: "ja", name: "日本語", flag: "JP" },
    { code: "zh", name: "简体中文", flag: "CN" },
    { code: "fr", name: "Français", flag: "FR" },
    { code: "de", name: "Deutsch", flag: "DE" },
    { code: "es", name: "Español", flag: "ES" },
];

export function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = useLocale();

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    const currentLang = languages.find((l) => l.code === currentLocale) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-2 gap-2 text-black dark:text-white hover:text-accent hover:bg-transparent transition-colors">
                    <Globe className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline-block">
                        {currentLang.code}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-black border border-black/10 dark:border-white/10 p-1 min-w-[140px]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center justify-between cursor-pointer text-xs font-bold uppercase tracking-wider py-2 px-3 focus:bg-accent focus:text-black ${
                            currentLocale === lang.code ? "bg-accent/10 text-accent" : "text-black/70 dark:text-white/70"
                        }`}
                    >
                        <span>{lang.name}</span>
                        <span className="text-[9px] opacity-50">{lang.code}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
