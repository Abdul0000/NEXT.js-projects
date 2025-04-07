"use client"
import PageLoader from '@/components/pageLoader'
import { Toaster } from '@/components/ui/sonner'
import { useGetProject } from '@/features/projects/api/use-get-project'
import EditProjectForm from '@/features/projects/components/editProjectForm'
import { useProjectId } from '@/features/projects/hooks/use-projectId'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { redirect } from 'next/navigation'
import React from 'react'

const ProjectIdSettingsClientPage = () => {
    const projectId= useProjectId()
    const workspaceId = useWorkspaceId()
    const { data, isPending } = useGetProject({ projectId });
    if (isPending) return <PageLoader />;
    if (!data) return null;
    if(!data){
         redirect(`/workspaces/${workspaceId}`)
    }
  return (
    <div className='md:w-[85vh]'>
        <Toaster/>
        <EditProjectForm initialValues={data}/>
    </div>
  )
}

export default ProjectIdSettingsClientPage