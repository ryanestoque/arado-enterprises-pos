"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import SupplierActions from "./SupplierActions"

export type Supplier = {
  supplier_id: number
  name: string
  contact_person: string
  phone_number: string
  email?: string
  address?: string
}

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("name")}
    </div>,
  },
  {
    accessorKey: "contact_person",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact Person
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="max-w-[75px] overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("contact_person")}
    </div>,
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("phone_number")}
    </div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("email")}
    </div>,
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("address")}
    </div>,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-end">Actions</div>
    ),
    cell: ({ row }) => {
      const supplier = row.original
      
      return(
        <div className="flex justify-end"> 
          <SupplierActions supplier={supplier}/>
        </div>
      )
    }
  }
]
