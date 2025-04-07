import { cn } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';
import React from 'react'

interface TaskDateProps {
    className?: string;
    value: string
}
const TaskDate = ({ className, value }: TaskDateProps) => {
    let textColor = "text-muted-foreground"
    const currentDate = new Date()
    const dueDate = new Date(value)
    const diffInDates = differenceInDays(dueDate, currentDate)
    if(diffInDates <= 3){
        textColor = "text-red-500"
    }
    else if(diffInDates <= 7){
        textColor = "text-orange-500"
    }
    else if(diffInDates <= 14){
        textColor = "text-yellow-500"
    }

  return (
    <div className={textColor}>
        <span className={cn("truncate", className)}>{format(value, "PPP")}</span>
    </div>
  )
}
export default TaskDate