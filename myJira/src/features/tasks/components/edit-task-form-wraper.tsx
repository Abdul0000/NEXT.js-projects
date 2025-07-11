import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import EditTaskForm from "./editTaskForm";
import { useGetTask } from "../api/use-get-task";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string
}

const EditTaskFormWrapper = ({onCancel, id}: EditTaskFormWrapperProps) => {
    const workspaceId = useWorkspaceId()
    const { data: projects, isPending:isLoadingProjects } = useGetProjects({ workspaceId})
    const { data: members, isPending:isLoadingMembers } = useGetMembers({ workspaceId})
    const { data: initialValues, isPending:isLoadinginitialValues} = useGetTask({ taskId:id });

    const projectOptions = projects?.documents.map((project) => ({ id:project.$id,name: project.name, imageUrl: project.imageUrl }))  
    const memberOptions = members?.documents.map((member) => ({ id:member.$id,name: member.name }))  
    const isLoading = isLoadingProjects || isLoadingMembers || isLoadinginitialValues
    if(!initialValues) return null
    if(isLoading) {
        return (
        <Card className="w-full h-[714px] border-none shadow-none">
            <CardContent className="flex justify-center items-center h-full">
                <Loader className="size-5 animate-spin text-muted-foreground"/>
            </CardContent>
        </Card>
        )
    }

    return(
        <EditTaskForm onCancel={onCancel} projectOptions={projectOptions ?? []} memberOptions={memberOptions?? []} initialValues={initialValues ?? []}/>
    )
 
}

export default EditTaskFormWrapper