import { PlusIcon } from "lucide-react";
import { insertEmployeeContractSchemaType } from "@/db/schema";
import ContractKanban from "./ContractKanban";

export type GroupedDataItem = {
  group?: Record<string, string | number | null>;
  employees?: insertEmployeeContractSchemaType[];
};

interface GroupedKanbanProps {
  data?: GroupedDataItem[];
}

const GroupedKanban = ({ data }: GroupedKanbanProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      {data.map((groupData) => {
        const groupKey = JSON.stringify(groupData.group ?? {});
        const employees = groupData.employees ?? [];

        return (
          <div key={groupKey} className="flex lg:w-[400px] w-[360px] p-4 h-full">
            <div className="flex flex-col gap-x-4 w-full">
              {groupData.group &&
                Object.entries(groupData.group).map(([key, value]) => {
                  const formattedValue =
                    typeof value === "string"
                      ? value
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())
                      : value ?? "N/A";
                    
                  return (
                    <div
                      key={key}
                      className="flex lg:w-[400px] w-[360px] flex-col gap-y-1 mb-2"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{formattedValue}</p>
                        <p className="font-bold text-gray-500">
                          <PlusIcon />
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-[14px] w-[280px] lg:w-[300px] bg-gray-300" />
                        <p className="font-semibold pr-2">{employees.length}</p>
                      </div>
                    </div>
                  );
                })}
              
              {groupData && employees?.map((contract, index) => (
                <ContractKanban
                  data={contract}
                  key={contract.id}
                  index={index}
                  check="group"
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default GroupedKanban;
