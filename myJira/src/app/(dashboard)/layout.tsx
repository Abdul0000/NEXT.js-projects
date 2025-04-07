import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getcurrent } from "@/features/actions";
import CreateProjectModal from "@/features/projects/components/createProjectModal";
import CreateTaskModal from "@/features/tasks/components/createTaskModal";
import EditTaskModal from "@/features/tasks/components/editTaskModal";
import CreateWorkspaceModal from "@/features/workspaces/components/createWorkspaceModal";
import { redirect } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react"


interface DashboardLayoutProps{
    children:React.ReactNode;
}
const DashboardLayout = async({children}:DashboardLayoutProps) => {
    const user =await getcurrent()
    if (!user) redirect("/sign-in")
  return (
    <NuqsAdapter>
    <div className="min-h-screen">
        <CreateWorkspaceModal/>
        <CreateProjectModal/>
        <CreateTaskModal/>
        <EditTaskModal/>

        <div className="flex w-full h-full">
            <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
                <Sidebar/>
            </div>
            <div className="lg:pl-[264px] w-full">
                <div className="max-w-screen-2xl mx-auto h-full">
                    <Navbar/>
                    <main className="h-full py-8 px-6 flex flex-col">
                        <Toaster/>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    </div>
    </NuqsAdapter>
  )
}

export default DashboardLayout