import Main from "@/components/home/Main";
import Loading from "@/components/Loading";
import { createTRPCContext } from "@/trpc/init";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { Suspense } from "react";

const Page = async () => {

  const {session} =await createTRPCContext()
  if(!session){
    return(<p>Need to Login or Register</p>)
  } ; 
  
  const searchParams = new URLSearchParams((await headers()).get("x-search-params") || "");

  let page = Number(searchParams.get("/employees/page"));
  page = isNaN(page) || page < 1 ? 1 : page;

  let perPage = Number(searchParams.get("/employees/perPage"));
  perPage = isNaN(perPage) || perPage < 1 ? 8 : perPage;

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.getEmployees.getAllEmployees?.queryOptions({page, perPage}))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading/>}>
        <div className="flex flex-col h-screen">
          <Main />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
