import { getcurrent } from '@/features/actions'
import MembersList from '@/features/workspaces/components/members-list'
import { redirect } from 'next/navigation'

const WorkspaceIdMembersPage = async() => {
    const user =await getcurrent()
    if(!user) redirect("/sign-in")
  return (
    <div className='w-full lg:max-w-xl'>
        <MembersList/>
    </div>
  )
}

export default WorkspaceIdMembersPage