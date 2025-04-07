"use client"
import React from 'react'
import { RiAddCircleFill } from 'react-icons/ri'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import Link from 'next/link'
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal'
import { cn } from '@/lib/utils'
import { useGetProjects } from '@/features/projects/api/use-get-projects'
import ProjectAvatar from '@/features/projects/components/projectAvatar'
import { usePathname } from 'next/navigation'


const Projects = () => {
  const {open} = useCreateProjectModal()
  const workspaceId = useWorkspaceId()
  const pathname = usePathname()
  const {data}  = useGetProjects({workspaceId})

  return (
    <div className="flex flex-col gap-y-2 bg-neutral-100 ">
        <div className="flex justify-between items-center">
        <p className="text-xs uppercase text-neutarl-500">Projects</p>
        <RiAddCircleFill onClick={open} className="cursor-pointer size-5 text-neutral-500 hover:opacity-75"/>
        </div>
        {
          data?.documents?.map((project)=>{
            const href = `/workspaces/${workspaceId}/projects/${project.$id}`
            const isActive = pathname === href
            return (
              <Link href={href} key={project.$id}>
                <div className={cn("flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transient cursor-pointer text-neutral-500",
                  isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                )}>
                  
                  <ProjectAvatar name={project.name} image={project.imageUrl} className="text-sm"/>
                  <span className='truncate'>{project.name}</span>
                </div>
              </Link>
            )
          })
        }
        
    </div>
  )
}

export default Projects