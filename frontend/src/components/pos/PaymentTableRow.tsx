import { ChevronDown} from "lucide-react"
import { Button } from "../ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { TableCell, TableRow } from "../ui/table"
import PaymentItemEditor from "./PaymentItemEditor"
import { useState } from "react"

export default function PaymentTableRow() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChevron = () => {
    setIsOpen(!isOpen);
  }

  return(
    <Collapsible asChild>
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
                  Hammer  
                </p>
                <p className="text-xs text-muted-foreground">
                  0123456789
                </p>
              </div>
            </TableCell>
            <TableCell className="text-center">
              32
            </TableCell>
            <TableCell className="text-center">₱250.00</TableCell>
            <TableCell className="text-right font-semibold">₱250.00</TableCell>
          </TableRow>
        </CollapsibleTrigger>
        <TableRow>
          <TableCell colSpan={5} className="p-0">
            <CollapsibleContent 
              className="overflow-hidden 
              data-[state=open]:animate-collapsible-down 
              data-[state=closed]:animate-collapsible-up">
              <PaymentItemEditor />
            </CollapsibleContent>
          </TableCell>
        </TableRow>
      </>
    </Collapsible>
  )
}