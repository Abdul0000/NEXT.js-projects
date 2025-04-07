import { getcurrent } from '@/features/actions'
import { redirect } from 'next/navigation'
import WorkspaceIdJoinPageClient from './client'

const WorkspaceIdJoinPage = async() => {
  
  const user =await getcurrent()
  if(!user) redirect("/sign-in")

  return (
   <WorkspaceIdJoinPageClient/>
  )
}

export default WorkspaceIdJoinPage