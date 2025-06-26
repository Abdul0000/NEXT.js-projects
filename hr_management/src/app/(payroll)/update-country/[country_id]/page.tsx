import Loading from "@/components/Loading";
import CountryForm from "@/components/payroll/countries/CountriesForm";
import SalaryRuleForm from "@/components/payroll/rules/SalaryRuleForm";
import { createTRPCContext } from "@/trpc/init";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

type Props = {
  params: Promise<{ country_id: string }>
}
const page = async({params}:Props) => {
    const {session} =await createTRPCContext()     
    if(!session){
      return(<p>Need to Login or Register</p>)
    } ; 
    const {country_id} = await params
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.settings.getOneCountry?.queryOptions({
        id:country_id
    }))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
        <CountryForm country_id={country_id} title="Countries"/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page