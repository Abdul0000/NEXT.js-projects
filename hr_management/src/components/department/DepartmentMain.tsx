"use client"
// import { z } from 'zod'
// import { useState } from 'react'
import HeaderBottom from '../home/HeaderBottom'
import DepartmentKanban from './DepartmentKanban'
import { trpc } from '@/trpc/client'
import { useSearchParams } from 'next/navigation'
// import { insertDepartmentSchema } from '@/db/schema'


const DepartmentMain = () => {
    // const [isOpenView, setIsOpenView] = useState(true)
    const searchParams = useSearchParams()
    let page = Number(searchParams.get("/departments/page"))
    let perPage = Number(searchParams.get("/departments/perPage"))
    if (page < 1 ) page = 1;
    if (perPage < 1) perPage =8;
    const [{data:allDepartments, totalPages}] = trpc.departments.getAllDepartments.useSuspenseQuery({ page, perPage })
    const [{employees:allEmployees}] = trpc.getEmployees.getAllEmployees.useSuspenseQuery({ page, perPage })
    console.log("allDepartments", allDepartments)
    const colors = [
      "border-l-red-500",
      "border-l-green-500",
      "border-l-yellow-500",
      "border-l-blue-500",
      "border-l-pink-500",
      "border-l-orange-500",
      "border-l-purple-500",
      "border-l-indigo-500",
      "border-l-teal-500",
      "border-l-cyan-500",
      "border-l-emerald-500",
      "border-l-lime-500",
      "border-l-amber-500",
      "border-l-fuchsia-500",
      "border-l-rose-500",
      "border-l-violet-500",
      "border-l-sky-500",
      "border-l-neutral-500",
      "border-l-stone-500",
      "border-l-zinc-500"
    ];

  return (
    <div>
        <HeaderBottom 
          // setIsOpenView={setIsOpenView} 
          title="Departments" 
          setSelectedIds={() => {}} 
          selectedIds={[]} 
          perPage={perPage} 
          page={page} 
          totalPages={totalPages} 
        />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px] sm:h-[470px] overflow-y-scroll p-4 pl-6 pr-6">
      {
        allDepartments
          ? allDepartments.map((data, index) => {
              const fixedData = {
                ...data,
                createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
                updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
              };
              return (
                <DepartmentKanban
                  color={colors[index % colors.length]}
                  employees={allEmployees.filter((emp) => emp.newEmployees?.department_id === data.id).length}
                  key={data.id}
                  data={fixedData}
                />
              );
            })
          : ""
      }
    </div>
    </div>
  )
}

export default DepartmentMain