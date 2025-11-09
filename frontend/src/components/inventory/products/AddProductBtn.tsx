import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddProductBtn() {
  return(
    <Button
      className="mx-4 lg:mx-6"
      size={"sm"}>
      <Plus />
      Add product
    </Button>
  )
}