import { Models } from "node-appwrite";

export enum TaskStatus {
    BACKLOG = 'BACKLOG',
    IN_PROGRESS = 'IN_PROGRESS',
    IN_REVIEW = 'IN_REVIEW',
    DONE = 'DONE',
    TODO = 'TODO',
}
export type Task = Models.Document &{
    name: string;
    status: TaskStatus;
    assigneeId: string;
    dueDate: string;
    projectId: string;
    position: number;
    workspaceID: string;
    taskId: string;
    description?:string;
}