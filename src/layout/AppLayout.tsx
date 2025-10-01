import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/common/AppSidebar";
import { Outlet } from "react-router-dom"

export default function AppLayout() {
  return(
    <SidebarProvider>
      <AppSidebar />
        <SidebarInset>
          <main>
            <Outlet />
          </main>
        </SidebarInset>
    </SidebarProvider>
  )
}