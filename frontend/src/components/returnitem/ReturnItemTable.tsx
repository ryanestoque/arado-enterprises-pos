"use client"

import { DataTable } from "@/components/common/DataTable"
import { columns, type ReturnItem } from "./Columns"

export default function ReturnItemTable({ data }: { data: ReturnItem[] }) {
  return (
    <div className="p-4 overflow-y-auto">
      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Filter by username..."
        columnToFilter="username"/>
    </div>
  )
}
