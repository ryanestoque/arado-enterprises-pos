import PaymentTable from "@/components/pos/PaymentTable";
import POSLeftHeader from "@/components/pos/POSLeftHeader";
import POSRightFooter from "@/components/pos/POSRightFooter";
import { ProductTabs } from "@/components/pos/ProductTabs";
import { SiteHeader } from "@/components/common/SiteHeader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function POS() {
  const [sortBy, setSortBy] = 
  useState<
  "A-Z" | "Z-A" | 
  "price-asc" | "price-desc" | 
  "stock-asc" | "stock-desc">("A-Z")
  
  const [searchQuery, setSearchQuery] = useState("")

  return(
    <>
      <header className="overflow-hidden">
        <SiteHeader title="POS"/>
      </header>
      <main className="h-[100vh] flex-1 flex gap-4 p-4 md:p-6 flex-col lg:flex-row">
        <Card className="max-h-[100vh] md:max-h-[calc(100vh-7rem)] flex-1 min-w-0 flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-center gap-2">
            <POSLeftHeader 
              sortBy={sortBy} 
              setSortBy={setSortBy}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              />
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <ProductTabs searchQuery={searchQuery} sortBy={sortBy} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <Card className="max-h-[90vh] md:max-h-[calc(100vh-7rem)] flex-[0.6] min-w-0 flex flex-col overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto overflow-x-auto">
            <PaymentTable />
          </CardContent>
          <CardFooter className="mt-4 md:mt-6 flex flex-col gap-4">
            <POSRightFooter />
          </CardFooter>
        </Card>
      </main>
    </>
  )
}