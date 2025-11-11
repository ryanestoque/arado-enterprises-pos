"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import InventoryActions from "./InventoryActions"

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
    header: "Name",
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("name")}
    </div>,
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => 
    <div className="max-w-[75px] overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("sku")}
    </div>,
  },
  {
    accessorKey: "category_name",
    header: "Category",
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("category_name")}
    </div>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      ₱{row.getValue("price")}
    </div>,
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      ₱{row.getValue("cost")}
    </div>,
  },
  {
    accessorKey: "stock_quantity",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock_quantity") as number
      const reorder = row.original.reorder_level
      if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>
      if (stock <= reorder) return <Badge variant="secondary">Low ({stock})</Badge>
      return stock
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original
      
      return(
        <InventoryActions product={product}/>
      )

    }
  }
]
