import Loading from '@/components/Loading';
import SalaryStructureTypeForm from '@/components/payroll/salary-structures/SalaryStructureTypeForm'
import { createTRPCContext } from '@/trpc/init';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ structureTypeId: string }>
}
const page = async({params}:Props) => {
  const {session} =await createTRPCContext()     
  if(!session){
      return(<p>Need to Login or Register</p>)
    } ; 
  const {structureTypeId} =await params
  const queryClient = getQueryClient()
  // Provide all required fields as per the query's input type
  // Replace the placeholder values with actual data as needed
  void queryClient.prefetchQuery(
    trpc.payroll.getOneSalaryStructuretype?.queryOptions({id:structureTypeId})
  )
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
        <SalaryStructureTypeForm title='Salary Structure Type' structureTypeId={structureTypeId}/>
      </Suspense>
    </HydrationBoundary>

  )
}

export default page