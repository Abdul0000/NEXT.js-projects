"use client"
import { RiAddCircleFill } from "react-icons/ri"
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "./ui/select"
import WorkspaceAvatar from "@/features/workspaces/components/workspaceAvatar"
import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal"
import { Workspace } from "@/features/workspaces/types"
const WorkspaceSwitcher = () => {
    const {open} = useCreateWorkspaceModal()
    const router = useRouter()
    const workspaceId= useWorkspaceId()
    const { data:workspaces } = useGetWorkspaces()
    // console.log("workspaces",workspaces)
    // if(!workspaces) return null
    const onSelect = (id:string)=>{
        router.push(`/workspaces/${id}`)
    }
  return (
    <div className="flex flex-col gap-y-2">
    <div className="flex justify-between items-center">
    <p className="text-xs uppercase text-neutarl-500">Workspaces</p>
    <RiAddCircleFill onClick={open} className="cursor-pointer size-5 text-neutral-500 hover:opacity-75"/>
    </div>
    <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full cursor-pointer bg-neutral-200 font-medium p-1">
            <SelectValue placeholder="No Workspace selected"/>
                <SelectContent >

                {workspaces?.documents.map((workspace: Workspace) => (<SelectItem className="cursor-pointer" value={workspace.$id} key={workspace.$id}>
                    <div className="flex justify-start items-center gap-3 font-medium">
                        <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl}/>
                        <span className="truncate">{workspace.name}</span>
                    </div>
                </SelectItem>
                    ))}
                </SelectContent>
        </SelectTrigger>
    </Select>
    </div>
  )
}

export default WorkspaceSwitcher