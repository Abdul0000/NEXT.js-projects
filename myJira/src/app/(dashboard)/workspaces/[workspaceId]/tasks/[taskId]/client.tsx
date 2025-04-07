"use client"
import PageLoader from '@/components/pageLoader'
import { Separator } from '@/components/ui/separator'
import { useGetTask } from '@/features/tasks/api/use-get-task'
import Description from '@/features/tasks/components/Description'
import TaskBreadCrumbs from '@/features/tasks/components/TaskBreadCrumbs'
import TaskOverView from '@/features/tasks/components/taskOverView'
import { useTaskId } from '@/features/tasks/hooks/use-taskId'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import React from 'react'

const TaskIdClient = () => {
    const taskId = useTaskId()
    const workspaceId= useWorkspaceId()
    const { data, isLoading, isError } = useGetTask({ taskId })
    console.log("DATA : ", data)
    if(isError || !data || isLoading ){
        return <PageLoader/>
    }

  return (
    <div className='flex flex-col'>
        <TaskBreadCrumbs project={data?.project} task={data} workspaceId={workspaceId}/>
        <Separator className='my-6'/>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <TaskOverView task={data}/>
            <Description task={data}/>
        </div>
    </div>
  )
}

export default TaskIdClient