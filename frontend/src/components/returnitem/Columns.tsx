"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReturnItemActions from "./ReturnItemActions"

export type ReturnItem = {
  return_id: number
  payment_item_id?: string
  return_quantity: number
  return_date: string
  return_reason: string
  user_id: number
  product_id: number
  username?: string
  product_name?: string
}

export const columns: ColumnDef<ReturnItem>[] = [
  {
    accessorKey: "return_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {new Date(row.getValue("return_date")).toLocaleString()}
    </div>,
  },
  {
    accessorKey: "product_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Returned product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("product_name")}
    </div>,
  },
  {
    accessorKey: "return_quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="max-w-[75px] overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("return_quantity")}
    </div>,
  },
  {
    accessorKey: "return_reason",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reason
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("return_reason")}
    </div>,
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Handled by
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("username")}
    </div>,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-end">Actions</div>
    ),
    cell: ({ row }) => {
      const returnItem = row.original
      
      return(
        <div className="flex justify-end"> 
          <ReturnItemActions returnItem={returnItem}/>
        </div>
      )
    }
  }
] 
