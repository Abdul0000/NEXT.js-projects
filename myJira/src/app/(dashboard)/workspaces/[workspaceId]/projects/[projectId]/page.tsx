
import { getcurrent } from '@/features/actions'
import { redirect } from 'next/navigation'
import ProjectClientId from './client'


const ProjectPage = async() => {
  const user = await getcurrent()
  if (!user){
    redirect("/sign-in")
  }
  
  return (
      <ProjectClientId/>
  )
}

export default ProjectPage