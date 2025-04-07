import React, { useState } from 'react'
import { Task } from '../types';
import { PencilIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUpdateTask } from '../api/use-update-task';
import { Textarea } from '@/components/ui/textarea';
interface DescriptionProps{
    task: Task;
}
const Description = ({task}: DescriptionProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState("")
    const { mutate, isPending } = useUpdateTask()

    const handleSave= ()=>{
        mutate({
            json: { description: value },
            param: { taskId: task.$id }
        },{
            onSuccess: ()=>{
                setIsEditing(false)
            }
        })
    }
  return (
    <div className='p-4 border rounded-lg'>
        <div className='flex items-center justify-between'>
            <p className='text-lg font-semibold'>Overview</p>
            <Button onClick={()=> setIsEditing((prev)=> !prev)} size="sm" variant="secondary">
                {isEditing ? (<XIcon className='size-4 mr-2'/>): (<PencilIcon className='size-4 mr-2'/>)}
                { isEditing ? "Cancel": "Edit"}
            </Button>
        </div>
        <Separator className='my-4'/>
        {isEditing ? (
        <div className='flex flex-col gap-y-4'>
            <Textarea value={value} placeholder='Add a description' rows={4} 
            onChange={(e)=> setValue(e.target.value)} disabled={isPending}/>
            <Button className='w-fit ml-auto' size="sm" onClick={handleSave} disabled={isPending}>
                { isPending ? "Saving..." : "Save Changes"}
            </Button>
        </div>) :
        (<div>
            {
                task.description || (
                    <span className='text-muted-foreground'> No Description set</span>
                )
            }
        </div>)}
    </div>
  )
}

export default Description