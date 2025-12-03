"use client"

import { DataTable } from "@/components/common/DataTable"
import { columns, type Category } from "./Columns"

export default function CategoryTable({ data }: { data: Category[] }) {
  return (
    <div className="p-4 overflow-y-auto">
      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Filter by category..."
        columnToFilter="name"/>
    </div>
  )
}