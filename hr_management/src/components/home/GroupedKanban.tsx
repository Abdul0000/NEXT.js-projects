import { PlusIcon } from "lucide-react"
import Kanban from "./Kanban"
import { insertNewEmployeeSchemaType } from "@/db/schema"
import { Fragment } from "react";

type GroupedData = {
  group?: Record<string, string | number | null>;
  employees?: insertNewEmployeeSchemaType[];
}[];

interface GroupedKanbanProps {
  data?: GroupedData;
}

const GroupedKanban = ({data}: GroupedKanbanProps) => {
    return (
            <Fragment>
                {(data as GroupedData)?.map(groupData => {
                    const groupKey = JSON.stringify(groupData.group);
                    // const isExpanded = expandedGroups.has(groupKey);
                    return (
                    <Fragment key={groupKey}>
                        <div className="flex lg:w-[400px] w-[360px] p-4 h-full ">
                            <div className="flex flex-col gap-x-4 w-full">
                                {Object.entries(groupData.group).map(([key, value]) => {
                                const formattedValue = typeof value === 'string'
                                    ? value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                                    : value ?? 'N/A';

                                return (
                                    <div key={key} className="relative flex flex-col gap-y-1 lg:w-[400px] w-[360px] mb-2">
                                        <div className="flex justify-between items-center w-full">
                                            <p className="font-semibold">{formattedValue}</p>
                                            <p className="font-bold text-gray-500"><PlusIcon/></p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="h-[14px] w-[280px] lg:w-[300px] bg-gray-300" />
                                            <p className="font-semibold pr-2">{groupData.employees.length}</p>
                                        </div>
                                    </div>
                                );
                                })}
                                
                            {
                                groupData.group && groupData.employees.map((emp,index)=>(
                                    <Kanban check="group" index={index}
                                    key={emp.id} id={emp.id!} employee_name={emp.employee_name}
                                    job_title={emp.job_title} work_email={emp.work_email}
                                    work_mobile={emp.work_mobile} image_url={emp.image_url ?? "/no_image.JPG"}/>
                                ))
                            }
                            </div>
                        </div>  
                    </Fragment>
                    )
                })}
            </Fragment>
    )
}

export default GroupedKanban
