"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateTask } from '../api/use-create-task'
import { cn } from '@/lib/utils'
import { createTaskSchema } from '../schemas'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import DatePicker from '@/features/projects/components/datePicker'
import MemeberAvatar from '@/features/members/components/memberAvatar'
import { TaskStatus } from '../types'
import ProjectAvatar from '@/features/projects/components/projectAvatar'

interface CreateTaskFormProps {
    onCancel?:()=> void;
    projectOptions : {id:string, name:string, imageUrl:string}[]
    memberOptions : {id:string, name:string }[]
}
const CreateTaskForm = ({onCancel, projectOptions, memberOptions}:CreateTaskFormProps) => {
    const workspaceId = useWorkspaceId()
    const form = useForm<z.infer<typeof createTaskSchema>>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
          workspaceId: workspaceId 
        }
      })
    const { mutate, isPending } = useCreateTask()
    const onSubmit=(values:z.infer<typeof createTaskSchema>)=>{ 
    mutate({json:{...values, workspaceId}}, {onSuccess: ()=> {form.reset();if (onCancel) {
        onCancel();
    }}});
    }
    
  return (
    <Card className='w-full h-full border-none shadow-none'>
        <CardHeader className='flex p-7'>
            <CardTitle className='text-xl font-bold'>
                Create new Task
            </CardTitle>
        </CardHeader>
        <Separator className='my-0'/>
        <CardContent className='p-7'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='flex flex-col gap-y-4'>
                    <FormField
                    control={form.control}
                    name='name'
                    render={({field})=>(
                            <FormItem>
                                <FormLabel>
                                    Project Task
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder='Enter task name'/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}/>
                    
                    <FormField
                    control={form.control}
                    name='dueDate'
                    render={({field})=>(
                            <FormItem>
                                <FormLabel>
                                    Due Date
                                </FormLabel>
                                <FormControl>
                                    <DatePicker {...field} placeholder='Select Date'/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}/>
                    
                            <FormField
                            control={form.control}
                            name='assigneeId'
                            render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                            Assignee
                                        </FormLabel>
                                            <Select defaultValue={field.value} onValueChange={field.onChange} >
                                                <FormControl>
                                                <SelectTrigger className='cursor-pointer w-full'>
                                                    <SelectValue placeholder='Select Assignee'>
                                                    </SelectValue>
                                                </SelectTrigger>
                                                </FormControl>
                                                <FormMessage/>
                                                <SelectContent>
                                                    {memberOptions.map((member)=>(
                                                        <SelectItem className="cursor-pointer" key={member.id} value={member.id}>
                                                            <div className='flex items-center gap-x-2'>
                                                            <MemeberAvatar className='size-6' name={member.name}/>
                                                            {member.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        <FormMessage/>
                                    </FormItem>)}/>
                            <FormField
                            control={form.control}
                            name='status'
                            render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                            Status
                                        </FormLabel>
                                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                <SelectTrigger className='cursor-pointer w-full'>
                                                    <SelectValue placeholder='Select Status'>
                                                    </SelectValue>
                                                </SelectTrigger>
                                                </FormControl>
                                                <FormMessage/>
                                                <SelectContent >   
                                                    <SelectItem className="cursor-pointer" value={TaskStatus.BACKLOG}>
                                                        Backlog
                                                    </SelectItem>
                                                    <SelectItem className="cursor-pointer" value={TaskStatus.IN_PROGRESS}>
                                                        In Progress
                                                    </SelectItem>
                                                    <SelectItem className="cursor-pointer" value={TaskStatus.TODO}>
                                                        Todo
                                                    </SelectItem>
                                                    <SelectItem className="cursor-pointer" value={TaskStatus.IN_REVIEW}>
                                                        In Review
                                                    </SelectItem>
                                                    <SelectItem className="cursor-pointer" value={TaskStatus.DONE}>
                                                        Done
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        <FormMessage/>
                                    </FormItem>)}/>
                            <FormField
                            control={form.control}
                            name='projectId'
                            render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                            Project
                                        </FormLabel>
                                            <Select defaultValue={field.value} onValueChange={field.onChange} >
                                                <FormControl>
                                                <SelectTrigger className='cursor-pointer w-full'>
                                                    <SelectValue placeholder='Select Project'>
                                                    </SelectValue>
                                                </SelectTrigger>
                                                </FormControl>
                                                <FormMessage/>
                                                <SelectContent>
                                                    {projectOptions.map((project)=>(
                                                        <SelectItem className="cursor-pointer" key={project.id} value={project.id}>
                                                            <div className='flex items-center gap-x-2'>
                                                            <ProjectAvatar className='size-6' name={project.name} image={project.imageUrl}/>
                                                            {project.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        <FormMessage/>
                                    </FormItem>)}/>

                    <Separator className='my-7'/>

                    </div>
                    <div className='flex items-center justify-between'>
                        <Button variant="secondary" size="lg" onClick={onCancel} className={cn(!onCancel && "invisible")} type='button' disabled={isPending}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="lg" type='submit' disabled={isPending}>
                            Create Task
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}

export default CreateTaskForm