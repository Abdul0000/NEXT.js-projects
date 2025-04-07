import { getcurrent } from '@/features/actions'
import TaskViewSwicther from '@/features/tasks/components/task-view-swicther'
import { redirect } from 'next/navigation'
import React from 'react'

const TasksPage = async() => {
   const user = await getcurrent()
   if(!user) redirect("/sign-in")
  return (
    <div className='h-full flex flex-col'>
        <TaskViewSwicther/>
    </div>
  )
}

export default TasksPage