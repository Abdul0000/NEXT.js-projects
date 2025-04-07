import React from 'react'
import { Task } from '../types'
import TaskActions from './taskActions'
import { MoreHorizontal } from 'lucide-react'
import { Separator } from '@/components/ui/separator';
import MemeberAvatar from '@/features/members/components/memberAvatar';
import TaskDate from './taskDate';
import ProjectAvatar from '@/features/projects/components/projectAvatar';
interface KanbanCardProps{
    task: Task;
}
const KanbanCard = ({task}: KanbanCardProps) => {
  return (
    <div className='bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3'>
        <div className='flex items-start justify-between gap-x-2'>
            <p className='text-sm line-clamp-2'> {task.name} </p>
            <TaskActions id={task.$id} projectId={task.projectId}>
                <MoreHorizontal className='size-[18px] cursor-pointer stroke-1 shrink-0 text-neutral-700 hover: opacity-75 transition'/>
            </TaskActions>
        </div>
        <Separator/>
        <div className='flex items-center gap-x-1.5'>
            <MemeberAvatar name={task.assignee.name} fallbackClassName='text-[10px]'/>
            <div className='size-1 rounded-full bg-neutral-300'/>
            <TaskDate value={task.dueDate} className='text-xs'/>
        </div>
        <div className='flex items-center gap-x-1.5'>
            <ProjectAvatar name={task.project.name} image={task.project.imageUrl} className= "text-xs"/>
            <span className='text-xs font-medium'>{task.project.name}</span>
        </div>
    </div>
  )
}

export default KanbanCard