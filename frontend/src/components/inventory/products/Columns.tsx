"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import InventoryActions from "./InventoryActions"
import { Button } from "@/components/ui/button"
import { formatMoney } from "@/components/dashboard/SectionCards"

export type Product = {
  product_id: number
  name: string
  description: string
  category_id: number
  supplier_id: number
  price: number
  cost: number
  stock_quantity: number
  reorder_level: number
  sku: string
  barcode: string
  category_name?: string
  supplier_name?: string
}

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "sku",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="max-w-[75px] overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("sku")}
    </div>,
  },
  {
    accessorKey: "category_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("category_name")}
    </div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      ₱{formatMoney(row.getValue("price"))}
    </div>,
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      ₱{formatMoney(row.getValue("cost"))}
    </div>,
  },
  {
    accessorKey: "stock_quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stock = row.getValue("stock_quantity") as number
      const reorder = row.original.reorder_level
      if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>
      if (stock <= reorder) return <Badge variant="lowStock">Low ({stock})</Badge>
      return <Badge variant="inStock"> {stock}</Badge>
    }
  },
  {
    id: "actions",
    header: () => (
      <div className="text-end">Actions</div>
    ),
    cell: ({ row }) => {
      const product = row.original
      
      return(
        <div className="flex justify-end"> 
          <InventoryActions product={product}/>
        </div>
      )
    }
  }
]
