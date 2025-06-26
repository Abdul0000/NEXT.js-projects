import Loading from "@/components/Loading";
import SalaryRuleForm from "@/components/payroll/rules/SalaryRuleForm";
import { createTRPCContext } from "@/trpc/init";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

type Props = {
  params: Promise<{ rule_id: string }>
}
const page = async({params}:Props) => {
    const {session} =await createTRPCContext()     
    if(!session){
      return(<p>Need to Login or Register</p>)
    } ; 
    const {rule_id} = await params
    const queryClient  = getQueryClient()
    void queryClient.prefetchQuery(trpc.payrollSalaryRule.getOneSalaryRule?.queryOptions({id:rule_id}))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
        <SalaryRuleForm rule_id={rule_id} />
      </Suspense>
    </HydrationBoundary>
  )
}

export default page