"use client"

import { DataTable } from "@/components/common/DataTable"
import { columns, type User } from "./Columns"

export default function UserTable({ data }: { data: User[] }) {
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