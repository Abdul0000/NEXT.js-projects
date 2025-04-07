import "server-only"
import { Client, Account, Users, Databases } from "node-appwrite"
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/features/auth/constants";

export function createAdminCient(){
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        .setKey(process.env.NEXT_APPWRITE_KEY!)
    const users= new Users(client)
    return {
        get account(){
            return new Account(client);
        },
        users
    }
}

export async function createClientSession(){
     const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        
        const cookieStore = await cookies(); // ✅ Await the promise first
        const session = cookieStore.get(AUTH_COOKIE); // ✅ Then access .get()

        if(!session || !session.value){
            throw new Error("Unauthorized")
        }
        client.setSession(session.value)
        const databases = new Databases(client)
        const account = new Account(client)
        return {
            databases,
            account
        }
}