import { ChevronDown, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";

interface CartTableProps {
  cart: any[];
  onQuantityChange: (productId: number, newQty: number) => void;
  onRemove: (productId: number) => void;
}

export default function PaymentTable({ cart, onQuantityChange, onRemove }: CartTableProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
  
    const toggleChevron = () => {
      setIsOpen(!isOpen);
    }


  return(
    <Table >
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead className="w-2/5">Item</TableHead>
          <TableHead className="text-center w-1/5">Qty</TableHead>
          <TableHead className="text-center w-1/5">Price</TableHead>
          <TableHead className="text-right w-1/5">Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cart.map((item) => (
          <Collapsible asChild key={item.product_id}>
            <>
              <CollapsibleTrigger asChild onClick={toggleChevron}>
                <TableRow className="cursor-pointer border-b-0 data-[state=open]:bg-muted">
                  <TableCell className="text-start p-0">
                    <Button variant="ghost" size={"icon"} className="hover:bg-transparent">
                      <ChevronDown style={{
                        transition: 'transform 0.2s ease-in-out', 
                        transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)' 
                      }}/>
                    </Button>
                  </TableCell>
                  <TableCell className="flex items-center gap-4">
                    <div className="flex justify-center items-center">
                      <img src="/hammer.webp" 
                      alt="Hammer" 
                      className="p-1 max-w-[50px] max-h-[50px] object-contain" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-base">
                        {item.name} 
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.sku}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.quantity} 
                  </TableCell>
                  <TableCell className="text-center">₱{(item.price)}</TableCell>
                  <TableCell className="text-right font-semibold">₱{(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              </CollapsibleTrigger>
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <CollapsibleContent 
                    className="overflow-hidden 
                    data-[state=open]:animate-collapsible-down 
                    data-[state=closed]:animate-collapsible-up">
                    <TableRow>
                    <TableCell className="bg-muted p-4 ps-12">
                      <div className="flex justify-evenly items-center gap-4 xl:gap-8">
                        <div className="flex items-center gap-2 flex-1">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input 
                            id="quantity"
                            type="number"
                            min={1}
                            max={item.stock_quantity}
                            value={item.quantity}
                            onChange={(e) => {
                              const value = Number(e.target.value);

                              if (value < 1) return;
                              if (value > item.stock_quantity + item.quantity) {
                                toast({
                                  variant: "destructive",
                                  title: "Insufficient stock",
                                  description: "Restock " + item.name + " if needed." ,
                                  action: <ToastAction altText="Try again">I understand</ToastAction>,
                                })
                                return;
                              }

                              onQuantityChange(item.product_id, value);
                            }}/>
                        </div>
                        <div className="flex items-center gap-2 flex-1" >
                          <Label htmlFor="discount">Disc.&nbsp;(%)</Label>
                          <Input 
                            id="discount" 
                            type="number" 
                            min={0} 
                            defaultValue={0}/>
                        </div>
                        <Button variant="destructive" size={"icon"} onClick={() => onRemove(item.product_id)}>
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  </CollapsibleContent>
                </TableCell>
              </TableRow>
            </>
          </Collapsible>
        ))}  
      </TableBody>
    </Table>
  )
}