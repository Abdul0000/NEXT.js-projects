import Loading from '@/components/Loading';
import WorkingSheduleForm from '@/components/payroll/resources/WorkingSheduleForm';
import { createTRPCContext } from '@/trpc/init';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ shedule_id: string }>
}
const page = async({params}:Props) => {
  const {session} =await createTRPCContext()     
  if(!session){
      return(<p>Need to Login or Register</p>)
    } ; 
  const {shedule_id} =await params
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.settings.getOneWorkingShedule?.queryOptions({shedule_id}))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
        <WorkingSheduleForm title='Working Shedules' shedule_id={shedule_id}/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page