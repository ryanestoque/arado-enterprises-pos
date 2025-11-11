import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ProductForm, { type ProductFormValues } from "./ProductForm";
import { useCategory, useSupplier } from "@/hooks/useAPI";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { Product } from "./Columns";
import { mutate } from "swr";

async function updateProduct(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })

  if (!res.ok) throw new Error("Failed to update product")
  return res.json()
}


export default function InventoryActions({ product }: { product: Product }) {
  const { data: categories = [] } = useCategory()
  const { data: suppliers = [] } = useSupplier()

  const { trigger, isMutating } = useSWRMutation(`http://localhost:5000/api/product/${product.product_id}`, updateProduct)
  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [open, setOpen] = useState(false)

  const handleEditProduct = async (values: ProductFormValues) => {
    try {
      await trigger(values)
      setSuccess(true)
      mutate("http://localhost:5000/api/product")
      setOpen(false)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const { toast } = useToast()
  
  const handleConfirm = async (values: ProductFormValues) => {
    await handleEditProduct(values)

    if (isSuccess) {
      toast({
        title: "Product edited successfully!",
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } else {
      toast({
        title: "Failed to add product",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>      
          <Button size="sm" variant="outline" onClick={() => console.log("Edit", product)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit product</SheetTitle>
            <SheetDescription>This action cannot be undone.</SheetDescription>
          </SheetHeader>
          <ProductForm 
            submitLabel="Save"
            onSubmit={handleConfirm}
            isMutating={isMutating}
            categories={categories}
            suppliers={suppliers}
            defaultValues={product}
            />
          <SheetFooter>
            {/* <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose> */}
          </SheetFooter>
        </SheetContent>
      </Sheet>



      <Button size="sm" variant="destructive" onClick={() => console.log("Delete", product)}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}