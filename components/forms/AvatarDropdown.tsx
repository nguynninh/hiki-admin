"use client";

import React from "react";
import { LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import UserModel from "@/models/UserModel";
import { useTranslation } from "react-i18next";

export interface AvatarItem {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    children?: AvatarItem[];
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

    const renderMenuItem = (item: AvatarItem, index: number) => {
        if (item.children && item.children.length > 0) {
            return (
                <DropdownMenuSub key={index}>
                    <DropdownMenuSubTrigger
                        className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer outline-none transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-md group"
                    >
                        <div
                            className="p-2 rounded-lg bg-transparent"
                        >
                            {item.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-white group-hover:translate-x-1 transition-transform">{item.label}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent
                        className="p-2 bg-popover/80 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl"
                        sideOffset={2}
                        alignOffset={-5}
                    >
                        {item.children.map((child, childIndex) => (
                            <DropdownMenuItem
                                key={childIndex}
                                onClick={child.onClick}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer outline-none transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-md group"
                            >
                                <div
                                    className="p-2 rounded-lg bg-transparent">
                                    {child.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:translate-x-1 transition-transform">{child.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            );
        }

        return (
            <DropdownMenuItem
                key={index}
                onClick={item.onClick}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer outline-none transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-md group">
                <div
                    className="p-2 rounded-lg bg-transparent"
                >
                    {item.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-white group-hover:translate-x-1 transition-transform">{item.label}</span>
            </DropdownMenuItem>
        );
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
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{user.firstname + " " + user.lastname}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-300">{user.email}</span>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-64 p-2 gap-3 bg-popover/80 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                sideOffset={5}
            >

                {items && items.map((item, index) => (
                    <React.Fragment key={index}>
                        {renderMenuItem(item, index)}
                        <DropdownMenuSeparator
                            className="bg-white/10 my-1"
                        />
                    </React.Fragment>
                ))}

                <DropdownMenuSeparator
                    className="bg-white/20 my-1"
                />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer outline-none transition-all duration-300 hover:bg-red-500/10 hover:backdrop-blur-md group"
                >
                    <div
                        className="p-2 rounded-lg bg-transparent"
                    >
                        <LogOut size={18} className="text-red-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-sm font-medium text-red-600 group-hover:translate-x-1 transition-transform">{t("common:logout")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AvatarDropdown;
