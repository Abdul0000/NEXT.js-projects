import Loading from "@/components/Loading";
import StructureForm from "@/components/payroll/salary-structures/StructureForm"
import { createTRPCContext } from "@/trpc/init";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

type Props = {
  params: Promise<{ structure_id: string }>
}
const page = async({params}:Props) => {
  const {session} =await createTRPCContext()     
  if(!session){
      return(<p>Need to Login or Register</p>)
    } ; 
  const {structure_id} =await params
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.payroll.getOneSalaryStructure?.queryOptions({ structureId: structure_id }))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
        <StructureForm structure_id ={structure_id}/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page