"use client"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { insertEmployeeContractSchema } from "@/db/schema"
import { z } from "zod"

const tabs = [
    "General",
    "Accounting",
]
interface EmployeeTabProps{
    form?: UseFormReturn<z.infer<typeof insertEmployeeContractSchema>>;
    getEmployees? : Array<z.infer<typeof insertEmployeeContractSchema>>;
}
const SalaryRuleTabs = ({}:EmployeeTabProps) => {
    const [tabHeader, setTabHeader] = useState<string>("General")
  return (
    <div className="pt-8 h-full w-full flex flex-col text-[14px]">
        <div className="flex flex-col lg:flex-row w-[260px] lg:w-full">
            {
                tabs.map((tab, index)=>{
                return (
                    <div onClick={()=> setTabHeader(tab.toLowerCase())} key={tab} className={`border ${index === tabs.length-1 ? "border-r-gray-300": "border-r-0"} ${tabHeader.toLowerCase() === tab.toLowerCase() && "bg-slate-100"} border-b-0 text-sm p-2 pr-4 pl-4 cursor-pointer`}>
                        {tab}
                    </div>
                    )
                })
            }    
        </div>
        <div className="pl-4 border border-gray-300 w-full h-full min-h-[200px]">
            {tabHeader.toLowerCase() === "general" && <p>General</p>}
            {tabHeader.toLowerCase() === "accounting" && <p>Accounting</p>}
        </div>
    </div>
  )
}

export default SalaryRuleTabs
