"use client"
import { useState } from "react"
import WorkInformation from "./WorkInformation"
import { UseFormReturn } from "react-hook-form"
import { insertNewEmployeeSchemaType } from "@/db/schema"
import PrivateInformation from "./privateInformation/PrivateInformation"
import Payroll from "./Payroll"
import Settings from "./Settings"

const tabs = [
    "Resume",
    "Work Information",
    "Private Information",
    "Payroll",
    "Settings",
]
interface EmployeeTabProps{
    form : UseFormReturn<insertNewEmployeeSchemaType>;
    getEmployees? : insertNewEmployeeSchemaType[];
}
const EmployeeTabs = ({form, getEmployees}:EmployeeTabProps) => {
    const [tabHeader, setTabHeader] = useState<string>("resume")
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
            {tabHeader === "work information" && getEmployees && <WorkInformation form={form} getEmployees={getEmployees} />}
            {tabHeader === "private information" && <PrivateInformation form={form}/>}
            {tabHeader === "payroll" && <Payroll form={form}/>}
            {tabHeader === "resume" && <p>Resume content here</p>}
            {tabHeader === "settings" && getEmployees&& <Settings getEmployees={getEmployees}  form={form}/>}
        </div>
    </div>
  )
}

export default EmployeeTabs
