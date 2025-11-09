import { SiteHeader } from "@/components/common/SiteHeader";
import ProductsTable from "@/components/inventory/products/ProductsTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProduct } from "@/hooks/useAPI";
import { useEffect, useState } from "react";

export default function Products() {
  const { data: products = [], error, isLoading } = useProduct()
  const [localProducts, setLocalProducts] = useState<any[]>([])

  useEffect(() => {
    if (products.length > 0) {
      const withOriginalStock = products.map(p => ({
      ...p,
      original_stock: p.stock_quantity,
    }))
    setLocalProducts(withOriginalStock)
    }
  }, [products])

  return(
    <>
      <header className="overflow-hidden">
        <SiteHeader title="Products"/>
      </header>
      <main className="h-[80vh] flex-1 p-4 md:p-6">
        <Card className="h-full">
          <CardContent className="px-2 overflow-x-auto">
            <ProductsTable data={localProducts} />
          </CardContent>
        </Card>
      </main>
    </>
  )
}