// "use client";

import { createTRPCContext } from "@/trpc/init";

import Dashboard from "@/components/auth/Dashboard";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

export default async function DashboardPage() {

  const {session} =await createTRPCContext()
  if(!session){
    return(<p>Need to Login or Register</p>)
  } ; 
  // await trpc.getUser.getMe?.prefetch()

  return (
    <Dashboard session={session}/>
  );
}