"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import PaymentActions from "./PaymentActions"

export type Payment = {
  payment_id: number
  date: string
  total_amount: number
  amount_given: number
  username: string
}

export const columns: ColumnDef<Payment>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="w-12 lg:w-8 xl:w-4 flex items-center gap-4">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //       <div className="text-sm text-muted-foreground">
  //         {table.getFilteredSelectedRowModel().rows.length}
  //       </div>
  //     </div>

  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        className="p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date and Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue<string>("date")
      const d = new Date(rawDate)

      const datePart = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })

      const timePart = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })

      return `${datePart}  ${timePart}`
    },
  },  
  {
    accessorKey: "total_amount",
    header: ({ column }) => (
      <Button
        className="p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue<number>("total_amount")
      return `₱${amount.toFixed(2).toLocaleString()}`
    },
  },
  {
    accessorKey: "amount_given",
    header: ({ column }) => (
      <Button
        className="p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount Given
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue<number>("amount_given")
      return `₱${amount.toFixed(2).toLocaleString()}`
    },
  },
  
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        className="p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Cashier
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const username = row.getValue<string>("username")
      return `${username}`
    },
  },
  {
    id: "actions",
    // header: () => (
    //   <div className="text-end">Actions</div>
    // ),
    cell: ({ row }) => {
      const payment = row.original
      
      return(
        <div className="flex justify-end"> 
          <PaymentActions payment={payment}/>
        </div>
      )
    }
  }
]
