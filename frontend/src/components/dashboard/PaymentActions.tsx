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
import { API_BASE, usePaymentById } from "@/hooks/useAPI";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatMoney } from "./SectionCards";

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
  const { trigger: deleteTrigger } = useSWRMutation(`${API_BASE}/api/payment/${payment.payment_id}`, deletePayment)

  const { data: paymentById } = usePaymentById(payment.payment_id);

  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    try {
      await deleteTrigger()
      mutate(`${API_BASE}/api/payment`)
      mutate(`${API_BASE}/api/payment/best_selling`)
      mutate(`${API_BASE}/api/payment/total_revenue`)
      mutate(`${API_BASE}/api/payment/gross_profit`)
      mutate(`${API_BASE}/api/product/gross_profit`)
      mutate(`${API_BASE}/api/auditlog`)
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

    // Use onclone to modify the document before capturing
    const canvas = await html2canvas(receiptRef.current, {
      scale: 2, // Higher scale for better resolution
      useCORS: true,
      onclone: (clonedDoc) => {
        // 1. Find the ScrollArea in the CLONED document
        const scrollArea = clonedDoc.getElementById("receipt-scroll-area");
        
        // 2. Find the main Dialog Content
        const dialogContent = clonedDoc.getElementById("receipt");

        if (scrollArea) {
          // Force height to auto so all content is visible
          scrollArea.style.height = "auto";
          scrollArea.style.maxHeight = "none";
          scrollArea.style.overflow = "visible";
        }
        
        if (dialogContent) {
            // Ensure the container grows to fit the expanded scroll area
            dialogContent.style.height = "auto";
        }
      },
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Calculate PDF dimensions based on the canvas size
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`receipt-${payment.payment_id}.pdf`);
  };


  return (
    <div className="flex flex-row gap-1">
      <Dialog>
        <DialogTrigger>
          <Button variant={"outline"} size={"icon"}><ReceiptText /></Button>
        </DialogTrigger>
        {/* Added id="receipt" here to ensure we target the container */}
        <DialogContent ref={receiptRef} id="receipt" className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Payment Receipt</DialogTitle>
            <DialogDescription>
              Thank you choosing Arado Enterprises!
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">

            {payment && (
              // ADDED id="receipt-scroll-area" HERE
              <ScrollArea id="receipt-scroll-area" className="h-72 w-full p-4 border rounded-md">
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
                      <span className="font-medium">₱{formatMoney(item.item_quantity * item.item_price)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                {/* Summary */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₱{formatMoney(paymentById?.original_total)}</span>
                  </div>
                  {(paymentById?.discount_amount ?? 0) > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount ({paymentById?.discount_reason}):</span>
                      <span>- ₱{formatMoney(paymentById?.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-1">
                    <span>TOTAL:</span>
                    <span>₱{formatMoney(paymentById?.total_amount)}</span>
                  </div>
                </div>

                <Separator className="my-3" />

                {/* Cash/Change */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Cash Given:</span>
                    <span>₱{formatMoney(paymentById?.amount_given)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span>₱{formatMoney(paymentById?.change_amount)}</span>
                  </div>
                </div>
              </ScrollArea>
            )}
          </div>

          <DialogFooter>
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