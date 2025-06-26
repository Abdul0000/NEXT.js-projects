"use client"
import React, { useState } from 'react'
import HeaderBottom from '../home/HeaderBottom'
import ListView from './ListView'
import { trpc } from '@/trpc/client'
import { useSearchParams } from 'next/navigation'
// import Loading from '../Loading'

const AttendanceMain = () => {
    // const [isOpenView, setIsOpenView] = useState(true)
    const [selectedFilters, setSelectedFilters] = useState<
        Array<"job_position" | "manager" | "department" | "status">
      >([]);
    const searchParams = useSearchParams()
    let page = Number(searchParams.get("/attendance/page"))
    let perPage =  Number(searchParams.get("/attendance/perPage"))
    if(page < 1) page = 1;
    if(perPage < 1) perPage = 8;
    const [{data:rawData, totalPages}] = trpc.employeeAttendance.getAllAttendance?.useSuspenseQuery({page, perPage})
    const data = rawData?.map(item => ({
        ...item,
        employee_name: item.employee_name ?? undefined,
        work_time: item.work_time ?? undefined,
        extra_hours: item.extra_hours ?? undefined,
        check_in: item.check_in ?? undefined,
        check_out: item.check_out ?? undefined,
        id: item.id ?? undefined,
    }));

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
  return(
    <div className='flex flex-col'>
      <HeaderBottom 
        page={page}
        perPage={perPage}
        totalPages={totalPages}
        setSelectedFilters={setSelectedFilters}
        title='Attendance'
        // setIsOpenView={setIsOpenView}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}/>
        <ListView data={data} 
        selectedFilters={selectedFilters}/>
    </div>
  )
}

export default AttendanceMain