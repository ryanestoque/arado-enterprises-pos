import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AddUserBtn from "@/components/users/AddUserBtn";
import UserTable from "@/components/users/UserTable";
import { useUser } from "@/hooks/useAPI";
import { useEffect, useState } from "react";

export default function Users() {
  const { data: users = [] } = useUser()
  const [localUsers, setLocalUsers] = useState<any[]>([])

  useEffect(() => {
    setLocalUsers(users)
  }, [users])

  return(
    <>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Users</h1>
        </div>
          <AddUserBtn 
            />
      </header>
      <main className="@container/main w-full h-[80vh] flex-1 p-4 md:p-6">
        <Card className="h-full">
          <CardContent className="px-2 overflow-x-auto max-h-[85vh]">
            <UserTable
              data={localUsers} />
          </CardContent>
        </Card>
      </main>
    </>
  )
}