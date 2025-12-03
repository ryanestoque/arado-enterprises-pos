"use client"

import { DataTable } from "@/components/common/DataTable"
import { columns, type Supplier } from "./Columns"

export default function SupplierTable({ data }: { data: Supplier[] }) {
  return (
    <div className="p-4 overflow-y-auto">
      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Filter by name..."
        columnToFilter="name"/>
    </div>
  )
}