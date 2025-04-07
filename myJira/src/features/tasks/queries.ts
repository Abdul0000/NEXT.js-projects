import { createClientSession } from "@/lib/appwrite"
import { Task } from "./types"
import { DATABASE_ID, TASKS_ID } from "@/config"
import { getMemeber } from "../members/utils"

interface getTaskProps{
    taskId:string
}
export const getTask = async({ taskId }:getTaskProps )=>{
    try{
    const { account, databases } = await createClientSession()
    const user =await account.get()
    const task =await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
    )
    const member =await getMemeber({
        databases,
        userId:user.$id,
        workspaceId:task.workspaceId,
    }) 
    if(!member){
        return null
    }
   
    return task
}
catch
{
    return null
}
}