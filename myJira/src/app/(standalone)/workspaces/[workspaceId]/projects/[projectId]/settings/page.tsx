import { getcurrent } from '@/features/actions'
import { redirect } from 'next/navigation'
import ProjectIdSettingsClientPage from './client'

const ProjectIdSettingsPage = async() => {
    const user = await getcurrent()
    if (!user) redirect("/sign-in")
      
  return (
   <ProjectIdSettingsClientPage/>
  )
}

export default ProjectIdSettingsPage