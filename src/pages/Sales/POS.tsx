import PaymentTable from "@/components/common/PaymentTable";
import { ProductTabs } from "@/components/common/ProductTabs";
import { SiteHeader } from "@/components/common/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function POS() {
  return(
    <>
      <header>
        <SiteHeader title="POS"/>
      </header>
      <main className="h-[100vh] flex-1 flex gap-4 p-4 md:p-6 flex-col lg:flex-row">
        <Card className="max-h-[100vh] md:max-h-[calc(100vh-7rem)] flex-1 min-w-0 flex flex-col">
          <CardHeader className="relative">
            <Search className="absolute mt-1 left-8 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input type="search" placeholder="Browse products" className="pl-8"/>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <ProductTabs />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <Card className="max-h-[90vh] md:max-h-[calc(100vh-7rem)] flex-[0.6] min-w-0 flex flex-col ">
          <CardHeader>
            <CardTitle className="text-lg">Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto overflow-x-auto">
            <PaymentTable />
          </CardContent>
          <CardFooter className="mt-4 md:mt-6 flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col gap-2">
                <p className="text-sm">Subtotal</p>
                <p className="text-sm">Discount</p>
                <p className="text-sm">VAT&nbsp;(12%)</p>
                <p className="mt-2 text-lg font-medium">Total</p>
              </div>
              <div className="flex flex-col text-end gap-2">
                <p className="text-sm font-medium">₱250.00</p>
                <p className="text-sm font-medium">₱0.00</p>
                <p className="text-sm font-medium">₱0.00</p>
                <p className="mt-2 text-lg font-semibold">₱250.00</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap w-full justify-center items-center mt-2">
              <Button className="flex-1" variant="destructive">Clear items</Button>
              <Button className="flex-1">Proceed to pay</Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </>
  )
}