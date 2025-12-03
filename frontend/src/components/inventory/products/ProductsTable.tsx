"use client"

import { DataTable } from "@/components/common/DataTable"
import { columns, type Product } from "./Columns"

export default function ProductsTable({ data }: { data: Product[] }) {
  return (
    <div className="p-4 overflow-y-auto">
      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Filter by product name..."
        columnToFilter="name"/>
    </div>
  )
}
