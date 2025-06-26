import EmployeeForm from "@/components/new-employee/EmployeeForm"
import { getQueryClient, trpc } from "@/trpc/server"

import { createTRPCContext } from "@/trpc/init";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import Loading from "@/components/Loading";

const page = async() => {
  const {session} =await createTRPCContext()
        
  if(!session){
    return(<p>Need to Login or Register</p>)
  } ; 
  const queryClient = getQueryClient()
  const page=1
  const perPage= 8
  void queryClient.prefetchQuery(trpc.departments.getAllDepartments?.queryOptions({page, perPage}))
  void queryClient.prefetchQuery(trpc.getEmployees.getAllEmployees?.queryOptions({page, perPage}))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
        <EmployeeForm/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page