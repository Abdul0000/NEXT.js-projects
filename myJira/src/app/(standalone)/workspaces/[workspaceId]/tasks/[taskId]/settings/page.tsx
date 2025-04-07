import { Toaster } from '@/components/ui/sonner'
import { getcurrent } from '@/features/actions'
// import { getTask } from '@/features/projects/queries'
import { redirect } from 'next/navigation'
import React from 'react'
// interface TaskIdSettingsPageProps {
//     params:{
//         taskId:string
//     }
// }
const TaskIdSettingsPage = async() => {
    const user = await getcurrent()
    if (!user) redirect("/sign-in")
      // const { taskId } = await params;
      // const initialValues = null;
    // const initilalValues =await getProject({projectId: params.projectId})
    // if(!initialValues){
    //      redirect(`/workspaces/${params.taskId}`)
    // }
  return (
    <div className='md:w-[85vh]'>
        <Toaster/>
        {/* <EditProjectForm initialValues={initialValues}/> */}
    </div>
  )
}

export default TaskIdSettingsPage