import { insertEmployeeContractSchemaType } from "@/db/schema";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";

interface props {
  index?: number;
  check?: string;
  data: insertEmployeeContractSchemaType &{
    employee_name?:string;
    department_name?:string;
  }

}

const ContractKanban = ({
  data,
  check,
  index,
}: props) => {
  return (
    <div
      className={`
        pt-2
        pl-4
        lg:w-[400px]
        w-[360px]
        h-[150px] 
        border border-gray-300 
        ${check === "group" && index !== undefined && index > 0 ? "border-t-0 " : ""}
        m-0
      `}
    >
      <div className="flex justify-between items-start">
        <Link href={`/contract-update/${data.id}`} className="w-full">
          <div className="cursor-pointer flex flex-col gap-1 text-[0.9rem]">
            <h3 className="font-semibold text-base text-emerald-900">{data.contract_name}</h3>
            <p className=" text-neutral-600">{data.employee_name}</p>
            <p className=" text-neutral-600">{data.job_position}</p>
            <p className=" text-neutral-500">{data.department_name}</p>
            <p className=" text-neutral-400">
              From: {new Date(data.start_date || "").toLocaleDateString()}
              {data.end_date && ` to ${new Date(data.end_date).toLocaleDateString()}`}
            </p>
          </div>
        </Link>

        <button
          onClick={(e) => e.nativeEvent.stopPropagation()}
          className="m-1 p-1 rounded hover:bg-slate-100"
        >
          <MoreVerticalIcon className="size-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ContractKanban;
