import { getcurrent } from '@/features/actions'
import CreateWorkspaceForm from '@/features/workspaces/components/createWorkspaceForm'
import { redirect } from 'next/navigation'
import React from 'react'

const WorkspaceCreatePage = async() => {
    const user = await getcurrent()
    if (!user) redirect("/sign-in")
  return (
    <div className='w-full lg:max-w-xl'>
      <CreateWorkspaceForm/>
    </div>
  )
}

export default WorkspaceCreatePage