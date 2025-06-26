import EmployeeContractForm from "@/components/employee-contracts/EmployeeContractForm";
import Loading from "@/components/Loading";
import { createTRPCContext } from "@/trpc/init";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

type Props = {
  params: Promise<{ contract_id: string }>
}
// interface Props {
//   // params: { contract_id: string };
//   params: Promise<{ id: string | undefined }>;
// }

const Page = async ({ params }: Props) => {
  const {session} =await createTRPCContext()
  
    if(!session){
    return(<p>Need to Login or Register</p>)
  } ; 
  const { contract_id } =await params;
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.employeeContracts.getOneContract?.queryOptions({ id:contract_id }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
      <EmployeeContractForm contract_id={contract_id} title="contract"/>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
