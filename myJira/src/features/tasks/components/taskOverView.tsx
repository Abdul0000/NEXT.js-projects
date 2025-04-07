import React from 'react'
import { Task } from '../types'
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import OverviewProperty from './overviewProperty';
import MemeberAvatar from '@/features/members/components/memberAvatar';
import TaskDate from './taskDate';
import { Badge } from '@/components/ui/badge';
import { snakeCaseToTitleCase } from './columns';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';
interface TasksOverViewProps{
    task: Task;
}
const TaskOverView = ({task}: TasksOverViewProps) => {
    const { open } = useEditTaskModal()
  return (
    <div className='flex flex-col gap-y-4 col-span-1'>
        <div className='bg-muted rounded-lg p-4'>
            <div className='flex items-center justify-between'>
            <p className='text-lg font-semibold'>Overview </p>
                <Button onClick={()=> open(task.$id)} size="sm" variant="secondary" >
                    <PencilIcon className='size-4 mr-2'/>
                    Edit
                </Button>
            </div>
            <Separator className='my-4'/>
            <div className='flex flex-col gap-y-4'>
                <OverviewProperty label='Assignee'>
                    <MemeberAvatar name={task.assignee.name} className='size-6'/>
                    <p className='text-sm font-medium'>{task.assignee.name}</p>
                </OverviewProperty>
                <OverviewProperty label='Due Date'>
                    <TaskDate className='text-sm font-medium' value={task.dueDate}/>
                </OverviewProperty>
                <OverviewProperty label='Status'>
                    <Badge variant={task.status}>
                        {snakeCaseToTitleCase(task.status)}
                    </Badge>
                </OverviewProperty>
            </div>
        </div>
    </div>
  )
}

export default TaskOverView