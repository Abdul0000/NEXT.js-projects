// components/private-information/PrivateInformation.tsx
"use client"

import { UseFormReturn } from "react-hook-form"
import { insertNewEmployeeSchemaType } from "@/db/schema"
import PrivateContact from "./PrivateContact"
import Citizenship from "./Citizenship"
import EmergencyContact from "./EmergencyContact"
import FamilyStatus from "./FamilyStatus"
import Education from "./Education"
import WorkPermit from "./WorkPermit"

interface PrivateInformationProps {
  form: UseFormReturn<insertNewEmployeeSchemaType>
}

const PrivateInformation = ({ form }: PrivateInformationProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 mt-4 mb-4">
      <div className="flex flex-col gap-y-0 gap-x-4">
        <PrivateContact form={form} />
        <EmergencyContact form={form} />
        <FamilyStatus form={form} />
      </div>
      <div className="flex flex-col gap-y-0 gap-x-8">
        <Citizenship form={form} />
        <Education form={form} />
        <WorkPermit form={form} />
      </div>
    </div>
  )
}

export default PrivateInformation
