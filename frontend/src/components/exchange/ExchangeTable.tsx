"use client"

import { DataTable } from "@/components/common/DataTable"
import { columns, type Exchange } from "./Columns"

export default function ExchangeTable({ data }: { data: Exchange[] }) {
  return (
    <div className="p-4">
      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Filter by username..."
        columnToFilter="username"/>
    </div>
  )
}
