import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import CategoryForm, { type CategoryFormValues } from "./CategoryForm";
import { API_BASE } from "@/hooks/useAPI";

async function postCategory(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("token")}`, },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to add category')
  return res.json()
}

export default function AddCategoryBtn() {
  const { trigger, isMutating } = useSWRMutation(`${API_BASE}/api/category`, postCategory)
  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [open, setOpen] = useState(false)

  const handleAddCategory = async (values: CategoryFormValues) => {
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
    
    const handleConfirm = async (values: CategoryFormValues) => {
      await handleAddCategory(values)
  
      if (isSuccess) {
        toast({
          title: "Category added successfully!",
          action: <ToastAction altText="OK">OK</ToastAction>
        })
      } else {
        toast({
          title: "Failed to add category",
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>
        })
      }
    }

  return(
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>      
        <Button
          className="mx-4 lg:mx-6"
          size={"sm"}>
          <Plus />
          Add category
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add category</SheetTitle>
          {/* <SheetDescription>This action cannot be undone.</SheetDescription> */}
        </SheetHeader>
        <CategoryForm
          submitLabel="Add"
          onSubmit={handleConfirm}
          isMutating={isMutating}
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