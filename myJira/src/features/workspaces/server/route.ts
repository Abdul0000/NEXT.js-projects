import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkSpaceSchema, updateWorkSpaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middware";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, TASKS_ID, WORKSPACE_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMemeber } from "@/features/members/utils";
import { unauthorized } from "next/navigation";
import { z } from "zod";
import { Workspace } from "../types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app= new Hono()
    .get("/",sessionMiddleware,async(c)=>{
        const user = c.get("user")
        const databases = c.get("databases")
        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("userId",user.$id)]
        )
        if (members.total === 0) {
            return c.json({ data: { documents: [], total: 0 } });
        }        
        const workspaceIds= members.documents.map((member)=> member.workspaceId)
        const workspaces = await databases.listDocuments<Workspace>(
            DATABASE_ID,
            WORKSPACE_ID,
            [
                Query.orderDesc("$createdAt"),
                Query.contains("$id",workspaceIds)
            ]
        )
        
        // if(workspaces)
        // {
        return c.json({data: workspaces})
        // }
        
    })
    .get("/:workspaceId",sessionMiddleware,async(c)=>{
        const databases  = c.get("databases")
        const user = c.get("user")
        const { workspaceId } = c.req.param()
        const member =await getMemeber({
            databases,
            userId:user.$id,
            workspaceId,
        }) 
        if(!member){
            return c.json({error:"Unauthorized"}, 401)
        }
        const workspace =await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACE_ID,
                workspaceId
            )
    
        return c.json({data: workspace})
    })
    .get("/:workspaceId/info",sessionMiddleware,async(c)=>{
        const databases  = c.get("databases")
        const { workspaceId } = c.req.param()
        
        const workspace =await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACE_ID,
                workspaceId
            )
        return c.json({data: {name:workspace.name, $id: workspace.$id, image: workspace.imageUrl}})
    })
    .post(
        "/",zValidator("form",createWorkSpaceSchema),sessionMiddleware,
        async(c)=>{
            const databases= c.get("databases")
            const storage= c.get("storage")
            const user= c.get("user")

            const { name, image }= c.req.valid("form")
            let uploadImageUrl: string = ""
            if (image instanceof File){
                const file =await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image
                )
                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    file.$id
                )
                uploadImageUrl= `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
            }

            const workspace= await databases.createDocument(
                DATABASE_ID,
                WORKSPACE_ID,
                ID.unique(),
                {name,userId:user.$id,imageUrl:uploadImageUrl,inviteCode:generateInviteCode(10)},
            )
            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    userId:user.$id,
                    workspaceId:workspace.$id,
                    role:MemberRole.ADMIN
                }
            )
            return c.json({
                data:workspace
            })
        }
    )
    .patch("/:workspaceId",sessionMiddleware,zValidator("form",updateWorkSpaceSchema),
        async(c)=>{
            const databases = c.get("databases")
            const storage = c.get("storage")
            const user = c.get("user")

            const { workspaceId } = c.req.param()
            const { name, image } = c.req.valid("form")

            const member =await getMemeber(
               { 
                databases,
                workspaceId,
                userId:user.$id,
                }
            )
            if(!member || member.role !== MemberRole.ADMIN){
                c.json({error:unauthorized},401)
            }

            let uploadImageUrl: string = ""
            if (image instanceof File){
                const file =await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image
                )
                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    file.$id
                )
                uploadImageUrl= `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
            }
            else
            {
                uploadImageUrl= image ?? ""
            }

            const workspace = await databases.updateDocument(
                DATABASE_ID,
                WORKSPACE_ID,
                workspaceId,
                {
                    name,
                    imageUrl: uploadImageUrl
                }
            )
        return c.json({data: workspace})
        })
    .delete('/:workspaceId',sessionMiddleware,async(c)=>{
    
        const databases = c.get("databases")
        const user = c.get("user")
        const { workspaceId } = c.req.param()
        
        const member = await getMemeber({
            databases,
            workspaceId,
            userId:user.$id,
        })
        if(!member || member.role !== MemberRole.ADMIN){
            throw new Error("Unauthorized")
        }
        await databases.deleteDocument(
            DATABASE_ID, 
            WORKSPACE_ID, 
            workspaceId,
        );
        return c.json({data: {id: workspaceId}})
    })
    .post('/:workspaceId/reset-invite-code',sessionMiddleware,async(c)=>{
    
        const databases = c.get("databases")
        const user = c.get("user")
        const { workspaceId } = c.req.param()
        
        const member = await getMemeber({
            databases,
            workspaceId,
            userId:user.$id,
        })
        if(!member || member.role !== MemberRole.ADMIN){
            throw new Error("Unauthorized")
        }
        const workspace = await databases.updateDocument(
            DATABASE_ID, 
            WORKSPACE_ID, 
            workspaceId,
            {
                inviteCode: generateInviteCode(10)
            }
        );
        return c.json({data: workspace})
    })
    .post("/:workspaceId/join",sessionMiddleware,zValidator("json", z.object({code: z.string()})),
    async(c)=>{
        const { workspaceId } = c.req.param()
        const { code } = c.req.valid("json")
        const databases = c.get("databases")
        const user = c.get("user")
        const member = await getMemeber({
            databases,
            workspaceId,
            userId:user.$id
        })
        if(member){
            return c.json({error:"Already a memeber"},400)
        }
        const workspace = await databases.getDocument(
            DATABASE_ID, 
            WORKSPACE_ID, 
            workspaceId,)

        if(workspace.inviteCode !== code){
            return c.json({error:"Invalid invite code"},400)
        }
        
        await databases.createDocument(
            DATABASE_ID, 
            MEMBERS_ID, 
            ID.unique(),
            {
                workspaceId,
                userId: user.$id,
                role: MemberRole.MEMBER
            }
        );
        return c.json({data: workspace})
        }
    )
    .get("/:workspaceId/analytics",sessionMiddleware,async(c)=>{
        const databases = c.get("databases")
        const user = c.get("user")
        const { workspaceId } = c.req.param()

        const member =await getMemeber({
            databases,
            userId:user.$id,
            workspaceId,
        }) 
        if(!member){
            return c.json({error: "Unauthorized"}, 401)
        }
        const now= new Date()
        const thisMonthStart= startOfMonth(now)
        const thisMonthEnd= endOfMonth(now)
        const lastMonthStart= startOfMonth(subMonths(now, 1))
        const lastMonthEnd= endOfMonth(subMonths(now, 1))
        //monthly tasks
        const thisMonthTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),

            ]
        )

        const lastMonthTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),

            ]
        )

        const taskCount = thisMonthTasks.total
        const taskDifference = taskCount - lastMonthTasks.total
        
        //assigned tasks
        const thisMonthAssignedTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                Query.equal("assigneeId", member.$id)
            ]
        )

        const lastMonthAssignedTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                Query.equal("assigneeId", member.$id)
            ]
        )

        const assignedTaskCount = thisMonthAssignedTasks.total
        const assignedTaskDiff = assignedTaskCount - lastMonthAssignedTasks.total

        //incomplete tasks
        const thisMonthIncompleteTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.notEqual("status", TaskStatus.DONE),
                Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
            ]
        )

        const lastMonthIncompleteTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.notEqual("status", TaskStatus.DONE),
                Query.equal("workspaceId", workspaceId),
                Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
            ]
        )
        const incompleteTaskCount = thisMonthIncompleteTasks.total
        const incompleteTaskDiff = incompleteTaskCount - lastMonthIncompleteTasks.total

        //complete tasks
        const thisMonthCompleteTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.equal("status", TaskStatus.DONE),
                Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
            ]
        )

        const lastMonthCompleteTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal("status", TaskStatus.DONE),
                Query.equal("workspaceId", workspaceId),
                Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
            ]
        )
        const completeTaskCount = thisMonthCompleteTasks.total
        const completeTaskDiff = completeTaskCount - lastMonthCompleteTasks.total

        //Overdue tasks
        const thisMonthOverdueTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.notEqual("status", TaskStatus.DONE),
                Query.lessThan("dueDate", now.toISOString()),
                Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
            ]
        )

        const lastMonthOverdueTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.notEqual("status", TaskStatus.DONE),
                Query.lessThan("dueDate", now.toISOString()),
                Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
            ]
        )
        const overdueTaskCount = thisMonthOverdueTasks.total
        const overdueTaskDiff = overdueTaskCount - lastMonthOverdueTasks.total
        return c.json({data: {
            taskCount,
            taskDifference,
            assignedTaskCount,
            assignedTaskDiff,
            completeTaskCount,
            completeTaskDiff,
            incompleteTaskCount,
            incompleteTaskDiff,
            overdueTaskCount,
            overdueTaskDiff
        }})
        })
    

export default app;