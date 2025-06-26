"use client"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { insertEmployeeContractSchema } from "@/db/schema"
import { z } from "zod"
import SalaryInformation from "./SalaryInformation"

const tabs = [
    "Salary Information",
    "Details",
]
interface ContractTabProps{
    form : UseFormReturn<z.infer<typeof insertEmployeeContractSchema>>;
}
const ContractTabs = ({form}:ContractTabProps) => {
    const [tabHeader, setTabHeader] = useState<string>("salary information")
  return (
    <div className="pt-0 h-full w-full flex flex-col text-[14px]">
        <div className="flex flex-col pl-6 lg:flex-row w-[260px] lg:w-full">
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
        <div className="pl-4 border border-gray-300 border-b-0 border-r-0 border-l-0 w-full h-full min-h-[200px]">
            {tabHeader === "salary information" && <SalaryInformation form={form}/>}
            {tabHeader === "details" && <p>Details</p>}
            {/* {tabHeader === "payroll" && <Payroll form={form}/>}
            {tabHeader === "resume" && <p>Resume content here</p>}
            {tabHeader === "settings" && <Settings getEmployees={getEmployees}  form={form}/>} */}
        </div>
    </div>
  )
}

export default ContractTabs
