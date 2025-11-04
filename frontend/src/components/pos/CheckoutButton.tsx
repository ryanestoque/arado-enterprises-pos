import useSWRMutation from 'swr/mutation'
import { Button } from '../ui/button'
import { useState } from 'react'
import { ConfirmDialog } from '../common/ConfirmDialog'

async function postPayment(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to post payment')
  return res.json()
}

export default function CheckoutButton({ cart, userId, onCheckoutSuccess }: { 
  cart: any[], 
  userId: number,
  onCheckoutSuccess?: () => void 
  }) {

  const { trigger, isMutating, data, error } = useSWRMutation("http://localhost:5000/api/payment", postPayment)

  const handleCheckout = async () => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const payload = {
      user_id: userId,
      original_total: total,
      discount_amount: 0,
      total_amount: total,
      payment_method: 'Cash',
      discount_reason: '',
      items: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }))
    }

    try {
      await trigger(payload)
      // alert("Payment successful!")
      onCheckoutSuccess?.()
    } catch (error) {
      console.error(error)
      // alert("Payment failed. Please try again.")
    }
  }

  const [open, setOpen] = useState(false);
  
  const handleConfirm = () => {
    handleCheckout();
    setOpen(false)
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