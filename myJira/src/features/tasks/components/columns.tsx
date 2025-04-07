"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Task } from "../types"
import { ArrowUpDown, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProjectAvatar from "@/features/projects/components/projectAvatar"
import TaskDate from "./taskDate"
import { Badge } from "@/components/ui/badge"
import TaskActions from "./taskActions"

export function snakeCaseToTitleCase(str :string) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
const Columns: ColumnDef<Task>[] = [
    {
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Task Name
                <ArrowUpDown className="ml-2 size-4" />
              </Button>
            )
          },
        accessorKey: "name",
        cell: ({row})=> {
           const name= row.original.name
           return <p className="line-clamp-1">{name}</p>
        }
    },
    {
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Project
                <ArrowUpDown className="ml-2 size-4" />
              </Button>
            )
          },
        
        accessorKey: "project",
        cell: ({row})=>{
            const project = row.original.project
            return <div className="flex items-center gap-x-2 text-sm font-medium ">
                <ProjectAvatar className="size-6" image={project.imageUrl} name={project.name}/>
                <p className="line-clamp-1">{project.name}</p>

            </div>
        }
    },
    {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Assignee
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          )
        },
        accessorKey: "assignee",
        cell: ({row})=> {
          const assignee= row.original.assignee
          return <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar className="size-6" image={assignee.imageUrl} name={assignee.name}/>
          <p className="line-clamp-1">{assignee.name}</p>

      </div>
       }
    },
  
    {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Due Date
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          )
        },
        accessorKey: "dueDate",
        cell: ({row})=> {
          const dueDate = row.original.dueDate
          return <TaskDate value={dueDate}/>
       }
    },
    {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Status
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          )
        },
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;
          return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
        }
    },
    
    {
        id: "actions",
        cell: ({ row }) => {
          const id = row.original.$id;
          const projectId = row.original.projectId;

          return <TaskActions id={id} projectId={projectId}>
              <Button variant="ghost" className="size-8 p-0">
                <MoreVertical className="size-4"/>
              </Button>
          </TaskActions>
        }
    },
]

export default Columns