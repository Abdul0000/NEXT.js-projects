import Loading from "@/components/Loading";
import Structures from "@/components/payroll/salary-structures/Structures"
import { createTRPCContext } from "@/trpc/init";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { Suspense } from "react";


const page = async() => {
  const {session} =await createTRPCContext()
        
  if(!session){
      return(<p>Need to Login or Register</p>)
    } ; 
  const searchParams = new URLSearchParams((await headers()).get("x-search-params") || "");
  
  let page = Number(searchParams.get("/salary-structures/page"));
  page = isNaN(page) || page < 1 ? 1 : page;

  let perPage = Number(searchParams.get("/salary-structures/perPage"));
  perPage = isNaN(perPage) || perPage < 1 ? 8 : perPage;
  
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.payroll.getAllSalaryStructurePage?.queryOptions({page,perPage}))
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
        <Structures/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page