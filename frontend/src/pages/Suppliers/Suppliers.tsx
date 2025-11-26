import AddSupplierBtn from "@/components/suppliers/AddSupplierBtn";
import SupplierTable from "@/components/suppliers/SupplierTable";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSupplier } from "@/hooks/useAPI";
import { useEffect, useState } from "react";

export default function Suppliers() {
  const { data: suppliers = [] } = useSupplier()
  const [localSuppliers, setLocalSuppliers] = useState<any[]>([])

  useEffect(() => {
    setLocalSuppliers(suppliers)
  }, [suppliers])

  return(
    <>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Suppliers</h1>
        </div>
          <AddSupplierBtn 
            />
      </header>
      <main className="h-[80vh] flex-1 p-4 md:p-6">
        <Card className="h-full">
          <CardContent className="px-2 overflow-x-auto">
            <SupplierTable
              data={localSuppliers} />
          </CardContent>
        </Card>
      </main>
    </>
  )
}