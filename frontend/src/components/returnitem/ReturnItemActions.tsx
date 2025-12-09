import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { API_BASE, useProduct, useUser } from "@/hooks/useAPI";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { ReturnItem } from "./Columns";
import { mutate } from "swr";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { ReturnItemFormValues } from "./ReturnItemForm";
import ReturnForm from "./ReturnItemForm";

async function updateReturnItem(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
     },
    body: JSON.stringify(arg),
  })

  if (!res.ok) throw new Error("Failed to update returned item")
  return res.json()
}

async function deleteReturnItem(url: string) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete returned item")
}


export default function ReturnItemActions({ returnItem }: { returnItem: ReturnItem }) {
  const { data: products = [] } = useProduct()
  const { data: users = [] } = useUser()

  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation(`${API_BASE}/api/return/${returnItem.return_id}`, updateReturnItem)
  const { trigger: deleteTrigger, isMutating: isDeleting } = useSWRMutation(`${API_BASE}/api/return/${returnItem.return_id}`, deleteReturnItem)

  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [openSheet, setOpenSheet] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const { toast } = useToast()

  const handleEditReturn = async (values: ReturnItemFormValues) => {
    try {
      await updateTrigger(values)
      setSuccess(true)
      mutate(`${API_BASE}/api/return`)
      setOpenSheet(false)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const handleConfirm = async (values: ReturnItemFormValues) => {
    await handleEditReturn(values)

    if (isSuccess) {
      toast({
        title: `Return item edited successfully!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } else {
      toast({
        title: `Failed to edit Return ID: ${returnItem.return_id}!`,
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTrigger()
      mutate(`${API_BASE}/api/return`)
      toast({
        title: `Return ID: ${returnItem.return_id} is deleted!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } catch (error) {
      console.error(error)
      toast({
        title: `Failed to delete Return ID: ${returnItem.return_id}!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger>      
          <Button size="sm" variant="outline" onClick={() => console.log("Edit", returnItem)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Return</SheetTitle>
            {/* <SheetDescription>This action cannot be undone.</SheetDescription> */}
          </SheetHeader>
          <ReturnForm 
            submitLabel="Save"
            onSubmit={handleConfirm}
            isMutating={isUpdating}
            users={users}
            products={products}
            defaultValues={returnItem}
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
        title={`Delete Return ID: ${returnItem.return_id} from ReturnItems?`}
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