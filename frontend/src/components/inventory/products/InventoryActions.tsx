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
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

async function updateProduct(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
     },
    body: JSON.stringify(arg),
  })

  if (!res.ok) throw new Error("Failed to update product")
  return res.json()
}

async function deleteProduct(url: string) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete product")
}


export default function InventoryActions({ product }: { product: Product }) {
  const { data: categories = [] } = useCategory()
  const { data: suppliers = [] } = useSupplier()

  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation(`http://localhost:5000/api/product/${product.product_id}`, updateProduct)
  const { trigger: deleteTrigger, isMutating: isDeleting } = useSWRMutation(`http://localhost:5000/api/product/${product.product_id}`, deleteProduct)

  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [openSheet, setOpenSheet] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const { toast } = useToast()

  const handleEditProduct = async (values: ProductFormValues) => {
    try {
      await updateTrigger(values)
      setSuccess(true)
      mutate("http://localhost:5000/api/product")
      mutate("http://localhost:5000/api/auditlog")
      setOpenSheet(false)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const handleConfirm = async (values: ProductFormValues) => {
    await handleEditProduct(values)

    if (isSuccess) {
      toast({
        title: `Product edited successfully!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } else {
      toast({
        title: `Failed to edit ${product.name}!`,
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTrigger()
      mutate("http://localhost:5000/api/product")
      mutate("http://localhost:5000/api/auditlog")
      toast({
        title: `${product.name} is deleted!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } catch (error) {
      console.error(error)
      toast({
        title: `Failed to delete ${product.name}!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger>      
          <Button size="sm" variant="outline" onClick={() => console.log("Edit", product)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit product</SheetTitle>
            {/* <SheetDescription>This action cannot be undone.</SheetDescription> */}
          </SheetHeader>
          <ProductForm 
            submitLabel="Save"
            onSubmit={handleConfirm}
            isMutating={isUpdating}
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

      <ConfirmDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title={`Delete ${product.name} from Inventory?`}
        description="This cannot be undone"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setOpenDialog(false)}
      />

      <Button size="sm" variant="destructive" onClick={() => setOpenDialog(true)} disabled={isDeleting}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}