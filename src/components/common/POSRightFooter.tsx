import { Button } from "../ui/button";

export default function POSRightFooter() {
  return(
    <>
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-2">
          <p className="text-sm">Subtotal</p>
          <p className="text-sm">Discount</p>
          <p className="text-sm">VAT&nbsp;(12%)</p>
          <p className="mt-2 text-lg font-medium">Due amount</p>
        </div>
        <div className="flex flex-col text-end gap-2">
          <p className="text-sm font-medium">₱250.00</p>
          <p className="text-sm font-medium">₱0.00</p>
          <p className="text-sm font-medium">₱0.00</p>
          <p className="mt-2 text-lg font-semibold">₱250.00</p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap w-full justify-center items-center mt-2">
        <Button className="flex-1" variant="destructive">Clear items</Button>
        <Button className="flex-1">Proceed to pay</Button>
      </div>
    </>
  )
}