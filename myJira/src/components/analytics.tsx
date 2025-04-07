import { ResponseTypeProjectAnalytics } from "@/features/projects/api/use-get-project-anaylitics"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import AnalyticsCard from "./analyticsCard"
import { Separator } from "./ui/separator"


const Analytics = ({data}:ResponseTypeProjectAnalytics) => {
    if(!data) return null
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
        <div className="flex flex-row w-full">
            <div className="flex items-center flex-1">
                <AnalyticsCard title="Total Tasks" value={data.taskCount}
                variant={data.taskDifference > 0 ? "up" : "down"} increaseValue={data.taskDifference}/>
                <Separator orientation="vertical"/>
            </div>
            <div className="flex items-center flex-1">
                <AnalyticsCard title="Assigned Tasks" value={data.assignedTaskCount}
                variant={data.assignedTaskDiff > 0 ? "up" : "down"} increaseValue={data.assignedTaskDiff}/>
                <Separator orientation="vertical"/>
            </div>
            <div className="flex items-center flex-1">
                <AnalyticsCard title="Completed Tasks" value={data.completeTaskCount}
                variant={data.completeTaskDiff > 0 ? "up" : "down"} increaseValue={data.completeTaskDiff}/>
                <Separator orientation="vertical"/>
            </div>
            <div className="flex items-center flex-1">
                <AnalyticsCard title="Overdue Tasks" value={data.overdueTaskCount}
                variant={data.overdueTaskDiff > 0 ? "up" : "down"} increaseValue={data.overdueTaskDiff}/>
                <Separator orientation="vertical"/>
            </div>
            <div className="flex items-center flex-1">
                <AnalyticsCard title="In Complete Tasks" value={data.incompleteTaskCount}
                variant={data.incompleteTaskDiff > 0 ? "up" : "down"} increaseValue={data.incompleteTaskDiff}/>
            </div>
        </div>
        <ScrollBar orientation="horizontal" className="lg:hidden"/>
    </ScrollArea>
  )
}

export default Analytics