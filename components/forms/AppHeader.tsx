"use client";
import { AvatarDropdown } from "@/components/forms";
import { MenuItem, SidebarMode } from "@/components/forms/AppSidebar";
import { AvatarItem } from "@/components/forms/AvatarDropdown";
import UserModel from "@/models/UserModel";
import { Atom, BellRing, Globe, Menu, Moon, Settings, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";

const AppHeader = ({
    user,
    sidebarMode,
    setSidebarMode,
}: {
    user: UserModel;
    sidebarMode?: SidebarMode;
    setSidebarMode?: (mode: SidebarMode) => void;
}) => {
    const { setTheme } = useTheme();
    const { t, i18n } = useTranslation();
    let pathname = usePathname();
    const [namePage, setNamePage] = useState<string>("");

    useEffect(() => {
        if (pathname.startsWith("/")) {
            pathname = pathname.slice(1);
        }
        pathname = pathname.replace("/", "_");
        setNamePage(t(`common:${pathname}`));
    }, [pathname]);

    const itemsAvatar: AvatarItem[] = [
        {
            icon: <User size={18} className="text-gray-600" />,
            label: t("common:profile"),
        },
        {
            icon: <Globe size={18} className="text-green-600" />,
            label: t("common:language"),
            children: [
                {
                    icon: '🇺🇸',
                    label: t("common:english"),
                    onClick: () => i18n.changeLanguage("en"),
                },
                {
                    icon: '🇻🇳',
                    label: t("common:vietnamese"),
                    onClick: () => i18n.changeLanguage("vi"),
                },
                {
                    icon: '🇨🇳',
                    label: t("common:chinese"),
                    onClick: () => i18n.changeLanguage("cn"),
                },
                {
                    icon: '🇯🇵',
                    label: t("common:japan"),
                    onClick: () => i18n.changeLanguage("jp"),
                }
            ],
        },
        {
            icon: <Sun size={18} className="text-yellow-600" />,
            label: t("common:theme"),
            children: [
                {
                    icon: <Sun size={18} className="text-yellow-600" />,
                    label: t("common:light"),
                    onClick: () => setTheme("light"),
                },
                {
                    icon: <Moon size={18} className="text-blue-600" />,
                    label: t("common:dark"),
                    onClick: () => setTheme("dark"),
                },
                {
                    icon: <Atom size={18} className="text-blue-600" />,
                    label: t("common:system"),
                    onClick: () => setTheme("system"),
                }
            ],
        },
        {
            icon: <Settings size={18} className="text-blue-600" />,
            label: t("common:settings"),
        },
    ];

    const handleToggleSidebar = () => {
        if (!setSidebarMode) return;

        if (sidebarMode === "expanded") {
            setSidebarMode("collapsed");
        } else {
            setSidebarMode("expanded");
        }
    };

    return (
        <header>
            <Card
                className="w-full relative bg-card/60 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl p-2"
                style={{
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)",
                }}>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleToggleSidebar}
                            className="p-2.5 rounded-xl transition-all duration-300 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 hover:shadow-md group">
                            <Menu size={20} className="text-foreground group-hover:scale-110 transition-transform" />
                        </button>
                        <div
                            className="px-4 py-2 rounded-xl transition-all duration-300 bg-primary/10 backdrop-blur-md border border-white/20 shadow-inner">
                            <h3
                                className="font-semibold text-lg whitespace-nowrap bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                                {namePage}
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="p-2.5 rounded-full transition-all duration-300 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 hover:shadow-md group">
                            <BellRing size={20} className="text-foreground group-hover:scale-110 transition-transform" />
                        </button>
                        <div
                            className="py-1.5 px-2.5 rounded-xl transition-all duration-300 bg-white/20 backdrop-blur-md border border-white/30 hover:shadow-md">
                            <AvatarDropdown
                                user={user}
                                items={itemsAvatar}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </header>);
}

export default AppHeader;