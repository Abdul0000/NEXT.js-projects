import EmployeeContracts from "@/components/employee-contracts/EmployeeContracts"
import Loading from "@/components/Loading";
import { createTRPCContext } from "@/trpc/init";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { Suspense } from "react";

const page = async() => {
  const {session} =await createTRPCContext()
   
  if(!session){
    return(<p>Need to Login or Register</p>)
  } ; 

  const queryClient = getQueryClient();

  const searchParams = new URLSearchParams((await headers()).get("x-search-params") || "");
  
  let page = Number(searchParams.get("/contracts/page"));
  page = isNaN(page) || page < 1 ? 1 : page;

  let perPage = Number(searchParams.get("/contracts/perPage"));

  perPage = isNaN(perPage) || perPage < 1 ? 8 : perPage;

  void queryClient.prefetchQuery(trpc.employeeContracts.getAllContracts.queryOptions({page, perPage}))
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
        <EmployeeContracts/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page