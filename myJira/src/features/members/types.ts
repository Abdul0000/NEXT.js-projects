import { Models } from "node-appwrite";

export enum MemberRole {
    ADMIN= "ADMIN",
    MEMBER="MEMBER"
}

export type Member = Models.Document & {
    name: string;
    email: string;
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    workspaceId: string;
    userId: string;
    role: MemberRole;
}