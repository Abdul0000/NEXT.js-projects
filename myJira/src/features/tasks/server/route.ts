import { sessionMiddleware } from "@/lib/session-middware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { getMemeber } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Task, TaskStatus } from "../types";
import { createAdminCient } from "@/lib/appwrite";
import { project } from "@/features/projects/types";

const app = new Hono()
    .get("/",sessionMiddleware, zValidator("query",z.object(
        {
            workspaceId: z.string(),
            projectId: z.string().nullish(),
            assigneeId:z.string().nullish(),
            status: z.nativeEnum(TaskStatus).nullish(),
            dueDate:z.string().nullish(),
            search:z.string().nullish(),
        }
    )) ,async (c) => {
        const { users } = createAdminCient()
        const databases = c.get("databases")
        const user = c.get("user")
        const { workspaceId, projectId, assigneeId, status, dueDate, search } = c.req.valid("query")
        const member = await getMemeber({
            databases,
            workspaceId,
            userId: user.$id,
        })
        if(!member){
            return c.json({error:"Unauthorized"}, 401)
        }
        const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt")
        ]
        if(projectId){
            query.push(Query.equal("projectId", projectId))
        }
        if(assigneeId){
            query.push(Query.equal("assigneeId", assigneeId))
        }
        if(status){
            query.push(Query.equal("status", status))
        }
        if(dueDate){
            query.push(Query.equal("dueDate", dueDate))
        }
        if(search){
            query.push(Query.search("name",search))
        }
        const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, query)

        const projectIds = tasks.documents.map((task) => task.projectId)
        const assigneeIds = tasks.documents.map((task) => task.assigneeId)

        const projects = await databases.listDocuments<project>(DATABASE_ID, PROJECTS_ID, 
            projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
        )
        const members = await databases.listDocuments<project>(DATABASE_ID, MEMBERS_ID, 
            assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
        )
        const assignees = await Promise.all(members.documents.map(async (member) => {
            const user = await users.get(member.userId)
            return {
                ...member,
                name: user.name,
                email: user.email,}
        }))
        const popultedTasks = tasks.documents.map((task) => {
            const project = projects.documents.find((project) => project.$id === task.projectId)
            const assignee = assignees.find((assignee) => assignee.$id === task.assigneeId)
            return {
                ...task,
                project,
                assignee
            }
        })
        return c.json({data:{...tasks, documents: popultedTasks}})
    })
    .post("/",sessionMiddleware,zValidator('json', createTaskSchema), async (c) => {
        const databases = c.get("databases")   
        const user = c.get("user")
        const {
            name,
            workspaceId,
            dueDate,
            assigneeId,
            status,
            projectId,
        } = c.req.valid("json")
        const member = await getMemeber({
            databases,
            workspaceId,
            userId: user.$id,
        })
        if(!member){
            return c.json({error:"Unauthorized"}, 401)
        }
        const highestPositionTask = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.equal("status", status),
                Query.orderAsc("position"),
                Query.limit(1)
            ]
        )
        const newPosition = highestPositionTask.documents.length > 0 
            ? highestPositionTask.documents[0].position + 1000 : 1000
        const task = await databases.createDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            ID.unique(),
            {
                name,
                workspaceId,
                dueDate,
                assigneeId,
                status,
                projectId,
                position: newPosition
            })
        return c.json({data: task})
    })
    .patch("/:taskId",sessionMiddleware,zValidator('json', createTaskSchema.partial()), async (c) => {
        const databases = c.get("databases")   
        const { taskId } = c.req.param()
        const user = c.get("user")
        const {
            name,
            description,
            dueDate,
            assigneeId,
            status,
            projectId,
        } = c.req.valid("json")
        const task =await databases.getDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            taskId
        )
        const member = await getMemeber({
            databases,
            workspaceId: task.workspaceId,
            userId: user.$id,
        })
        if(!member){
            return c.json({error:"Unauthorized"}, 401)
        }
    
        const taskUpdated = await databases.updateDocument(
            DATABASE_ID,
            TASKS_ID,
            taskId,
            {
                name,
                dueDate,
                assigneeId,
                status,
                projectId,
                description
            })
        return c.json({data: taskUpdated})
    })
    .delete("/:taskId", sessionMiddleware, async(c)=>{
        const databases = c.get("databases")
        const user = c.get("user")
        const { taskId } = c.req.param()
        console.log("ID",taskId)

        const task =await databases.getDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            taskId
        )
        const member =await getMemeber(
            { databases, workspaceId: task.workspaceId, userId: user.$id }
        )
        if(!member){
            return c.json({error:"Unauthorized"}, 400)
        }

        await databases.deleteDocument(
            DATABASE_ID,
            TASKS_ID,
            taskId
        )

        return c.json({data: {$id: task.$id}})
    })
    .get("/:taskId", sessionMiddleware, async(c)=>{
        const databases = c.get("databases")
        const currentUser = c.get("user")
        const { users } = await createAdminCient()
        const { taskId } = c.req.param()

        const existingTask =await databases.getDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            taskId
        )

        const currentMember = await getMemeber({
            databases,
            workspaceId:existingTask.workspaceId,
            userId: currentUser.$id
        })

         if(!currentMember){
            return c.json({error: "Unauthorized"}, 400)
         }

        const member = await databases.getDocument(
            DATABASE_ID,
            MEMBERS_ID,
            existingTask.assigneeId
        )
        const project = await databases.getDocument<project>(
            DATABASE_ID,
            PROJECTS_ID,
            existingTask.projectId
        )
        const user = await users.get(member.userId)
        const assignee = {
            ...member,
            name: user.name,
            eamil: user.email
        }

        return c.json({data: {...existingTask, project, assignee}})
    })
    .post("/bulk-update", sessionMiddleware, zValidator("json",z.object({
        tasks:z.array(z.object({
            $id:z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(100_000_000)
        }))
    })), async(c)=>{
        const databases = c.get("databases")
        const user = c.get("user")
        const { tasks } = c.req.valid("json")
        const taskToUpdate = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.contains("$id",tasks.map((task)=> task.$id ))
            ]
        )
        const workspaceIds = new Set(taskToUpdate.documents.map(task => task.workspaceId))
        if(workspaceIds.size != 1){
            return c.json({error: "All tasks must belong to the same workpsace"})
        }

        const workspaceId = workspaceIds.values().next().value
        const member = await getMemeber({
            databases,
            workspaceId,
            userId: user.$id
        })
        if(!member){
            return c.json({error: "Unauthorized"}, 401)
        }
        const UpdatedTasks = await Promise.all(
            tasks.map(async(task)=>{
                const { $id, status, position} = task
                return databases.updateDocument<Task>(
                    DATABASE_ID,
                    TASKS_ID,
                    $id,
                    { status, position }
                )
            })
        )
         
        return c.json({data: UpdatedTasks})
    }

)

export default app