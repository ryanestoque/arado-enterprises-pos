import { ChevronDown, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TableCell, TableRow } from "../ui/table";

export default function PaymentItemEditor() {
  return(
    <TableRow>
      <TableCell className="bg-muted p-4">
        <div className="flex justify-evenly items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" min={1} defaultValue={1}/>
          </div>
          <div className="flex items-center gap-2" >
            <Label htmlFor="discount">Discount&nbsp;(%)</Label>
            <Input id="discount" type="number" min={0} defaultValue={0}/>
          </div>
          <Button variant="destructive" size={"sm"}>
            <Trash2 />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}