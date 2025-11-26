"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import CategoryActions from "./CategoryActions"
import { Button } from "@/components/ui/button"

export type Category = {
  category_id: number
  name: string
}

export const columns: ColumnDef<Category>[] = [
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
    id: "actions",
    header: () => (
      <div className="text-end">Actions</div>
    ),
    cell: ({ row }) => {
      const category = row.original
      
      return(
        <div className="flex justify-end"> 
          <CategoryActions category={category}/>
        </div>
      )
    }
  }
]
