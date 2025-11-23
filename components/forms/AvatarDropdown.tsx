"use client";

import React from "react";
import { LogOut, Settings, Globe, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserModel from "@/models/UserModel";
import { useTranslation } from "react-i18next";

export interface AvatarItem {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

interface Props {
    user: UserModel
    items: AvatarItem[]
}

const AvatarDropdown = (props: Props) => {
    const { user, items } = props;
    const [open, setOpen] = React.useState(false);
    const { t } = useTranslation();

    const handleLogout = () => {
        console.log("Đăng xuất");
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-3 outline-none group"
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}>
                    <img
                        src={user.avatar}
                        alt={user.firstname + " " + user.lastname}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50 group-hover:ring-white/80 transition-all duration-300"
                    />
                    <div className="flex flex-col text-left">
                        <p className="font-semibold text-sm text-gray-900">{user.firstname + " " + user.lastname}</p>
                        <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-64 p-2 gap-3"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                style={{
                    background:
                        "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    boxShadow:
                        "0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
                }}>

                {items.map((item, index) => (
                    <>
                        <DropdownMenuItem
                            key={index}
                            onClick={item.onClick}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer outline-none transition-all duration-300"
                            style={{
                                background: "transparent",
                                backdropFilter: "none",
                                WebkitBackdropFilter: "none",
                                border: "1px solid transparent",
                                boxShadow: "none",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.4))";
                                e.currentTarget.style.backdropFilter = "blur(10px)";
                                (e.currentTarget.style as any).WebkitBackdropFilter = "blur(10px)";
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.backdropFilter = "none";
                                (e.currentTarget.style as any).WebkitBackdropFilter = "none";
                                e.currentTarget.style.borderColor = "transparent";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}>
                            <div
                                className="p-2 rounded-lg"
                                style={{
                                    background: "transparent",
                                    border: "none",
                                }}>
                                {item.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator
                            style={{
                                background: "rgba(200, 200, 200, 0.15)",
                                margin: "1px 0",
                            }}
                        />
                    </>
                ))}

                <DropdownMenuSeparator
                    style={{
                        background: "rgba(255, 255, 255, 0.3)",
                        margin: "4px 0",
                    }}
                />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer outline-none transition-all duration-300"
                    style={{
                        background: "transparent",
                        backdropFilter: "none",
                        WebkitBackdropFilter: "none",
                        border: "1px solid transparent",
                        boxShadow: "none",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(254, 226, 226, 0.8), rgba(254, 202, 202, 0.5))";
                        e.currentTarget.style.backdropFilter = "blur(10px)";
                        (e.currentTarget.style as any).WebkitBackdropFilter = "blur(10px)";
                        e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px 0 rgba(239, 68, 68, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.backdropFilter = "none";
                        (e.currentTarget.style as any).WebkitBackdropFilter = "none";
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}>
                    <div
                        className="p-2 rounded-lg"
                        style={{
                            background: "transparent",
                            border: "none",
                        }}>
                        <LogOut size={18} className="text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-red-600">{t("common:logout")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AvatarDropdown;
