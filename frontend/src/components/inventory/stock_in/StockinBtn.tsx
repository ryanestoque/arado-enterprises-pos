import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useProduct, useSupplier, useUser } from "@/hooks/useAPI";
import type { StockinFormValues } from "./StockinForm";
import StockinForm from "./StockinForm";
import { mutate } from "swr";

async function postStockin(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("token")}`, },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to stockin')
  return res.json()
}

export default function StockinBtn() {
  const { data: users = [] } = useUser()
  const { data: suppliers = [] } = useSupplier()
  const { data: products = [] } = useProduct()

  const { trigger, isMutating } = useSWRMutation("http://localhost:5000/api/stockin", postStockin)
  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [open, setOpen] = useState(false)

  const handleStockin = async (values: StockinFormValues) => {
    try {
      await trigger(values)
      setSuccess(true)
      setOpen(false)
      mutate("http://localhost:5000/api/product")
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const { toast } = useToast()
  
  const handleConfirm = async (values: StockinFormValues) => {
    await handleStockin(values)

    if (isSuccess) {
      toast({
        title: "Stock in successfully!",
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } else {
      toast({
        title: "Failed to stockin",
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
          variant={"secondary"}
          >
          <Plus />
          Stock in
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add product</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
        <StockinForm 
          submitLabel="Add"
          onSubmit={handleConfirm}
          isMutating={isMutating}
          products={products}
          users={users}
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
