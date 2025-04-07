import { getcurrent } from "@/features/actions"
import { redirect } from "next/navigation"
import WorkspaceIdPageClient from "./client"

const WorkspaceIdPage = async() => {
    const user = await getcurrent()
    if (!user){
      redirect("/sign-in")
    }
  return (
    
    <WorkspaceIdPageClient/>
    
  )
}

export default WorkspaceIdPage 