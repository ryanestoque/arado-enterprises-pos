import useSWRMutation from 'swr/mutation'
import { Button } from '../ui/button'
import { useState } from 'react'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '../ui/toast'

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
    setOpen(false)
    if(isSuccess) {
      toast({
        title: "Payment Successful",
        action: <ToastAction altText='OK'>OK</ToastAction>
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
      <Button
        className='flex-1'
        onClick={() => setOpen(true)}
        disabled={isMutating || cart.length === 0}
      >
        {isMutating ? 'Processing...' : 'Proceed to pay'}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Proceed to pay?"
        description="A receipt will be generated afterwards."
        confirmText="Proceed"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}