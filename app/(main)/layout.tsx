import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/forms/AppSidebar"
import DashboardPage from "@/app/(main)/dashboard/page";

const MainLayout = () => {
    return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <DashboardPage />
      </main>
    </SidebarProvider>
  );
}

export default MainLayout;
