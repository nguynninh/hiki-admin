"use client";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppHeader, AppSidebar } from "@/components/forms"
import { useSelector } from "react-redux"
import { MenuItem, SidebarMode } from "@/components/forms/AppSidebar";
import { BookHeart, Gauge, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Monitor, Layer, TaskSquare } from "iconsax-reactjs";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<SidebarMode>("collapsed");
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const { t } = useTranslation();

    useEffect(() => {
        const updateWidth = () => {
            setWindowWidth(window.innerWidth);
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const menu: MenuItem[] = [
        {
            icon: <Gauge size={22} />,
            label: t("common:dashboard"),
            href: "/dashboard",
        },
        {
            icon: <Users size={22} />,
            label: t("common:users"),
            href: "/users",
            children: [
                {
                    icon: <Users size={22} />,
                    label: t("common:users_list"),
                    href: "/users/list",
                },
                {
                    icon: <Users size={22} />,
                    label: t("common:users_create"),
                    href: "/users/create",
                },
                {
                    icon: <Users size={22} />,
                    label: t("common:users_avatar-default"),
                    href: "/users/avatar-default",
                },
                {
                    icon: <Users size={22} />,
                    label: t("user:seller_requests", { defaultValue: "Seller Requests" }),
                    href: "/users/seller-requests",
                }
            ]
        },
        {
            icon: <Monitor size={22} />,
            label: t("common:products", { defaultValue: "Products" }),
            href: "/products",
        },
        {
            icon: <Layer size={22} />,
            label: t("common:categories", { defaultValue: "Categories" }),
            href: "/categories",
        },
        {
            icon: <BookHeart size={22} />,
            label: t("common:banners"),
            href: "/banners",
        }
    ];

    const user = useSelector((state: any) => state.userReducer.data);
    return (
        <SidebarProvider>
            <AppSidebar
                mode={mode}
                menu={menu}
                expandedWidth={250}
                collapsedWidth={70}
                enableHover={true}
                setMode={(mode: SidebarMode) => {
                    setMode(mode);
                }}
            />
            <SidebarInset
                style={{
                    marginLeft:
                        windowWidth <= 672
                            ? 5
                            : mode === "collapsed"
                                ? -155
                                : 30,
                }}
                className="flex-1 transition-all duration-300">
                <div className="w-full my-2">
                    <div className="m-2">
                        <AppHeader
                            user={user}
                            sidebarMode={mode}
                            setSidebarMode={setMode}
                        />
                    </div>
                    <div className="m-2">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default MainLayout;
