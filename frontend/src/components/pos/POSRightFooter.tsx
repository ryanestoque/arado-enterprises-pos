import { useState } from "react";
import { Button } from "../ui/button";
import CheckoutButton from "./CheckoutButton";
import { ConfirmDialog } from "../common/ConfirmDialog";

interface POSRightFooterProps {
  cart: any[];
  userId: number;
  removeItems: () => void
  onCheckoutSuccess?: () => void
}

export default function POSRightFooter( { cart, userId, onCheckoutSuccess, removeItems }: POSRightFooterProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    removeItems();
    setOpen(false)
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discount = 0.00;
  const vatRate = 0.00;
  const vat = subtotal * vatRate;
  const dueAmount = subtotal - discount + vat;

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
          <p className="text-sm font-medium">₱{ subtotal.toFixed(2) }</p>
          <p className="text-sm font-medium">₱{ discount.toFixed(2) }</p>
          <p className="text-sm font-medium">₱{ vat.toFixed(2) }</p>
          <p className="mt-2 text-lg font-semibold">₱{ dueAmount.toFixed(2) }</p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap w-full justify-center items-center mt-2">
        <Button 
          className="flex-1" 
          variant="destructive"
          disabled={cart.length === 0}
          onClick={() => setOpen(true)}
          >Clear items</Button>

        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Clear all items?"
          description="This will remove all items from your cart."
          confirmText="Clear"
          cancelText="Cancel"
          onConfirm={handleConfirm}
          onCancel={() => setOpen(false)}
        />
        
        <CheckoutButton 
          cart={cart} 
          userId={userId}
          onCheckoutSuccess={onCheckoutSuccess}
          />
      </div>
    </>
  )
}