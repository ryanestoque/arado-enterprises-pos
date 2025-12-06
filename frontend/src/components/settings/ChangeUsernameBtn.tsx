import { Button } from "@/components/ui/button";
import { Sheet, SheetContent,  SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { mutate } from "swr";
import UsernameForm, { type UsernameFormValues } from "./UsernameForm";
import type { User } from "../users/Columns";

async function updateUsername(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
     },
    body: JSON.stringify(arg),
  })

  if (!res.ok) throw new Error("Failed to update username")
  return res.json()
}


export default function ChangeUsernameBtn({ user }: { user: User }) {
  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation(`http://localhost:5000/api/user/change-username/${user.user_id}`, updateUsername)

  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [openSheet, setOpenSheet] = useState(false)

  const { toast } = useToast()

  const handleEditUser = async (values: UsernameFormValues) => {
    try {
      await updateTrigger(values)
      setSuccess(true)
      mutate(`http://localhost:5000/api/user/${user.user_id}`)
      setOpenSheet(false)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const handleConfirm = async (values: UsernameFormValues) => {
    await handleEditUser(values)

    if (isSuccess) {
      toast({
        title: `Username edited successfully!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } else {
      toast({
        title: `Failed to edit ${user.username}!`,
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger>      
          <Button variant="outline" onClick={() => console.log("Edit", user)}>
            Change
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit username</SheetTitle>
            {/* <SheetDescription>This action cannot be undone.</SheetDescription> */}
          </SheetHeader>
          <UsernameForm 
            submitLabel="Save"
            onSubmit={handleConfirm}
            isMutating={isUpdating}
            defaultValues={{ username: user.username }}
            />
          <SheetFooter>
            {/* <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose> */}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}