import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useProduct, useSupplier, useUser } from "@/hooks/useAPI";import type { ReturnItemFormValues } from "./ReturnItemForm";
import ReturnForm from "./ReturnItemForm";
;

async function postReturnItem(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("token")}`, },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to stockin')
  return res.json()
}

export default function ReturnItemBtn() {
  const { data: users = [] } = useUser()
  const { data: products = [] } = useProduct()

  const { trigger, isMutating } = useSWRMutation("http://localhost:5000/api/return", postReturnItem)
  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [open, setOpen] = useState(false)

  const handleReturnItem = async (values: ReturnItemFormValues) => {
    try {
      await trigger(values)
      setSuccess(true)
      setOpen(false)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const { toast } = useToast()
  
  const handleConfirm = async (values: ReturnItemFormValues) => {
    await handleReturnItem(values)

    if (isSuccess) {
      toast({
        title: "Return successful!",
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } else {
      toast({
        title: "Failed to return item",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      })
    }
  }

  return(
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>      
        <Button
          size={"sm"}
          >
          <Plus />
          Return Item
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Return Item</SheetTitle>
          {/* <SheetDescription>This action cannot be undone.</SheetDescription> */}
        </SheetHeader>
        <ReturnForm
          submitLabel="Return"
          onSubmit={handleConfirm}
          isMutating={isMutating}
          products={products}
          users={users}
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
