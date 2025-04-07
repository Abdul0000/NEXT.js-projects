import { Models } from "node-appwrite";

export type project = Models.Document &{
    name: string;
    imageUrl:string;
    workspaceId:string;
}