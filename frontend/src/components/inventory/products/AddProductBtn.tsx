import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import ProductForm, { type ProductFormValues } from "./ProductForm";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useCategory, useSupplier } from "@/hooks/useAPI";

async function postProduct(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to add product')
  return res.json()
}


export default function AddProductBtn() {
  const { data: categories = [] } = useCategory()
  const { data: suppliers = [] } = useSupplier()

  const { trigger, isMutating } = useSWRMutation("http://localhost:5000/api/product", postProduct)
  const [isSuccess, setSuccess] = useState<boolean>(true);

  const handleAddProduct = async (values: ProductFormValues) => {
    try {
      await trigger(values)
      setSuccess(true)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const { toast } = useToast()
  
  const handleConfirm = async (values: ProductFormValues) => {
    await handleAddProduct(values)

    if (isSuccess) {
      toast({
        title: "Product added successfully!",
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

  return(
    <Sheet>
      <SheetTrigger>      
        <Button
          className="mx-4 lg:mx-6"
          size={"sm"}>
          <Plus />
          Add product
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add product</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
        <ProductForm 
          submitLabel="Add"
          onSubmit={handleConfirm}
          isMutating={isMutating}
          categories={categories}
          suppliers={suppliers}
          />
        <SheetFooter>
          {/* <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>

  )
}