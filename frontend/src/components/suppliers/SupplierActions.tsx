import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCategory, useSupplier } from "@/hooks/useAPI";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { Supplier } from "./Columns";
import { mutate } from "swr";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { SupplierFormValues } from "./SupplierForm";
import SupplierForm from "./SupplierForm";

async function updateSupplier(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
     },
    body: JSON.stringify(arg),
  })

  if (!res.ok) throw new Error("Failed to update supplier")
  return res.json()
}

async function deleteSupplier(url: string) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete supplier")
}


export default function SupplierActions({ supplier }: { supplier: Supplier }) {
  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation(`http://localhost:5000/api/supplier/${supplier.supplier_id}`, updateSupplier)
  const { trigger: deleteTrigger, isMutating: isDeleting } = useSWRMutation(`http://localhost:5000/api/supplier/${supplier.supplier_id}`, deleteSupplier)

  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [openSheet, setOpenSheet] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const { toast } = useToast()

  const handleEditSupplier = async (values: SupplierFormValues) => {
    try {
      await updateTrigger(values)
      setSuccess(true)
      mutate("http://localhost:5000/api/supplier")
      mutate("http://localhost:5000/api/auditlog")
      setOpenSheet(false)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const handleConfirm = async (values: SupplierFormValues) => {
    await handleEditSupplier(values)

    if (isSuccess) {
      toast({
        title: `Supplier edited successfully!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } else {
      toast({
        title: `Failed to edit ${supplier.name}!`,
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTrigger()
      mutate("http://localhost:5000/api/supplier")
      mutate("http://localhost:5000/api/auditlog")
      toast({
        title: `${supplier.name} is deleted!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } catch (error) {
      console.error(error)
      toast({
        title: `Failed to delete ${supplier.name}!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger>      
          <Button size="sm" variant="outline" onClick={() => console.log("Edit", supplier)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit supplier</SheetTitle>
            {/* <SheetDescription>This action cannot be undone.</SheetDescription> */}
          </SheetHeader>
          <SupplierForm 
            submitLabel="Save"
            onSubmit={handleConfirm}
            isMutating={isUpdating}
            defaultValues={supplier}
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
        title={`Delete ${supplier.name} from Suppliers?`}
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