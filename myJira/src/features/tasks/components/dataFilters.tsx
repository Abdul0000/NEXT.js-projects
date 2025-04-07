"use client"
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { TaskStatus } from "../types";
import { useTaskFilters } from "../hooks/use-task-filters";
import DatePicker from "@/features/projects/components/datePicker";

interface DataFiltersProps {
  hideProjectFilter?: boolean; 
}

const DataFilters = ({hideProjectFilter}: DataFiltersProps) => {
    const workspaceId = useWorkspaceId();
    const { data: projects, isLoading:isLoadingProjects } = useGetProjects({workspaceId});
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({workspaceId});
    const isLoading = isLoadingProjects || isLoadingMembers;
    const projectsOptions = projects?.documents.map((project) => ({ label: project.name, value: project.$id }));

    const membersOptions = members?.documents.map((member)=>({label:member.name,value:member.$id}));
    const [{
      status,
      projectId,
      assigneeId,
      dueDate,
    },setFilters] = useTaskFilters();
    const onStatusChange = (value:string) => {
      if(value === "all"){
        setFilters({status: null})
        }
      else
      {
        setFilters({status: value as TaskStatus})}} 

    const onAssigneeIdChange = (value:string) => {
      if(value === "all"){
        setFilters({assigneeId: null})
        }
      else
      {
        setFilters({assigneeId: value as string})}
      } 
    const onProjectIdChange = (value:string) => {
        if(value === "all"){
          setFilters({projectId: null})
          }
        else
        {
          setFilters({projectId: value as string})}
        } 
   
    if (isLoading) {
      return null
    }
    return (
        <div className="flex flex-col gap-2 lg:flex-row">
          <Select defaultValue={status ?? undefined} onValueChange={(value)=> onStatusChange(value)}>
              <SelectTrigger className="w-full lg:w-auto h-8 cursor-pointer">
                <div className="flex items-center pr-2">
                <ListCheckIcon className="size-4 mr-2 cursor-pointer" />
                <SelectValue placeholder="All statuses"/>
                </div>
              </SelectTrigger>
              <SelectContent >
                <SelectItem className="cursor-pointer" value="all">All statuses</SelectItem>
                <SelectItem className="cursor-pointer" value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                <SelectItem className="cursor-pointer" value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                <SelectItem className="cursor-pointer" value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem className="cursor-pointer" value={TaskStatus.TODO}>Todo</SelectItem>
                <SelectItem className="cursor-pointer" value={TaskStatus.DONE}>Done</SelectItem>
              </SelectContent>
          </Select>
          <Select defaultValue={assigneeId ?? undefined} onValueChange={(value)=>onAssigneeIdChange(value)}>
              <SelectTrigger className="w-full lg:w-auto h-8 cursor-pointer">
                <div className="flex items-center pr-2">
                <UserIcon className="size-4 mr-2 cursor-pointer" />
                <SelectValue placeholder="All Assignees"/>
                </div>
              </SelectTrigger>
              <SelectContent >
                <SelectItem className="cursor-pointer" value="all">All Assignees</SelectItem>
                {membersOptions?.map((member)=>(
                  <SelectItem className="cursor-pointer" key={member.value} value={member.value}>{member.label}</SelectItem>
                ))}
              </SelectContent>
          </Select>
          {!hideProjectFilter &&
          (<Select defaultValue={projectId ?? undefined} onValueChange={(value)=>onProjectIdChange(value)}>
              <SelectTrigger className="w-full lg:w-auto h-8 cursor-pointer">
                <div className="flex items-center pr-2">
                <FolderIcon className="size-4 mr-2 cursor-pointer" />
                <SelectValue placeholder="All Projects"/>
                </div>
              </SelectTrigger>
              <SelectContent >
                <SelectItem className="cursor-pointer" value="all">All Projects</SelectItem>
                {projectsOptions?.map((project)=>(
                  <SelectItem className="cursor-pointer" key={project.value} value={project.value}>{project.label}</SelectItem>
                ))}
              </SelectContent>
          </Select>)}
          <DatePicker placeholder="Due Date" className="h-8 w-full lg:w-auto" value={dueDate ? new Date(dueDate): undefined} onChange={(date)=> setFilters({dueDate: date ? date.toISOString() : null})}/>
        </div>
    )
}

export default DataFilters