import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "../ui/textarea";

export function DiscountPopover({ cart, discount, setDiscount, discountReason, setDiscountReason }: any) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="flex-1" disabled={cart.length === 0}>Add discount</Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4 m-4">
        <div>
          <Label htmlFor="discount">Discount amount (%)</Label>
          <Input
            id="discount"
            value={discount}
            className="col-span-2 h-8"
            type="number"
            min={0}
            max={100}
            onChange={(e) => {
              if(Number(e.target.value) < 0 || Number(e.target.value) > 100) {
                return
              }
              setDiscount(Number(e.target.value))
            }}
          />
        </div>
        <div>
          <Label htmlFor="discount">Discount reason</Label>
          <Textarea 
            value={discountReason}
            onChange={(e) => {
              setDiscountReason(e.target.value)
            }}
            placeholder="A friend of mine..."/>
        </div>
      </PopoverContent>
    </Popover>
  )
}
