"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader, PlusIcon } from 'lucide-react'
import React, { useCallback } from 'react'
import { useCreateTaskModal } from '../hooks/use-create-task-modal'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useGetTasks } from '../api/use-get-tasks'
import { useQueryState } from 'nuqs'
import DataFilters from './dataFilters'
import { useTaskFilters } from '../hooks/use-task-filters'
import { DataTable } from './dataTable'
import Columns from './columns'
import DataKanban from './dataKanban'
import { TaskStatus } from '../types'
import { useBulkUpdateTasks } from '../api/use-bulkupdate-tasks'
import DataCalendar from './dataCalendar'
import { useProjectId } from '@/features/projects/hooks/use-projectId'
interface TaskViewSwictherProps{
  hideProjectFilter?:boolean;
}
const TaskViewSwicther = ({hideProjectFilter}: TaskViewSwictherProps) => {
  const { mutate:bulkUpdate} = useBulkUpdateTasks()
  const [view, setView] = useQueryState("view",{defaultValue:"table"})
  const workspaceId = useWorkspaceId()
  const paramProjectId = useProjectId()
  const [{
          status,
          projectId,
          assigneeId,
          dueDate,
        }]= useTaskFilters();
  const onKanbanChange = useCallback((tasks:{task: string; status:TaskStatus; $id:string; position:number}[])=>{
    bulkUpdate({
      json:  {tasks} 
    })
    console.log(tasks)
  },[bulkUpdate])
  const { data: tasks, isLoading:isLoadingTasks } = useGetTasks({ workspaceId,status,projectId: paramProjectId || projectId,assigneeId,dueDate });
  const {open} = useCreateTaskModal()
  return (
    <Tabs className='w-full flex-1 border rounded-lg' defaultValue={view} onValueChange={setView}>
        <div className='flex flex-col p-4 overflow-auto'> 
          <div className='flex flex-col justify-between items-center gap-y-2 lg:flex-row'>
            <TabsList className='w-full lg:w-auto '>
              <TabsTrigger value='table' className='cursor-pointer'>
                Table
              </TabsTrigger> 
              <TabsTrigger value='kanban' className='cursor-pointer'>
                Kanban
              </TabsTrigger> 
              <TabsTrigger value='calendar' className='cursor-pointer'>
                Calendar
              </TabsTrigger>            
            </TabsList>
            <Button className='w-full lg:w-auto' size='sm' onClick={open}>
              <PlusIcon className='size-4 '/>
              New
            </Button>
          </div>
          <Separator className='my-4'/>
          <DataFilters hideProjectFilter={hideProjectFilter}/>
          <Separator className='my-4'/>
          {isLoadingTasks ?  
          (<div className='w-full h-[200px] rounded-lg flex justify-center items-center '>
            <Loader className='size-5 animate-spin text-muted-foreground'/>
          </div> ):
          (<>
            <TabsContent value='table'>
              <DataTable columns={Columns} data={tasks?.documents ?? []}/>
            {/* {JSON.stringify(tasks)} */}
            </TabsContent>
            <TabsContent value='kanban'>
            <DataKanban onChange={()=>onKanbanChange} data={tasks?.documents ?? []}/>
            </TabsContent>
            <TabsContent value='calendar'>
              <DataCalendar data={tasks?.documents ?? []}/>
            </TabsContent>
          </>)
    }
        </div>
    </Tabs>
  )
}

export default TaskViewSwicther