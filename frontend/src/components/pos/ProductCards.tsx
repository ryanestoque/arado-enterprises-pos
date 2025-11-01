import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useProduct } from '@/hooks/useMockAPI'

interface ProductCardsProps {
  categoryId?: string
  sortBy: "A-Z" | "Z-A" | "price-asc" | "price-desc"| "stock-asc" | "stock-desc"
  searchQuery: string
}

export default function ProductCards({ categoryId, sortBy, searchQuery } : ProductCardsProps) {
  const { data: products = [], error, isLoading } = useProduct()

  const filtered = categoryId
    ? products?.filter((p) => p.category_id === categoryId)
    : products
  
  const searched = filtered?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sorted = [...searched].sort((a, b) => {
    switch (sortBy) {
      case "A-Z":
        return a.name.localeCompare(b.name)
      case "Z-A":
        return b.name.localeCompare(a.name)
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "stock-asc":
        return a.stock_quantity - b.stock_quantity
      case "stock-desc":
        return b.stock_quantity - a.stock_quantity
      default:
        return 0
    }
  })

  return(
    <>
      {sorted.map((p) => (
        <TooltipProvider key={p.product_id}>
          <Tooltip>
          <TooltipTrigger className="text-left">
            <Card className="cursor-pointer relative">
              <CardHeader>
                <Badge variant={p.stock_quantity > 9 ? "inStock" : (p.stock_quantity < 9 && p.stock_quantity > 0 ? "lowStock" : "destructive")} className="text-[0.65rem] truncate absolute top-2 right-2">
                  {p.stock_quantity > 9 ? "In Stock" : (p.stock_quantity < 9 && p.stock_quantity > 0 ? "Low Stock" : "Sold Out")}
                </Badge>
                <div className="flex justify-center items-center aspect-square pt-2">
                  <img 
                    src="/hammer.webp" 
                    alt="Hammer" 
                    className="p-1 w-full h-full object-contain" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-regular text-sm xl:text-base truncate">{p.name}</p>
                <p className="font-bold text-lg xl:text-xl truncate mt-[1px] xl:mt-0.5">₱{p.price}</p>
                <p className="text-xs xl:text-sm text-muted-foreground mt-2">{p.stock_quantity} items left</p>
              </CardContent>
            </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-mono">SKU: {p.sku}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </>
  )
}