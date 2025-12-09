import { ChartArea } from "@/components/dashboard/ChartArea";
import { SectionCards } from "@/components/dashboard/SectionCards";
import { SiteHeader } from "@/components/common/SiteHeader";
import { columns, type Payment } from "@/components/dashboard/Columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/common/DataTable";
import { usePayment } from "@/hooks/useAPI";
import { useEffect, useState } from "react";


export default function Dashboard() {
  const { data: payments = [] } = usePayment()
  const [localPayments, setLocalPayments] = useState<any[]>([])

  useEffect(() => {
    setLocalPayments(payments)
  }, [payments])

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  return(
    <>
      <header>
        <SiteHeader title="Dashboard"/>
      </header>
      <main className="flex flex-1 flex-col">
        <section className="@container/main w-full flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              {/* <ChartArea payments={localPayments}/> */}
            </div>
            <Card className="mx-4 lg:mx-6">
              <CardHeader className="pb-2">  
                <CardTitle>
                  <h2 className="font-semibold">Recent Transactions</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[80vh]">
                <DataTable 
                  columns={columns} 
                  data={localPayments} 
                  searchPlaceholder="Filter by cashier name..." 
                  columnToFilter="username"
                  
                  />
              </CardContent>  
            </Card>
          </div>
        </section>
      </main>
    </>
  )
}