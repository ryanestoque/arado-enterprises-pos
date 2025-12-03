"use client"

import { DataTable } from "@/components/common/DataTable"
import { columns, type AuditLogs  } from "./Columns"

export default function AuditLogsTable({ data }: { data: AuditLogs[] }) {
  return (
    <div className="p-4">
      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Filter by module..."
        columnToFilter="module"/>
    </div>
  )
}