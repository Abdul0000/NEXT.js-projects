import SalaryStructureTypeForm from "@/components/payroll/salary-structures/SalaryStructureTypeForm"
import { getQueryClient, trpc } from "@/trpc/server"
import { createTRPCContext } from "@/trpc/init";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import { Suspense } from "react";


const page = async() => {
  const {session} =await createTRPCContext()
        
    if(!session){
      return(<p>Need to Login or Register</p>)
    } ; 
    
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.settings.getAllCountries.queryOptions())
    void queryClient.prefetchQuery(trpc.settings.getAllWorkingShedules.queryOptions())
    void queryClient.prefetchQuery(trpc.payroll.getAllSalaryStructure.queryOptions())

  return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<Loading/>}>
        <SalaryStructureTypeForm/>
    </Suspense>
  </HydrationBoundary>
  )
}

export default page