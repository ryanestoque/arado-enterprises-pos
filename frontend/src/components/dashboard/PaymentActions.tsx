import type { Payment } from "./Columns";
import { Button } from "../ui/button";
import { ReceiptText, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { usePaymentById } from "@/hooks/useAPI";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

async function deletePayment(url: string) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete payment")
}


export default function PaymentActions({ payment }: { payment: Payment }) {
  const { trigger: deleteTrigger} = useSWRMutation(`http://localhost:5000/api/payment/${payment.payment_id}`, deletePayment)

  const { data: paymentById  } = usePaymentById(payment.payment_id);

  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    try {
      await deleteTrigger()
      mutate("http://localhost:5000/api/payment")
      mutate("http://localhost:5000/api/payment/best_selling")
      mutate("http://localhost:5000/api/payment/total_revenue")
      mutate("http://localhost:5000/api/payment/gross_profit")
      mutate("http://localhost:5000/api/product/gross_profit")
      mutate("http://localhost:5000/api/auditlog")
      toast({
        title: `Payment ${payment.payment_id} is deleted!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: `Failed to delete Payment ${payment.payment_id}!`,
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    }
  }

    const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("receipt.pdf");
  };


  return(
    <div className="flex flex-row gap-1">
      <Dialog>
        <DialogTrigger>
          <Button variant={"outline"} size={"icon"}><ReceiptText /></Button>
        </DialogTrigger>
        <DialogContent ref={receiptRef} id="receipt" className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Payment Receipt</DialogTitle>
            <DialogDescription>
              Thank you choosing Arado Enterprises!
            </DialogDescription>
          </DialogHeader>
          
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
                        <span>{paymentById?.first_name} {paymentById?.last_name}</span>
                    </div>
                </div>

                <Separator className="my-3" />

                {/* Items List */}
                <h3 className="font-semibold text-sm mb-2">ITEMS</h3>
                <div className="space-y-1">
                  {paymentById?.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="flex-1">{item.item_quantity}x Product {item.product_name}</span>
                      <span className="font-medium">₱{(item.item_quantity * item.item_price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />
                
                {/* Summary */}
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₱{paymentById?.original_total.toFixed(2)}</span>
                    </div>
                    {paymentById?.discount_amount || 0 > 0 && (
                        <div className="flex justify-between text-red-600">
                            <span>Discount ({paymentById?.discount_reason}):</span>
                            <span>- ₱{paymentById?.discount_amount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-1">
                        <span>TOTAL:</span>
                        <span>₱{paymentById?.total_amount.toFixed(2)}</span>
                    </div>
                </div>

                <Separator className="my-3" />
                
                {/* Cash/Change */}
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span>Cash Given:</span>
                        <span>₱{paymentById?.amount_given.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Change:</span>
                        <span>₱{paymentById?.change_amount.toFixed(2)}</span>
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
            <DialogClose>
              <Button>
                Done
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"destructive"} size={"icon"}><Trash /></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete a payment row?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}