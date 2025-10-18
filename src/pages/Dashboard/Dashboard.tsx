import { ChartArea } from "@/components/common/ChartArea";
import { DataTable } from "@/components/common/DataTable";
import { SectionCards } from "@/components/common/SectionCards";
import { SiteHeader } from "@/components/common/SiteHeader";
import { columns } from "@/components/common/Columns";
import type { Payment } from "@/components/common/Columns"
import data from "../../data/recent_payments.json"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const payments = data as Payment[]

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
              <ChartArea/>
            </div>
            <Card className="mx-4 lg:mx-6">
              <CardHeader>  
                <CardTitle>
                  <h2 className="font-semibold">Recent Transactions</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={payments} />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  )
}