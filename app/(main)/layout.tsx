"use client";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppHeader, AppSidebar } from "@/components/forms"
import { useSelector } from "react-redux"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const user = useSelector((state: any) => state.userReducer.data);
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <AppHeader user={user} />
                {children}
            </main>
        </SidebarProvider>
    );
}

export default MainLayout;
