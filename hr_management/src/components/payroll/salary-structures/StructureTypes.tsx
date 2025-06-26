"use client"
import HeaderBottom from "@/components/home/HeaderBottom"
// import { useState } from "react"
import SalaryStructureTypeListView from "./SalaryStructureTypeListView"
import { trpc } from "@/trpc/client"
import { useSearchParams } from "next/navigation"

const StructureTypes = () => {
  const searchParams = useSearchParams()
  let page = Number(searchParams.get("/salary-structure-type/page"))
  let perPage = Number(searchParams.get("/salary-structure-type/perPage"))
  if(page < 1) page=1 ;
  if(perPage < 1) perPage=9;
  
  const [{salaryStructureTypes, totalPages}] =trpc.payroll.getAllSalaryStructuretypePage.useSuspenseQuery({page, perPage})

  const salaryStructureTypeMerged = salaryStructureTypes.map((item)=>({
      ...item.salaryStructuresType,
      country_name: item.country_name ?? "",
      work_shedule_name: item.work_shedule_name ?? "",
      pay_structure_name: item.pay_structure_name ?? "",
    }))
    // const [isOpenView, setIsOpenView] = useState(false)
  return (
    <div className="flex flex-col w-full">
        <HeaderBottom setSelectedIds={()=> {}} selectedIds={[]} page={page} perPage={perPage} totalPages={totalPages} title="Salary structure type" />
        <SalaryStructureTypeListView selectedFilters={[]} data={salaryStructureTypeMerged}/>
    </div>
  )
}

export default StructureTypes