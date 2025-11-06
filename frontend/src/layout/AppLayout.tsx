import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/common/AppSidebar";
import { Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster";

export default function AppLayout() {
  return(
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  )
}