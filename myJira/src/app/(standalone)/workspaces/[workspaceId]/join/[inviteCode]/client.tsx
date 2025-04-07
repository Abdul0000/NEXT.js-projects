"use Client"
import PageLoader from '@/components/pageLoader'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import JoinWorkspaceForm from '@/features/workspaces/components/joinWorkspaceForm'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { redirect } from 'next/navigation'

const WorkspaceIdJoinPageClient = () => {
    const workspaceId =  useWorkspaceId()
    const { data, isPending } = useGetWorkspace({workspaceId})
    if(!data) redirect("/")
    if(isPending){
        return <PageLoader/>
    }
    return (
        <div className='w-full lg:max-w-xl'>
            <JoinWorkspaceForm initialValues={{name:data.name}}/>
        </div>
    )
}

export default WorkspaceIdJoinPageClient