import { z } from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus,{ required_error: "Required"}),
    assigneeId: z.string().trim().min(1, "Required"),
    projectId: z.string().trim().min(1, "Required"),
    workspaceId: z.string().trim().min(1, "Required"),
    dueDate: z.coerce.date(),
})

export const updateTaskSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus,{ required_error: "Required"}),
    assigneeId: z.string().trim().min(1, "Required"),
    projectId: z.string().trim().min(1, "Required"),
    workspaceId: z.string().trim().min(1, "Required"),
    dueDate: z.coerce.date(),
})