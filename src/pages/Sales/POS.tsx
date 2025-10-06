import { ProductTabs } from "@/components/common/ProductTabs";
import { SiteHeader } from "@/components/common/SiteHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function POS() {
  return(
    <>
      <header>
        <SiteHeader title="POS"/>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:p-6">
        <Card className="@container flex-1">
          <CardHeader className="relative">
            <Search className="absolute mt-1 left-8 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input type="search" placeholder="Browse products" className="pl-8"/>
          </CardHeader>
          <CardContent>
            <ProductTabs />
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>

          </CardHeader>
          <CardContent>
            
          </CardContent>
        </Card>
      </main>
    </>
  )
}