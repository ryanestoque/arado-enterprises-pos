import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCategory, useProduct, useSupplier, useUser } from "@/hooks/useAPI";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { Exchange } from "./Columns";
import { mutate } from "swr";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { ExchangeFormValues } from "./ExchangeForm";
import ExchangeForm from "./ExchangeForm";

async function updateExchange(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
     },
    body: JSON.stringify(arg),
  })

  if (!res.ok) throw new Error("Failed to update exchanged item")
  return res.json()
}

async function deleteExchange(url: string) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete exchanged item")
}


export default function ExchangeActions({ exchange }: { exchange: Exchange }) {
  const { data: products = [] } = useProduct()
  const { data: users = [] } = useUser()

  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation(`http://localhost:5000/api/product/${exchange.exchange_id}`, updateExchange)
  const { trigger: deleteTrigger, isMutating: isDeleting } = useSWRMutation(`http://localhost:5000/api/product/${exchange.exchange_id}`, deleteExchange)

  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [openSheet, setOpenSheet] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const { toast } = useToast()

  const handleEditExchange = async (values: ExchangeFormValues) => {
    try {
      await updateTrigger(values)
      setSuccess(true)
      mutate("http://localhost:5000/api/exchange")
      setOpenSheet(false)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const handleConfirm = async (values: ExchangeFormValues) => {
    await handleEditExchange(values)

    if (isSuccess) {
      toast({
        title: `Exchange item edited successfully!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } else {
      toast({
        title: `Failed to edit Exchange ID: ${exchange.exchange_id}!`,
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTrigger()
      mutate("http://localhost:5000/api/product")
      toast({
        title: `Exchange ID: ${exchange.exchange_id} is deleted!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } catch (error) {
      console.error(error)
      toast({
        title: `Failed to delete Exchange ID: ${exchange.exchange_id}!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger>      
          <Button size="sm" variant="outline" onClick={() => console.log("Edit", exchange)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit product</SheetTitle>
            <SheetDescription>This action cannot be undone.</SheetDescription>
          </SheetHeader>
          <ExchangeForm 
            submitLabel="Save"
            onSubmit={handleConfirm}
            isMutating={isUpdating}
            users={users}
            products={products}
            defaultValues={exchange}
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
        title={`Delete Exchange ID: ${exchange.exchange_id} from Exchanges?`}
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