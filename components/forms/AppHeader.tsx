"use client";
import { AvatarDropdown } from "@/components/forms";
import { SidebarMode } from "@/components/forms/AppSidebar";
import { AvatarItem } from "@/components/forms/AvatarDropdown";
import UserModel from "@/models/UserModel";
import { BellRing, Globe, Menu, Settings, Sun, User } from "lucide-react";

const AppHeader = ({
    user,
    sidebarMode,
    setSidebarMode,
}: {
    user: UserModel;
    sidebarMode?: SidebarMode;
    setSidebarMode?: (mode: SidebarMode) => void;
}) => {

    const itemsAvatar: AvatarItem[] = [
        {
            icon: <User size={18} className="text-gray-600" />,
            label: "Hồ sơ",
        },
        {
            icon: <Globe size={18} className="text-green-600" />,
            label: "Ngôn ngữ",
        },
        {
            icon: <Sun size={18} className="text-yellow-600" />,
            label: "Chế độ sáng tối",
        },
        {
            icon: <Settings size={18} className="text-blue-600" />,
            label: "Cài đặt",
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
            }}
        >
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