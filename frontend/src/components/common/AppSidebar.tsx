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
import { useAuth } from "@/context/AuthContext"


const items = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: Home,
    roles: ["Admin", "Cashier"],
    items: [

    ]
  },
  {
    title: "Sales",
    url: "/app/pos",
    icon: Calculator,
    isActive: true,
    roles: ["Admin", "Cashier"],
    items: [
      {
        title: "POS",
        url: "/app/pos",
        roles: ["Admin", "Cashier"],
      },
      {
        title: "Returns",
        url: "/app/returns",
        roles: ["Admin", "Cashier"],
      },
    ]
  },
  {
    title: "Inventory",
    url: "/app/inventory",
    icon: PackageSearch,
    roles: ["Admin"],
    isActive: true,
    items: [
      {
        title: "Categories",
        url: "/app/categories",
        roles: ["Admin"],
      },
      {
        title: "Products",
        url: "/app/products",
        roles: ["Admin"],
      },
    ]
  },
  {
    title: "Suppliers",
    url: "/app/suppliers",
    roles: ["Admin"],
    icon: BookUser,
    items: [
      
    ]
  },
  {
    title: "Reports",
    url: "/app/reports",
    icon: ChartNoAxesCombined,
    roles: ["Admin"],
    items: [
      
    ]
  },
  {
    title: "Users",
    url: "/app/users",
    roles: ["Admin"],
    icon: User,
    items: [
      
    ]
  },
  {
    title: "Settings",
    url: "/app/settings",
    icon: Settings,
    roles: ["Admin", "Cashier"],
    items: [
      
    ]
  },
]

export default function AppSidebar() {
   const { user } = useAuth();
   if (!user) return null;

   const filteredItems = items
    .filter(item => item.roles.includes(user.role))
    .map(item => ({
      ...item,
      items: item.items?.filter(sub => sub.roles.includes(user.role)),
    }));

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
              {filteredItems.map((item) =>
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