import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import React from 'react'
import { useDeleteTask } from '../api/use-delete-task ';
import { useConfirm } from '@/hooks/useConfirm';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';

interface TaskActionsProps {
    id: string;
    projectId: string;
    children: React.ReactNode;
}
const TaskActions = ({id, projectId, children}: TaskActionsProps) => {
    const { open } = useEditTaskModal()
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const { mutate:taskDelete, isPending: isDeleteTaskPending } = useDeleteTask()
    const [DeleteDialog, ConfirmDelete] = useConfirm(
            "Delete Task",
            "This action cannot be undone.",
            "destructive"
        )
    const deleteTask = async()=>{
        const ok = await ConfirmDelete()
        if(!ok) return ;
        taskDelete({
            param:{taskId: id}
        })
    }
    const onOpenTask = ()=>{
        router.push(`/workspaces/${workspaceId}/tasks/${id}`)
    }
    const onOpenProject = ()=>{
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
    }
  return (
    <div className='flex justify-end'>
        <DeleteDialog/>
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem onClick={onOpenTask} className='font-medium p-[10px] cursor-pointer'>
                    <ExternalLinkIcon className='size-4 mr-2 stroke-2'/>
                    Task Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onOpenProject} className='font-medium p-[10px] cursor-pointer'>
                    <ExternalLinkIcon className='size-4 mr-2 stroke-2'/>
                    Open Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> open(id)} className='font-medium p-[10px] cursor-pointer'>
                    <PencilIcon className='size-4 mr-2 stroke-2'/>
                    Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteTask} disabled={isDeleteTaskPending} className='text-amber-700 focus:text-amber-700 font-medium p-[10px] cursor-pointer'>
                    <TrashIcon className='size-4 mr-2 stroke-2'/>
                    Delete Task
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default TaskActions