"use client";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppHeader, AppSidebar } from "@/components/forms"
import { useSelector } from "react-redux"
import { SidebarMode } from "@/components/forms/AppSidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<SidebarMode>("collapsed");
    const [windowWidth, setWindowWidth] = useState<number>(0);

    useEffect(() => {
        const updateWidth = () => {
            setWindowWidth(window.innerWidth);
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const user = useSelector((state: any) => state.userReducer.data);
    return (
        <SidebarProvider>
            <AppSidebar
                mode={mode}
                expandedWidth={220}
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
                                ? -150
                                : 0,
                }}
                className="flex-1 transition-all duration-300">
                <div className="w-full my-1 mx-2">
                    <AppHeader user={user}
                        sidebarMode={mode}
                        setSidebarMode={setMode}
                    />
                </div>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}

export default MainLayout;
