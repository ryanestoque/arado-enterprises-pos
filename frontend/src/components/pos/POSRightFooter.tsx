import { useState } from "react";
import { Button } from "../ui/button";
import CheckoutButton from "./CheckoutButton";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { DiscountPopover } from "./DiscountPopover";
import { formatMoney } from "../dashboard/SectionCards";

interface POSRightFooterProps {
  cart: any[];
  userId: number;
  removeItems: () => void
  onCheckoutSuccess?: () => void
}

export default function POSRightFooter( { cart, userId, onCheckoutSuccess, removeItems }: POSRightFooterProps) {
  const [open, setOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountReason, setDiscountReason] = useState("");

  const handleClearDiscount = () => {
    setDiscount(0);
    setDiscountReason("");
  };

  const handleConfirm = () => {
    removeItems();
    setDiscount(0)
    setDiscountReason("")
    setOpen(false)
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const vatRate = 0.00;
  const vat = subtotal * vatRate;
  const dueAmount = (subtotal + vat) * (1 - (discount / 100));

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
          <p className="text-sm font-medium">₱{ formatMoney(subtotal) }</p>
          <p className="text-sm font-medium">{ discount }%</p>
          <p className="text-sm font-medium">₱{ formatMoney(vat) }</p>
          <p className="mt-2 text-lg font-semibold">₱{ formatMoney(dueAmount) }</p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap w-full justify-center items-center mt-2">
        <Button 
          className="flex-1" 
          variant="destructive"
          disabled={cart.length === 0}
          onClick={() => setOpen(true)}
          >Clear items</Button>

        <DiscountPopover 
          discount={discount}
          setDiscount={setDiscount}
          discountReason={discountReason}
          setDiscountReason={setDiscountReason}
          cart={cart}/>

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
          dueAmount={dueAmount}
          subtotal={subtotal}
          cart={cart} 
          userId={userId}
          onCheckoutSuccess={() => {
            onCheckoutSuccess?.();
            handleClearDiscount(); // ⬅ reset here after checkout
          }}
          discount={discount}
          discountReason={discountReason}
          />
      </div>
    </>
  )
}