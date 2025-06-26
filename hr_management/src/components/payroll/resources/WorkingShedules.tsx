"use client"
import HeaderBottom from "@/components/home/HeaderBottom"
import { trpc } from "@/trpc/client"
import { useSearchParams } from "next/navigation"
// import { useState } from "react"
import WorkingSheduleListView from "./WorkingSheduleListView"

const WorkingShedules = () => {
    // const [isOpenView, setIsOpenView] = useState(false)
    const searchParams = useSearchParams()
    let page = Number(searchParams.get("/countries/page"))
    let perPage = Number(searchParams.get("/countries/perPage"))
    if(page < 1) page=1 ;
    if(perPage < 1) perPage=9;
    
    const [{workShedulesPage, totalPages}] = trpc.settings.getAllWorkingShedulesPage.useSuspenseQuery({page, perPage})
  return (
    <div className='flex flex-col w-full'>
        <HeaderBottom setSelectedIds={()=> {}} selectedIds={[]} page={page} perPage={perPage} totalPages={totalPages} title="Working Shedules" />
        <WorkingSheduleListView selectedFilters={[]} data={workShedulesPage.map((item)=>({
          ...item,
          work_shedule_name:item.work_shedule_name ?? "",
          work_time_rate:item.work_time_rate ?? 0
        }))
           ?? []}/>
    </div>
  )
}

export default WorkingShedules