import { insertDepartmentSchemaType } from "@/db/schema";
import { Button } from "../ui/button";

type Department = insertDepartmentSchemaType

interface DepartmentKanbanProps{
    data: Department ;
    employees: number;
    color: string;
}
const DepartmentKanban = ({data, employees, color}: DepartmentKanbanProps) => {
  return (
    <div className={`w-full h-[180px] bg-white border border-gray-300 border-l-[3px] rounded-[1px] ${color}`}>
        <div className="flex flex-col gap-y-1 gap-x-1 p-4 pl-6">
            <p className="text-2xl text-emerald-700">{data.department_name}</p>
            <p className="text-muted-foreground">{data.manager}</p>
            <p className="text-muted-foreground">{data.company}</p>
            <p className="mt-2"><Button className="bg-pink-500 hover:bg-pink-600">
                Employees {employees}
            </Button>
            </p>
        </div>
    </div>
  )
}

export default DepartmentKanban