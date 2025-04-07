"use client"
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { redirect } from "next/navigation"

const Home = () => {
    const { data: workspaces } = useGetWorkspaces()
    if(!workspaces) return null
    if(workspaces.total === 0){
        redirect("/workspaces/create")
    }
    else{
        redirect(`/workspaces/${workspaces.documents[0].$id}`)
    }
}

export default Home
// // import HomeClient from "./client";

// import { redirect } from "next/navigation"

//  const  Home = () =>{
//   redirect("/sign-in")
// }

// export default Home
// // 