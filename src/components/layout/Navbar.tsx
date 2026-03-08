"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export function Navbar({ siteName }: { siteName?: string }) {
    const [isOpen, setIsOpen] = React.useState(false);
    
    const displayName = siteName || siteConfig.name;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-white/95 dark:bg-black/95 text-black dark:text-white backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-black/60 transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-8 flex h-20 items-center justify-between">

                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-2xl tracking-tighter text-accent">
                            {displayName}
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex flex-1 justify-center">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2">
                            {siteConfig.mainNav.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                "font-thai bg-transparent text-black/80 dark:text-white/80 hover:bg-transparent hover:text-accent focus:bg-transparent focus:text-accent text-sm md:text-base tracking-wide uppercase font-semibold transition-colors dark:hover:text-accent dark:focus:text-accent"
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Action Buttons (Search & Member) */}
                <div className="flex items-center space-x-1 md:space-x-4 ml-auto md:ml-0">
                    <Button variant="ghost" size="icon" className="text-black dark:text-white hover:text-accent dark:hover:text-accent hover:bg-transparent hidden sm:flex transition-colors">
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                    <LanguageSwitcher />
                    <ThemeToggle />

                    {/* Minimal Action (No Member logic here) */}
                </div>

                {/* Mobile Navigation Toggle */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden text-black dark:text-white transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0 bg-white dark:bg-black text-black dark:text-white border-r border-black/10 dark:border-white/10">
                        <MobileLink
                            href="/"
                            className="flex items-center"
                            onOpenChange={setIsOpen}
                        >
                            <span className="font-bold text-xl text-accent">{displayName}</span>
                        </MobileLink>
                        <div className="my-8 flex flex-col space-y-4 pb-10 pr-6">
                            {siteConfig.mainNav.map((item) => (
                                <MobileLink
                                    key={item.href}
                                    href={item.href}
                                    onOpenChange={setIsOpen}
                                    className="font-thai text-lg text-black/80 dark:text-white/80 hover:text-accent dark:hover:text-accent transition-colors"
                                >
                                    {item.title}
                                </MobileLink>
                            ))}
                            <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-4">
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}

interface MobileLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
}

function MobileLink({
    href,
    onOpenChange,
    className,
    children,
    ...props
}: MobileLinkProps) {
    return (
        <Link
            href={href!}
            onClick={() => onOpenChange?.(false)}
            className={cn(className)}
            {...props}
        >
            {children}
        </Link>
    );
}
