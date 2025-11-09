import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function InventoryActions(product : any) {
  return (
    <div className="flex gap-2">
      <Drawer>
        <DrawerTrigger>      
          <Button size="sm" variant="outline" onClick={() => console.log("Edit", product)}>
            <Pencil className="w-4 h-4" />
          </Button></DrawerTrigger>
        <DrawerContent className="flex justify-center items-center w-full">
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Button size="sm" variant="destructive" onClick={() => console.log("Delete", product)}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}