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
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export type SidebarMode = "expanded" | "collapsed" | "auto";
export interface MenuItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    children?: MenuItem[];
}
interface Props {
    mode?: SidebarMode;
    expandedWidth?: number;
    collapsedWidth?: number;
    enableHover?: boolean;
    setMode?: (mode: SidebarMode) => void;
    menu?: MenuItem[];
}

const AppSidebar = (props: Props) => {
    const { mode, expandedWidth, collapsedWidth, enableHover, setMode, menu } = props;
    const [hovered, setHovered] = useState(false);
    const { t } = useTranslation();
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const router = useRouter();

    const isOpen = useMemo(() => {
        if (mode === "expanded") return true;
        if (mode === "collapsed") return false;
        return hovered;
    }, [mode, hovered]);

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label]
        );
    };

    const renderMenuItem = (item: MenuItem, index: number, level: number = 0) => {
        const isActive = usePathname() === item.href;
        const hasChildren = item.children && item.children.length > 0;
        const isOpenMenu = openMenus.includes(item.label);

        return (
            <div key={`${item.label}-${index}`} className="w-full">
                <div
                    onClick={() => {
                        if (hasChildren) {
                            if (!isOpen && item.children && item.children.length > 0) {
                                router.push(item.children[0].href);
                            } else {
                                toggleMenu(item.label);
                                if (!isOpen) setMode?.("expanded");
                            }
                        }
                    }}
                    className={clsx(
                        "flex items-center rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group",
                        isOpen ? "justify-start gap-3 p-3" : "justify-center gap-0 p-1 m-2"
                    )}
                    style={{
                        background: isActive
                            ? "linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.3))"
                            : "rgba(255, 255, 255, 0.3)",
                        backdropFilter: "blur(10px)",
                        border: isActive
                            ? "1px solid rgba(102, 126, 234, 0.8)"
                            : "1px solid rgba(255, 255, 255, 0.6)",
                        boxShadow: isActive
                            ? "0 4px 12px rgba(102, 126, 234, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)"
                            : "none",
                        minHeight: isOpen ? "auto" : "46px",
                        aspectRatio: isOpen ? "auto" : "1",
                        marginLeft: isOpen ? `${level * 12}px` : "8px",
                        marginRight: isOpen ? "0px" : "8px",
                    }}
                    onMouseEnter={(e) => {
                        if (!isActive) {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
                        }
                        e.currentTarget.style.transform = isOpen ? "translateX(4px)" : "scale(1.05)";
                        if (!isActive) {
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isActive) {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                            e.currentTarget.style.boxShadow = "none";
                        } else {
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)";
                        }
                        e.currentTarget.style.transform = isOpen ? "translateX(0)" : "scale(1)";
                    }}>
                    {hasChildren ? (
                        <div className={clsx(
                            "flex items-center",
                            isOpen ? "w-full justify-between" : "justify-center w-full"
                        )}>
                            <div className={clsx(
                                "flex items-center",
                                isOpen ? "gap-3" : "justify-center"
                            )}>
                                {item.icon}
                                <span
                                    className={clsx(
                                        "transition-all font-medium",
                                        isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                                    )}>
                                    {item.label}
                                </span>
                            </div>
                            {isOpen && (
                                <div className="text-gray-500">
                                    {isOpenMenu ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href={item.href} className={clsx(
                            "flex items-center",
                            isOpen ? "gap-3 w-full" : "justify-center w-full"
                        )}>
                            {item.icon}
                            <span
                                className={clsx(
                                    "transition-all font-medium",
                                    isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                                )}>
                                {item.label}
                            </span>
                        </Link>
                    )}
                </div>

                {hasChildren && isOpenMenu && isOpen && (
                    <div className="mt-1 space-y-1">
                        {item.children!.map((child, childIndex) =>
                            renderMenuItem(child, childIndex, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Sidebar
            className="h-screen transition-all duration-300 bg-sidebar backdrop-blur-xl border-r border-sidebar-border shadow-2xl"
            style={{
                width: isOpen ? `${expandedWidth}px` : `${collapsedWidth}px`,
            }}
            onMouseEnter={() => mode === "auto" && setHovered(true)}
            onMouseLeave={() => mode === "auto" && setHovered(false)}>
            <SidebarHeader>
                <div className={clsx(
                    "flex items-center overflow-hidden transition-all",
                    isOpen ? "justify-start gap-3" : "justify-center"
                )}>
                    <Link href={appInfos.logo.url} className="flex items-center gap-2">
                        <h1 className={clsx(
                            "text-xl font-bold whitespace-nowrap transition-all duration-300 px-2 pt-5",
                            appInfos.logo.font,
                        )}
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}>
                            {appInfos.logo.name}
                        </h1>
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className={clsx(
                    "transition-all",
                    isOpen ? "space-y-2 px-2" : "space-y-2 px-1"
                )}>
                    {menu && menu.map((item, index) => renderMenuItem(item, index))}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div style={{
                    height: "1px",
                    background: "linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0))",
                    margin: "12px 0",
                }} />
                <div className={clsx(
                    "flex items-center gap-2 transition-all pb-2",
                    isOpen ? "justify-end px-2" : "justify-center"
                )}>
                    {mode === "expanded" && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={() => setMode && setMode("collapsed")}
                                    className="cursor-pointer p-2 rounded-lg transition-all duration-300"
                                    style={{
                                        background: "rgba(255, 255, 255, 0.4)",
                                        backdropFilter: "blur(10px)",
                                        border: "1px solid rgba(255, 255, 255, 0.5)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
                                        e.currentTarget.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}>
                                    <ArrowLeftFromLine size={18} />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>{t("common:close")}</TooltipContent>
                        </Tooltip>
                    )}

                    {mode === "collapsed" && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={() => setMode && setMode("expanded")}
                                    className="cursor-pointer p-2 rounded-lg transition-all duration-300"
                                    style={{
                                        background: "rgba(255, 255, 255, 0.4)",
                                        backdropFilter: "blur(10px)",
                                        border: "1px solid rgba(255, 255, 255, 0.5)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
                                        e.currentTarget.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}>
                                    <ArrowRightFromLine size={18} />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>{t("common:open")}</TooltipContent>
                        </Tooltip>
                    )}

                    {mode === "auto" && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={() => setMode && setMode("auto")}
                                    className="cursor-pointer p-2 rounded-lg transition-all duration-300"
                                    style={{
                                        background: "rgba(255, 255, 255, 0.4)",
                                        backdropFilter: "blur(10px)",
                                        border: "1px solid rgba(255, 255, 255, 0.5)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
                                        e.currentTarget.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}>
                                    <ArrowLeftRight size={18} />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>{t("common:auto")}</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;
