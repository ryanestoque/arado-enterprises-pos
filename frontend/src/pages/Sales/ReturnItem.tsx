import { SiteHeader } from "@/components/common/SiteHeader";
import ReturnItemBtn from "@/components/returnitem/ReturnItemBtn";
import ExchangeBtn from "@/components/returnitem/ReturnItemBtn";
import ReturnItemTable from "@/components/returnitem/ReturnItemTable";
import ExchangeTable from "@/components/returnitem/ReturnItemTable";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useReturnItem } from "@/hooks/useAPI";
import { useEffect, useState } from "react";

export default function ReturnItem() {
    const { data: returnItems = [] } = useReturnItem()
    const [localReturnItems, setLocalReturnItems] = useState<any[]>([])
  
    useEffect(() => {
      setLocalReturnItems(returnItems)
    }, [returnItems])

  return(
    <>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Return</h1>
        </div>
        <div className="flex flex-row mx-4 lg:mx-6 gap-2">
          <ReturnItemBtn />
        </div>
      </header>
      <main className="@container/main w-full h-[80vh] flex-1 p-4 md:p-6">
        <Card className="h-full">
          <CardContent className="px-2 overflow-x-auto max-h-[85vh]">
            <ReturnItemTable data={localReturnItems}/>
          </CardContent>
        </Card>
      </main>
    </>
  )
}