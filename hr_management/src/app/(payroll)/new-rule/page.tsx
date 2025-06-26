import SalaryRuleForm from "@/components/payroll/rules/SalaryRuleForm"
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
  void queryClient.prefetchQuery(trpc.payroll.getAllSalaryStructure?.queryOptions())
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
        <SalaryRuleForm/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page