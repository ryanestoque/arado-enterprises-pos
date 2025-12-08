import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import UserForm, { type UserFormValues } from "./UserForm";

async function postUser(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("token")}`, },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to add user')
  return res.json()
}

export default function AddUserBtn() {

  const { trigger, isMutating } = useSWRMutation("http://localhost:5000/api/user", postUser)
  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [open, setOpen] = useState(false)

  const handleAddUser = async (values: UserFormValues) => {
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
  
  const handleConfirm = async (values: UserFormValues) => {
    await handleAddUser(values)

    if (isSuccess) {
      toast({
        title: "User added successfully!",
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } else {
      toast({
        title: "Failed to add user",
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
          Add user
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add user</SheetTitle>
          {/* <SheetDescription>This action cannot be undone.</SheetDescription> */}
        </SheetHeader>
        <UserForm 
          schemaType="create"
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