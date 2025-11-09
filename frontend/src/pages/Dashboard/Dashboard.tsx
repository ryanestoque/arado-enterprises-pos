import { ChartArea } from "@/components/dashboard/ChartArea";
import { SectionCards } from "@/components/dashboard/SectionCards";
import { SiteHeader } from "@/components/common/SiteHeader";
import { columns, type Payment } from "@/components/dashboard/Columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import { DataTable } from "@/components/common/DataTable";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Dashboard() {
  const { data, error, isLoading } = useSWR<Payment[]>("http://localhost:3001/recent_payment", fetcher)

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
              <CardHeader className="pb-2">  
                <CardTitle>
                  <h2 className="font-semibold">Recent Transactions</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={data || []} searchPlaceholder="Filter payment..."/>
              </CardContent>  
            </Card>
          </div>
        </section>
      </main>
    </>
  )
}