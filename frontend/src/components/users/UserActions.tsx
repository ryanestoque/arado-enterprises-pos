import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { User } from "./Columns";
import { mutate } from "swr";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import UserForm, { type UserFormValues } from "./UserForm";

async function updateUser(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
     },
    body: JSON.stringify(arg),
  })

  if (!res.ok) throw new Error("Failed to update user")
  return res.json()
}

async function deleteUser(url: string) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete user")
}


export default function UserActions({ user }: { user: User }) {
  const { trigger: updateTrigger, isMutating: isUpdating } = useSWRMutation(`http://localhost:5000/api/user/${user.user_id}`, updateUser)
  const { trigger: deleteTrigger, isMutating: isDeleting } = useSWRMutation(`http://localhost:5000/api/user/${user.user_id}`, deleteUser)

  const [isSuccess, setSuccess] = useState<boolean>(true);
  const [openSheet, setOpenSheet] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const { toast } = useToast()

  const handleEditUser = async (values: UserFormValues) => {
    try {
      await updateTrigger(values)
      setSuccess(true)
      mutate("http://localhost:5000/api/user")
      setOpenSheet(false)
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const handleConfirm = async (values: UserFormValues) => {
    await handleEditUser(values)

    if (isSuccess) {
      toast({
        title: `User edited successfully!`,
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

  const handleDelete = async () => {
    try {
      await deleteTrigger()
      mutate("http://localhost:5000/api/user")
      toast({
        title: `${user.username} is deleted!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } catch (error) {
      console.error(error)
      toast({
        title: `Failed to delete ${user.username}!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger>      
          <Button size="sm" variant="outline" onClick={() => console.log("Edit", user)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit user</SheetTitle>
            {/* <SheetDescription>This action cannot be undone.</SheetDescription> */}
          </SheetHeader>
          <UserForm 
            submitLabel="Save"
            onSubmit={handleConfirm}
            isMutating={isUpdating}
            defaultValues={{
              ...user,
              password: ""
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

      <ConfirmDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title={`Delete ${user.username} from Users?`}
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