"use client"

import { Toaster } from "@/components/ui/sonner"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import EditWorkspaceForm from "@/features/workspaces/components/editWorkspaceFrom"
import PageLoader from "@/components/pageLoader";
import { redirect } from "next/navigation";

const WorkspaceIdSettingsPageClient = () => {
    const  workspaceId  = useWorkspaceId();
    const {data: initialValues, isPending} = useGetWorkspace({workspaceId})
    if (isPending) return <PageLoader />;
    if (!initialValues) return null;
    if(!initialValues){
         redirect(`/workspaces/${workspaceId}`)
    }

  return (
    <div className='md:w-[85vh]'>
        <Toaster/>
        <EditWorkspaceForm initialValues={initialValues}/>
    </div>
  )
}

export default WorkspaceIdSettingsPageClient