import { PackageX } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ProductCardsProps {
  localProducts: any[]
  categoryId?: string
  sortBy: "A-Z" | "Z-A" | "price-asc" | "price-desc"| "stock-asc" | "stock-desc"
  searchQuery: string
  onAddToCart?: (product: any) => void;
}

export default function ProductCards({ categoryId, sortBy, searchQuery, onAddToCart, localProducts } : ProductCardsProps) {
  const filtered = categoryId
    ? localProducts?.filter((p) => p.category_id === categoryId)
    : localProducts
  
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

  if(sorted.length === 0) {
    return(
      <div className="flex items-center justify-center h-full gap-4 flex-col col-span-full py-10 text-muted-foreground">
        <PackageX 
          strokeWidth={1}
          width={80}
          height={80}/>
        <p className="text-sm">No products found</p>
      </div>
    )
  }

  return(
    <> 
      {sorted.map((p) => (
        <TooltipProvider key={p.product_id}>
          <Tooltip>
          <TooltipTrigger className="text-left">
            <Card
              onClick={() => onAddToCart?.(p.product_id)} 
              className="cursor-pointer relative active:scale-95 duration-150">
              <CardHeader>
                <Badge variant={p.stock_quantity > 9 ? "inStock" : (p.stock_quantity < 10 && p.stock_quantity > 0 ? "lowStock" : "destructive")} className="text-[0.65rem] truncate absolute top-2 right-2">
                  {p.stock_quantity > 9 ? "In Stock" : (p.stock_quantity < 10 && p.stock_quantity > 0 ? "Low Stock" : "Sold Out")}
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
                <p className="text-xs xl:text-sm text-muted-foreground mt-2 truncate">{p.stock_quantity} items left</p>
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