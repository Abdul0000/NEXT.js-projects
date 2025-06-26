import DepartmentMain from "@/components/department/DepartmentMain"
import { getQueryClient, trpc } from "@/trpc/server"
import { headers } from "next/headers";
import { createTRPCContext } from "@/trpc/init";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import Loading from "@/components/Loading";

const page = async() => {
  const {session} =await createTRPCContext()
        
  if(!session){
    return(<p>Need to Login or Register</p>)
  } ;
    
  const searchParams = new URLSearchParams((await headers()).get("x-search-params") || "");
    
  let page = Number(searchParams.get("/contracts/page"));
  page = isNaN(page) || page < 1 ? 1 : page;

  let perPage = Number(searchParams.get("/contracts/perPage"));

  perPage = isNaN(perPage) || perPage < 1 ? 8 : perPage;

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.departments.getAllDepartments?.queryOptions({ page, perPage }))
  void queryClient.prefetchQuery(trpc.getEmployees.getAllEmployees?.queryOptions({ page, perPage }))
 
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
        <DepartmentMain/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page