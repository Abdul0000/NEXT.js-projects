import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMemeber } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { project } from "../types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
    .get("/",sessionMiddleware,zValidator("query", z.object({ workspaceId: z.string()})),async(c)=>{
        const { workspaceId } = c.req.valid("query")
        const databases = c.get("databases")
        const user = c.get("user")
        const member =  await getMemeber({ databases, workspaceId, userId:user.$id })
        if(!member){
            return c.json({error: "Unauthorized"}, 401)
        }
        if(!workspaceId){
            return c.json({error: "Missing workspaceId"}, 400)
        }
        const projects = await databases.listDocuments<project>(
            DATABASE_ID,
            PROJECTS_ID,
            [
                Query.equal("workspaceId",workspaceId),
                Query.orderDesc("$createdAt"),
            ]

        )
        // if(projects.total === 0){
        //     return c.json({data:{documents:[],total:0}})
        // }
        return c.json({data: projects})
    })
    .get("/:projectId",sessionMiddleware,async(c)=>{
        const databases = c.get("databases")
        const user = c.get("user")
        const { projectId } = c.req.param()

        const project =await databases.getDocument<project>(
            DATABASE_ID,
            PROJECTS_ID,
            projectId
        )
        const member =await getMemeber({
            databases,
            userId:user.$id,
            workspaceId:project.workspaceId,
        }) 
        if(!member){
            return c.json({error: "Unauthorized"}, 401)
        }

        return c.json({data: project})
        })
    .post(
        "/",zValidator("form",createProjectSchema),sessionMiddleware,
        async(c)=>{
            const databases= c.get("databases")
            const storage= c.get("storage")
            const user= c.get("user")
            const { name, image, workspaceId }= c.req.valid("form")
            const member = await getMemeber({ databases, workspaceId, userId:user.$id })
            if (!member){
               return c.json({error: "Unauthorized"}, 401)
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

            const project= await databases.createDocument(
                DATABASE_ID,
                PROJECTS_ID,
                ID.unique(),
                {workspaceId,name,imageUrl:uploadImageUrl},
            )
           
            return c.json({
                data:project
            })
        }
    )
    .patch("/:projectId",sessionMiddleware,zValidator("form",updateProjectSchema),
        async(c)=>{
            const databases = c.get("databases")
            const storage = c.get("storage")
            const user = c.get("user")
            const { name, image } = c.req.valid("form")
            const { projectId } = c.req.param()

            const exsistingProject = await databases.getDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectId
            )

            const member =await getMemeber(
                { 
                databases,
                workspaceId:exsistingProject.workspaceId,
                userId:user.$id,
                }
            )
            if(!member){
                c.json({error:"Unauthorized"},401)
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

            const project = await databases.updateDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectId,
                {
                    name,
                    imageUrl: uploadImageUrl
                }
            )

        return c.json({$id: project.$id})
        })
    .delete("/:projectId",sessionMiddleware,
        async(c)=>{
            const databases = c.get("databases")
            const user = c.get("user")
            const { projectId } = c.req.param()

            const exsistingProject = await databases.getDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectId
            )

            const member =await getMemeber(
                { 
                databases,
                workspaceId:exsistingProject.workspaceId,
                userId:user.$id,
                }
            )
            if(!member){
                c.json({error:"Unauthorized"},401)
            }

            await databases.deleteDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectId
            )

        return c.json({$id:exsistingProject.$id})
        })
    .get("/:projectId/analytics",sessionMiddleware,async(c)=>{
            const databases = c.get("databases")
            const user = c.get("user")
            const { projectId } = c.req.param()
    
            const project =await databases.getDocument<project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectId
            )
            const member =await getMemeber({
                databases,
                userId:user.$id,
                workspaceId:project.workspaceId,
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
                    Query.equal("projectId", projectId),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),

                ]
            )

            const lastMonthTasks = await databases.listDocuments(
                DATABASE_ID,
                TASKS_ID,
                [
                    Query.equal("projectId", projectId),
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
                    Query.equal("projectId", projectId),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                    Query.equal("assigneeId", member.$id)
                ]
            )

            const lastMonthAssignedTasks = await databases.listDocuments(
                DATABASE_ID,
                TASKS_ID,
                [
                    Query.equal("projectId", projectId),
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
                    Query.equal("projectId", projectId),
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
                    Query.equal("projectId", projectId),
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
                    Query.equal("projectId", projectId),
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
                    Query.equal("projectId", projectId),
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
                    Query.equal("projectId", projectId),
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
                    Query.equal("projectId", projectId),
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

export default app