"use server"

import { cookies } from "next/headers"
import { Account, Client } from "node-appwrite" 
import { AUTH_COOKIE } from "./auth/constants"

export const getcurrent = async()=>{
    try{
    const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

    const cookieStore = await cookies(); 
    const session = cookieStore.get(AUTH_COOKIE);
    if(!session){
        return null
    }
    client.setSession(session.value)
    const account = new Account(client)
    const user= await account.get()
    return user
}
catch
{
    return null
}
}