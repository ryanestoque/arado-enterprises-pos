import PaymentTable from "@/components/pos/PaymentTable";
import POSLeftHeader from "@/components/pos/POSLeftHeader";
import POSRightFooter from "@/components/pos/POSRightFooter";
import { ProductTabs } from "@/components/pos/ProductTabs";
import { SiteHeader } from "@/components/common/SiteHeader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useProduct } from "@/hooks/useAPI";

export default function POS() {
  const { data: products = [], error, isLoading } = useProduct()

  const [sortBy, setSortBy] = useState<"A-Z" | "Z-A" | "price-asc" | "price-desc" | "stock-asc" | "stock-desc">("A-Z")
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<any[]>([])
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

  const handleAddToCart = (productId: number) => {
    // First, update the cart
    setCart((prevCart) => {
      const product = localProducts.find((p) => p.product_id === productId);
      if (!product) return prevCart;

      if (product.stock_quantity == 0) {
        alert("Out of stock!");
        return prevCart;
      }

      const existing = prevCart.find((item) => item.product_id === productId);
      if (existing) {
        return prevCart.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    setLocalProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.product_id === productId
          ? { ...p, stock_quantity: Math.max(0, p.stock_quantity - 1) }
          : p
      )
    );
  };

  const handleQuantityChange = (productId: number, newQty: number) => {
    const currentItem = cart.find((i) => i.product_id === productId);
    if (!currentItem) return;

    const diff = newQty - currentItem.quantity;

    // Update stock
    setLocalProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.product_id === productId
          ? {
              ...p,
              stock_quantity: Math.max(p.stock_quantity - diff, 0),
            }
          : p
      )
    );

    // Update cart
    setCart((prevCart) =>
      prevCart.map((i) =>
        i.product_id === productId ? { ...i, quantity: newQty } : i
      )
    );
  };


  const handleRemoveFromCart = (productId: number) => {
    const removedItem = cart.find((item) => item.product_id === productId);
    if (!removedItem) return;

    setCart((prev) => prev.filter((item) => item.product_id !== productId));

    setLocalProducts((prev) =>
      prev.map((p) =>
        p.product_id === productId
          ? { ...p, stock_quantity: p.original_stock }
          : p
      )
    );
  };

  const handleClearItems = () => {
    // Clear the cart
    setCart([])

    // Reset all product stock quantities to their original values
    setLocalProducts(prev =>
      prev.map(p => ({
        ...p,
        stock_quantity: p.original_stock, // restore the original stock
      }))
    )
  }

  return(
    <>
      <header className="overflow-hidden">
        <SiteHeader title="POS"/>
      </header>
      <main className="h-[100vh] flex-1 flex gap-4 p-4 md:p-6 flex-col lg:flex-row">
        <Card className="max-h-[100vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-7rem)] flex-1 min-w-0 flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-center gap-2">
            <POSLeftHeader 
              sortBy={sortBy} 
              setSortBy={setSortBy}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              />
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <ProductTabs
              localProducts={localProducts}
              onAddToCart={handleAddToCart} 
              searchQuery={searchQuery} 
              sortBy={sortBy} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <Card className="max-h-[90vh] sm:max-h-[100vh] lg:max-h-[calc(100vh-7rem)] flex-[0.6] min-w-0 flex flex-col overflow-hidden">
          <CardHeader>
            <CardTitle  className="text-lg">Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto overflow-x-auto">
            <PaymentTable 
              cart={cart}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveFromCart}
              />
          </CardContent>
          <CardFooter className="mt-4 md:mt-6 flex flex-col gap-4">
            <POSRightFooter 
              cart={cart} 
              userId={1} 
              onCheckoutSuccess={() => setCart([])} 
              removeItems={handleClearItems}/>
          </CardFooter>
        </Card>
      </main>
    </>
  )
}