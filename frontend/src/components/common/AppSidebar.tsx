import { Link } from "react-router-dom"
import { BookUser, Calculator, ChartNoAxesCombined, Home, PackageSearch, Settings, Hammer, User, ChevronRight } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"


const items = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: Home,
    items: [

    ]
  },
  {
    title: "Sales",
    url: "/app/pos",
    icon: Calculator,
    isActive: true,
    items: [
      {
        title: "POS",
        url: "/app/pos",
      },
      {
        title: "Returns",
        url: "/app/returns"
      },
    ]
  },
  {
    title: "Inventory",
    url: "/app/inventory",
    icon: PackageSearch,
    isActive: true,
    items: [
      {
        title: "Categories",
        url: "/app/categories",
      },
      {
        title: "Products",
        url: "/app/products"
      },
    ]
  },
  {
    title: "Suppliers",
    url: "#",
    icon: BookUser,
    items: [
      
    ]
  },
  {
    title: "Reports",
    url: "#",
    icon: ChartNoAxesCombined,
    items: [
      
    ]
  },
  {
    title: "Users",
    url: "#",
    icon: User,
    items: [
      
    ]
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      
    ]
  },
]

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Hammer />
              <Link to={"/app/dashboard"}>
                <span className="text-base font-semibold tracking-tight">
                  Arado Enterprises
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {items.map((item) =>
                item.items.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link to={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}