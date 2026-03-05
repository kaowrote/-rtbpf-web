"use client";

import * as React from "react";
import { Icon as IconifyIcon, IconProps as IconifyProps } from "@iconify/react";

export interface IconProps extends Omit<IconifyProps, "width" | "height"> {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string;
}

const sizeMap = {
    xs: "1rem",     // 16px
    sm: "1.25rem",  // 20px
    md: "1.5rem",   // 24px
    lg: "2rem",     // 32px
    xl: "3rem",     // 48px
};

export function Icon({ icon, size = "md", className, ...props }: IconProps) {
    return (
        <IconifyIcon
            icon={icon}
            width={sizeMap[size]}
            height={sizeMap[size]}
            className={className}
            {...props}
        />
    );
}
