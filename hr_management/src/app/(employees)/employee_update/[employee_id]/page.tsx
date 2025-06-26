import Loading from "@/components/Loading";
import EmployeeForm from "@/components/new-employee/EmployeeForm";
import { createTRPCContext } from "@/trpc/init";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

type Props = {
  params: Promise<{ employee_id: string }>
}

const Page = async ({ params }: Props) => {
  const {session} =await createTRPCContext()
  if(!session){
    return(<p>Need to Login or Register</p>)
  } ; 
  const { employee_id } =await params;
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.getEmployees.getOneEmployee.queryOptions({ id:employee_id }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
      <EmployeeForm employee_id={employee_id} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
