"use client"
import HeaderBottom from "@/components/home/HeaderBottom"
import { trpc } from "@/trpc/client"
import { useSearchParams } from "next/navigation"
// import { useState } from "react"
import SalaryStructureListView from "./SalaryStructureListView"

const Structures = () => {
    // const [isOpenView, setIsOpenView] = useState(false)
    const searchParams = useSearchParams()
      let page = Number(searchParams.get("/salary-structure/page"))
      let perPage = Number(searchParams.get("/salary-structure/perPage"))
      if(page < 1) page=1 ;
      if(perPage < 1) perPage=9;
      
      const [{salaryStructurePage, totalPages}] =trpc.payroll.getAllSalaryStructurePage.useSuspenseQuery({page, perPage})
      const salaryStructureMerged = salaryStructurePage.map((item)=>({
      ...item.salaryStructures,
      country_name: item.country_name ?? "",
    }))
  return (
    <div className="flex flex-col w-full">
        <HeaderBottom setSelectedIds={()=> {}} selectedIds={[]} page={page} perPage={perPage} totalPages={totalPages} title="Salary structure"/>
        <SalaryStructureListView selectedFilters={[]} data={salaryStructureMerged}/>
    </div>
  )
}

export default Structures