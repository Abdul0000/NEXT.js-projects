import AttendanceMain from '@/components/attendance/AttendanceMain'
import Loading from '@/components/Loading';
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import React, { Suspense } from 'react'

const page = async() => {
  const searchParams = new URLSearchParams((await headers()).get("x-search-params") || "");
      
  let page = Number(searchParams.get("/attendance/page"));
  page = isNaN(page) || page < 1 ? 1 : page;

  let perPage = Number(searchParams.get("/attendance/perPage"));

  perPage = isNaN(perPage) || perPage < 1 ? 8 : perPage;
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.employeeAttendance.getAllAttendance?.queryOptions({page, perPage}))
  return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<Loading/>}>
        <AttendanceMain/>
    </Suspense>
  </HydrationBoundary>
  )
}

export default page