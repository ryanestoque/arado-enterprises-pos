import useSWRMutation from 'swr/mutation'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '../ui/toast'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '../ui/label'
import { Input } from '../ui/input'

async function postPayment(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to post payment')
  return res.json()
}

export default function CheckoutButton({ cart, userId, onCheckoutSuccess, subtotal, dueAmount, discount, discountReason }: { 
  cart: any[], 
  userId: number,
  onCheckoutSuccess?: () => void,
  subtotal: number,
  dueAmount: number,
  discount: any,
  discountReason: any
  }) {
    
  const [cash, setCash] = useState<number | "">("")
  const change = cash ? cash - dueAmount : 0

  const { trigger, isMutating, data, error } = useSWRMutation("http://localhost:5000/api/payment", postPayment)
  const [isSuccess, setSuccess] = useState<boolean>(true);

  const handleCheckout = async () => {
    const payload = {
      user_id: userId,
      original_total: subtotal,
      discount_amount: discount,
      total_amount: dueAmount,
      payment_method: 'Cash',
      discount_reason: discountReason,
      amount_given: cash,
      change_amount: change,
      items: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }))
    }

    try {
      await trigger(payload)
      setSuccess(true)
      onCheckoutSuccess?.()
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const [open, setOpen] = useState(false);
  const { toast } = useToast()
  
  const handleConfirm = () => {
    handleCheckout();
    setOpen(false);
    setCash("");
    if(isSuccess) {
      toast({
        title: "Payment Successful",
        action: <ToastAction altText='OK' className='p-1'>OK</ToastAction>
      })
    } else {
      toast({
        title: "Payment Failed",
        variant: "destructive",
        action: <ToastAction altText='Try again'>Try again</ToastAction>
      })
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className='flex-1'
            onClick={() => setOpen(true)}
            disabled={isMutating || cart.length === 0}
          >
          {isMutating ? 'Processing...' : 'Proceed to pay'}
        </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Due amount: ₱{dueAmount.toFixed(2)}</DialogTitle>
            <DialogDescription>
              A receipt will be generated afterwards.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Cash Amount
              </Label>
              <Input 
                id="name"
                className="col-span-3"
                type="number"
                min={0}
                value={cash}
                onChange={(e) => setCash(Number(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="change" className="text-sm text-right">Change</Label>
              <p id='change' className="font-semibold text-sm">₱{change.toFixed(2)}</p>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 md:gap-0">
            <DialogClose asChild>
              <Button 
                onClick={() => setCash("")}
                type="button" 
                variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" 
                onClick={handleConfirm} 
                disabled={Number(cash) < dueAmount}>
                  Pay
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  )
}