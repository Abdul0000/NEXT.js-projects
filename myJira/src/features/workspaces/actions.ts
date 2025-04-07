"use server"

import { Query } from "node-appwrite" 
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config"
import { createClientSession } from "@/lib/appwrite"
import { Workspace } from "./types"
import { Member } from "../members/types"

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createClientSession()
    const user = await account.get()

    // Fetch members with the current user's ID
    const members = await databases.listDocuments<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("userId", user.$id)]
    )

    if (members.total === 0) {
      return { document: [], total: 0 }
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId)

    // Fetch workspaces based on workspaceIds
    const workspaces = await databases.listDocuments<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.contains("$id", workspaceIds)
      ]
    )

    // Return workspaces in the expected format
    return {
      document: workspaces.documents || [],  // Ensure a default empty array if undefined
      total: workspaces.total || 0           // Ensure a default value if undefined
    }
  } catch (error) {
    console.error('Error fetching workspaces:', error)
    return { document: [], total: 0 }
  }
}
