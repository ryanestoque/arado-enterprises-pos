import useSWRMutation from 'swr/mutation'
import { Button } from '../ui/button'
import { useRef, useState } from 'react'
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
import { API_BASE, usePaymentById } from '@/hooks/useAPI'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatMoney } from '../dashboard/SectionCards'

async function postPayment(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    
    },
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

  const { trigger, isMutating, data, error } = useSWRMutation(`${API_BASE}/api/payment`, postPayment)
  const [isSuccess, setSuccess] = useState<boolean>(true);

  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const { data: payment,  } = usePaymentById(paymentId);

  const receiptRef = useRef<HTMLDivElement>(null);

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
      const result = await trigger(payload)
      if (result && result.payment_id) {
        setPaymentId(result.payment_id) 
      }

      setSuccess(true)
      onCheckoutSuccess?.()

      setIsReceiptOpen(true);
    } catch (error) {
      console.error(error)
      setSuccess(false)
    }
  }

  const { toast } = useToast()
  
  const handleConfirm = () => {
    handleCheckout();
    // if(isSuccess) {
    //   toast({
    //     title: "Payment Successful",
    //     description: "Printing receipt...",
    //     action: <ToastAction altText='OK' className='p-4'>OK</ToastAction>
    //   })
    // } else {
    if(!isSuccess) {
      toast({
        title: "Payment Failed",
        variant: "destructive",
        action: <ToastAction altText='Try again'>Try again</ToastAction>
      })
    }
  }

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2, // higher quality
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("receipt.pdf");
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className='flex-1'
            disabled={isMutating || cart.length === 0}
            onClick={() => setCash("")}
          >
          {isMutating ? 'Processing...' : 'Proceed to pay'}
        </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Due amount: ₱{formatMoney(dueAmount)}</DialogTitle>
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
                value={undefined}
                autoComplete="off"
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
                type="button" 
                variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button 
                type="submit" 
                onClick={handleConfirm} 
                disabled={Number(cash) < dueAmount}>
                  Pay
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent ref={receiptRef} id="receipt" className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Payment Receipt</DialogTitle>
            <DialogDescription>
              Thank you choosing Arado Enterprises!
            </DialogDescription>
          </DialogHeader>
          
          {/* Receipt Body */}
          <div className="py-4 space-y-4">
            
            {payment && (
              <ScrollArea className="h-72 w-full p-4 border rounded-md">
                {/* Header Info */}
                <div className="text-xs mb-3 space-y-1">
                    <div className="flex justify-between">
                        <span>Receipt ID:</span>
                        <span className="font-medium">{payment.payment_id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{new Date(payment.date).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Cashier:</span>
                        <span>{payment.first_name} {payment.last_name}</span>
                    </div>
                </div>

                <Separator className="my-3" />

                {/* Items List */}
                <h3 className="font-semibold text-sm mb-2">ITEMS</h3>
                <div className="space-y-1">
                  {payment.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="flex-1">{item.item_quantity}x Product {item.product_name}</span>
                      <span className="font-medium">₱{formatMoney((item.item_quantity * item.item_price))}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />
                
                {/* Summary */}
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₱{formatMoney(payment.original_total)}</span>
                    </div>
                    {payment.discount_amount > 0 && (
                        <div className="flex justify-between text-red-600">
                            <span>Discount ({payment.discount_reason}):</span>
                            <span>- ₱{formatMoney(payment.discount_amount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-1">
                        <span>TOTAL:</span>
                        <span>₱{formatMoney(payment.total_amount)}</span>
                    </div>
                </div>

                <Separator className="my-3" />
                
                {/* Cash/Change */}
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span>Cash Given:</span>
                        <span>₱{formatMoney(payment.amount_given)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Change:</span>
                        <span>₱{formatMoney(payment.change_amount)}</span>
                    </div>
                </div>
              </ScrollArea>
            )}
          </div>
          
          <DialogFooter>
            {/* The Print Button */}
            {/* <Button variant="secondary" onClick={() => window.print()}>
              Print Receipt
            </Button> */}
            <Button variant="secondary" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
            {/* The Close Button */}
            <Button onClick={() => setIsReceiptOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}