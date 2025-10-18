import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import PaymentTableRow from "./PaymentTableRow";

export default function PaymentTable() {
  return(
    <Table >
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Item</TableHead>
          <TableHead className="text-center">Qty</TableHead>
          <TableHead className="text-center">Price</TableHead>
          <TableHead className="text-right">Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <PaymentTableRow />
        <PaymentTableRow />
        <PaymentTableRow />
      </TableBody>
    </Table>
  )
}