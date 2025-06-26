"use client"
import HeaderBottom from "@/components/home/HeaderBottom"
import { trpc } from "@/trpc/client"
import { useSearchParams } from "next/navigation"
// import { useState } from "react"
import SalaryRuleseListView from "./SalaryRuleListView"

const SalaryRule = () => {
    // const [isOpenView, setIsOpenView] = useState(false)
    const searchParams = useSearchParams()
    let page = Number(searchParams.get("/salary-rules/page"))
    let perPage = Number(searchParams.get("/salary-rules/perPage"))
    if(page < 1) page=1 ;
    if(perPage < 1) perPage=9;
    
    const [{salaryRuleRecords, totalPages}] =trpc.payrollSalaryRule.getAllSalaryRulesPage.useSuspenseQuery({page, perPage})
  //   const salaryStructureMerged = salaryStructurePage.map((item)=>({
  //   ...item.salaryStructures,
  //   country_name: item.country_name ?? "",
  // }))

  return (
    <div className="flex flex-col">
        <HeaderBottom setSelectedIds={()=>{}} selectedIds={[]} page={page} perPage={perPage} totalPages={totalPages} title="Salary rules"/>
        <SalaryRuleseListView selectedFilters={[]} data={salaryRuleRecords}/>
    </div>
   
  )
}

export default SalaryRule