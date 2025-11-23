"use client";
import { AvatarDropdown } from "@/components/forms";
import { MenuItem, SidebarMode } from "@/components/forms/AppSidebar";
import { AvatarItem } from "@/components/forms/AvatarDropdown";
import UserModel from "@/models/UserModel";
import { BellRing, Globe, Menu, Settings, Sun, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const AppHeader = ({
    user,
    sidebarMode,
    setSidebarMode,
    menu,
}: {
    user: UserModel;
    sidebarMode?: SidebarMode;
    setSidebarMode?: (mode: SidebarMode) => void;
    menu: MenuItem[];
}) => {
    const { t } = useTranslation();

    const itemsAvatar: AvatarItem[] = [
        {
            icon: <User size={18} className="text-gray-600" />,
            label: t("common:profile"),
        },
        {
            icon: <Globe size={18} className="text-green-600" />,
            label: t("common:language"),
        },
        {
            icon: <Sun size={18} className="text-yellow-600" />,
            label: t("common:theme"),
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
        <header
            className="w-full relative"
            style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                padding: "5px 15px",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.7)",
            }}>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleToggleSidebar}
                        className="p-2.5 rounded-xl transition-all duration-300"
                        style={{
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}>
                        <Menu size={20} />
                    </button>
                    <div
                        className="px-4 py-2 rounded-xl transition-all duration-300"
                        style={{
                            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.25), rgba(118, 75, 162, 0.20))",
                            backdropFilter: "blur(15px)",
                            WebkitBackdropFilter: "blur(15px)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                            boxShadow: "0 4px 16px rgba(102, 126, 234, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
                        }}>
                        <h3
                            className="font-semibold text-lg whitespace-nowrap"
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}>
                            {menu.find((item) => item.href === window.location.pathname)?.label}
                        </h3>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="p-2.5 rounded-full transition-all duration-300"
                        style={{
                            background: "rgba(255, 255, 255, 0.4)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.6)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
                            e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                        }}>
                        <BellRing size={20} />
                    </button>
                    <button
                        className="py-1.5 px-2.5 rounded-xl transition-all duration-300"
                        style={{
                            background: "rgba(255, 255, 255, 0.4)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.6)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
                            e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                        }}>
                        <AvatarDropdown
                            user={user}
                            items={itemsAvatar}
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default AppHeader;