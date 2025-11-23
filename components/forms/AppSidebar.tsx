"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { appInfos } from "@/constants/appInfos";
import Link from "next/link";
import {
    ArrowLeftFromLine,
    ArrowLeftRight,
    ArrowRightFromLine,
    BookHeart,
    Gauge,
    Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import clsx from "clsx";

export type SidebarMode = "expanded" | "collapsed" | "auto";

export function AppSidebar() {
    const [mode, setMode] = useState<SidebarMode>("expanded");
    const [hovered, setHovered] = useState(false);

    const isOpen = useMemo(() => {
        if (mode === "expanded") return true;
        if (mode === "collapsed") return false;
        return hovered;
    }, [mode, hovered]);

    const menu: { icon: React.ReactNode, label: string, href: string }[] = [
        {
            icon: <Gauge />,
            label: "Bảng điều khiển",
            href: "/dashboard",
        },
        {
            icon: <Users />,
            label: "Người dùng",
            href: "/users",
        },
        {
            icon: <BookHeart />,
            label: "Banner",
            href: "/banners",
        }
    ];

    return (
        <Sidebar
            className={clsx(
                "h-screen border-r bg-white transition-all duration-300",
                isOpen ? "w-60" : "w-[60px]"
            )}
            onMouseEnter={() => mode === "auto" && setHovered(true)}
            onMouseLeave={() => mode === "auto" && setHovered(false)}>
            <SidebarHeader>
                <div className={clsx(
                    "flex items-center overflow-hidden transition-all",
                    isOpen ? "justify-start px-2 gap-2" : "justify-center"
                )}>
                    <Link href={appInfos.logo.url} className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
                            {appInfos.logo.name.charAt(0)}
                        </div>

                        <h1 className={clsx(
                            "text-xl font-bold whitespace-nowrap transition-all duration-300",
                            isOpen
                                ? "opacity-100 translate-x-0 w-auto"
                                : "opacity-0 -translate-x-4 w-0 overflow-hidden"
                        )}>
                            {appInfos.logo.name}
                        </h1>
                    </Link>
                </div>
                <hr />
            </SidebarHeader>

            <SidebarContent className="flex flex-col gap-1">
                <SidebarGroup className="space-y-1">
                    {menu.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={clsx(
                                "flex items-center rounded-lg p-2 transition-all cursor-pointer",
                                isOpen ? "justify-start gap-3" : "justify-center"
                            )}>
                            {item.icon}
                            <span
                                className={clsx(
                                    "transition-all",
                                    isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                                )}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <hr />
                <div className={clsx(
                    "flex items-center gap-2 transition-all",
                    isOpen ? "justify-end px-2" : "justify-center"
                )}>
                    {mode === "expanded" && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ArrowLeftFromLine
                                    onClick={() => setMode("collapsed")}
                                    className="cursor-pointer"
                                />
                            </TooltipTrigger>
                            <TooltipContent>Đóng menu</TooltipContent>
                        </Tooltip>
                    )}

                    {mode === "collapsed" && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ArrowRightFromLine
                                    onClick={() => setMode("expanded")}
                                    className="cursor-pointer"
                                />
                            </TooltipTrigger>
                            <TooltipContent>Mở menu</TooltipContent>
                        </Tooltip>
                    )}

                    {mode === "auto" && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ArrowLeftRight
                                    onClick={() => setMode("auto")}
                                    className="cursor-pointer"
                                />
                            </TooltipTrigger>
                            <TooltipContent>Tự động</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
