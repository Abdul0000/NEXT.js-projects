import { getcurrent } from '@/features/actions'
import { redirect } from 'next/navigation'
import React from 'react'
import WorkspaceIdSettingsPageClient from './client'

const WorkspaceIdSettingsPage = async() => {
    const user = await getcurrent()
    if (!user) redirect("/sign-in")
    
  return (
   <WorkspaceIdSettingsPageClient/>
  )
}

export default WorkspaceIdSettingsPage