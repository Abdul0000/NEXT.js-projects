"use client"

import Analytics from "@/components/analytics"
import PageLoader from "@/components/pageLoader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useGetMembers } from "@/features/members/api/use-get-members"
import MemeberAvatar from "@/features/members/components/memberAvatar"
import { Member } from "@/features/members/types"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import ProjectAvatar from "@/features/projects/components/projectAvatar"
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal"
import { project } from "@/features/projects/types"
import { useGetTasks } from "@/features/tasks/api/use-get-tasks"
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal"
import { Task } from "@/features/tasks/types"
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-anaylitics"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"

const WorkspaceIdPageClient = () => {
  const workspaceId = useWorkspaceId()
  const { data: analytics, isPending: isPendingAnalytics } = useGetWorkspaceAnalytics({workspaceId})
  const { data: projects, isPending: isPendingProjects } = useGetProjects({workspaceId})
  const { data: tasks, isPending: isPendingTasks } = useGetTasks({workspaceId})
  const { data: members, isPending: isPendingMembers } = useGetMembers({workspaceId})

  const isLoading = isPendingAnalytics || isPendingProjects || isPendingTasks || isPendingMembers
  console.log("Members :", members)
  if(isLoading) return <PageLoader/>
  if(!analytics || !projects || !tasks || !members) return null
  return (
    <div className="flex flex-col h-full space-y-4">
      <Analytics data={analytics}/>
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-4">
      <TaskList data={tasks.documents} total={tasks.total} />
      <ProjectsList data={projects.documents} total={projects.total}/>
      <MembersList data={members.documents} total={members.total}/>

      </div>
    </div>
  )
}
export default WorkspaceIdPageClient
interface TaskListProps{
  data: Task[];
  total: number;
}
export const TaskList = ({data, total}: TaskListProps)=> {
  const workspaceId = useWorkspaceId()
  const {open:createTask} = useCreateTaskModal()
    return(
      <div className="flex flex-col gap-y-4 col-span-1">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">
              Tasks ({total})
            </p>
            <Button variant="muted" size="icon" onClick={createTask}>
              <PlusIcon className="size-4 text-neutral-400"/>
            </Button>
          </div>
          <Separator className="my-4"/>
          <ul className="flex flex-col gap-y-4">
            {
              data.map((task)=>(
                <li key={task.$id}>
                  <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                  <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                    <CardContent className="p-4">
                      <p className="text-lg truncate font-medium">{task.name}</p>
                      <div className="flex items-center gap-x-2">
                        <p>{task.project?.name}</p>
                        <div className="size-1 rounded-full bg-neutral-300"/>
                        <div className="text text-muted-foreground flex items-center">
                          <CalendarIcon className="size-3 mr-1"/>
                          <span className="truncate">
                            {formatDistanceToNow(new Date(task.dueDate))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                </li>
              ))
            }
            <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
              No tasks found
            </li>
          </ul>
          <Button variant="muted" className="mt-4 w-full" asChild>
              <Link href={`/workspaces/${workspaceId}/tasks`}>
                Show All
              </Link>
          </Button>
            </div>
      </div>
    )
}

interface ProjectsListProps{
  data: project[];
  total: number;
}
export const ProjectsList = ({data, total}: ProjectsListProps)=> {
  const workspaceId = useWorkspaceId()
  const {open:createProject} = useCreateProjectModal()
    return(
      <div className="flex flex-col gap-y-4 col-span-1">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">
              Projects ({total})
            </p>
            <Button variant="secondary" size="icon" onClick={createProject}>
              <PlusIcon className="size-4 text-neutral-400"/>
            </Button>
          </div>
          <Separator className="my-4"/>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {
              data.map((project)=>(
                <li key={project.$id}>
                  <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                  <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                    <CardContent className="p-4 flex items-center gap-x-2.5">
                      <ProjectAvatar name={project.name} image={project.imageUrl} className="text-lg"/>
                      <p className="text-lg font-medium truncate">{project.name}</p>
                    </CardContent>
                  </Card>
                  </Link>
                </li>
              ))
            }
            <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
              No projects found
            </li>
          </ul>
            </div>
      </div>
    )
}

interface MembersListProps{
  data: Member[];
  total: number;
}
export const MembersList = ({data, total}: MembersListProps)=> {
  const workspaceId = useWorkspaceId()
    return(
      <div className="flex flex-col gap-y-4 col-span-1">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">
              Members ({total})
            </p>
            <Button variant="secondary" size="icon" asChild>
              <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400"/>
              </Link>
            </Button>
          </div>
          <Separator className="my-4"/>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              data.map((member)=>(
                <li key={member.$id}>
                  <Card className="shadow-none rounded-lg overflow-hidden">
                    <CardContent className="p-3 flex flex-col items-center gap-x-2">
                      <MemeberAvatar name={member.name} className="text-lg"/>
                      <div className="flex flex-col items-center overflow-hidden">
                      <p className="text-lg font-medium line-clamp-1">{member.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{member.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))
            }
            <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
              No members found
            </li>
          </ul>
            </div>
      </div>
    )
}