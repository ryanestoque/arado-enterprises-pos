"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import UserActions from "./UserActions"

export type User = {
  user_id: number
  username: string
  role: string
  first_name: string
  last_name: string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("username")}
    </div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("role")}
    </div>,
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("first_name")}
    </div>,
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => 
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {row.getValue("last_name")}
    </div>,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-end">Actions</div>
    ),
    cell: ({ row }) => {
      const user = row.original
      
      return(
        <div className="flex justify-end"> 
          <UserActions user={user}/>
        </div>
      )
    }
  }
]
