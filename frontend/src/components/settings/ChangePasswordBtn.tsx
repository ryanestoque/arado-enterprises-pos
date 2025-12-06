import { Button } from "@/components/ui/button";
import { Sheet, SheetContent,  SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { mutate } from "swr";
import type { User } from "../users/Columns";
import PasswordForm, { type PasswordFormValues } from "./PasswordForm";

async function updatePassword(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
     },
    body: JSON.stringify(arg),
  })

  if (!res.ok) throw new Error("Failed to update password")
  return res.json()
}


export default function ChangePasswordBtn({ user }: { user: User }) {
  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation(`http://localhost:5000/api/user/change-password/${user.user_id}`, updatePassword)

  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [openSheet, setOpenSheet] = useState(false)

  const { toast } = useToast()

  const handleEditPassword = async (values: PasswordFormValues) => {
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

  const handleConfirm = async (values: PasswordFormValues) => {
    await handleEditPassword(values)

    if (isSuccess) {
      toast({
        title: `Password updated successfully!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } else {
      toast({
        title: `Failed to update password!`,
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
            <SheetTitle>Edit password</SheetTitle>
            {/* <SheetDescription>This action cannot be undone.</SheetDescription> */}
          </SheetHeader>
          <PasswordForm 
            submitLabel="Save"
            onSubmit={handleConfirm}
            isMutating={isUpdating}
            defaultValues={{
              oldPassword: "",
              newPassword: "",
              confirmPassword: ""
            }}
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