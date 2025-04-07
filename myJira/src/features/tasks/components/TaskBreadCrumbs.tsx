import { project } from '@/features/projects/types'
import React from 'react'
import { Task } from '../types';
import ProjectAvatar from '@/features/projects/components/projectAvatar';
import Link from 'next/link';
import { ChevronRight, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteTask } from '../api/use-delete-task ';
import { useConfirm } from '@/hooks/useConfirm';
import { useRouter } from 'next/navigation';
interface TaskBreadCrumbsProps{
  project:project;
  task: Task;
  workspaceId:string;
}
const TaskBreadCrumbs = ({project,task,workspaceId}: TaskBreadCrumbsProps) => {
  const router = useRouter()
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
              param:{taskId: task.$id}
          },{
            onSuccess: ()=>{
              router.push(`/workspaces/${workspaceId}/tasks`)
            }
          })

      }
  return (
    <div className='flex items-center justify-center gap-x-2'>
      <DeleteDialog/>
      <ProjectAvatar name={project.name} image={project.imageUrl} className='size-6 lg:size-8'/>
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
      <p className='text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition'>{project.name}</p>
      </Link>
      <ChevronRight className='size-4 lg:size-5 text-muted-foreground'/>
      <p className='text-sm lg:text-lg font-semibold '>{task.name}</p>
      <Button onClick={deleteTask} disabled={isDeleteTaskPending} className='ml-auto' variant="destructive" size="sm"><TrashIcon className='size-4 lg:mr-2'/><span className='hidden lg:block'>Delete Task</span></Button>
    </div>
  )
}

export default TaskBreadCrumbs