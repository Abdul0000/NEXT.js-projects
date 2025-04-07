"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateProject } from '../api/use-create-project'
import { Avatar,AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createProjectSchema } from '../schemas'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'

interface CreateProjectFormProps {
    onCancel?:()=> void
}
const CreateProjectForm = ({onCancel}:CreateProjectFormProps) => {
    const workspaceId = useWorkspaceId()
    const router= useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
          name: "",
          workspaceId: workspaceId 
        }
      })
    const { mutate, isPending } = useCreateProject()
      const onSubmit=(values:z.infer<typeof createProjectSchema>)=>{
        const finalValues= {
            ...values,
            workspaceId,
            image:values.image instanceof File ? values.image: ""
        }
        mutate({form:finalValues}, {onSuccess: ({data})=> {form.reset();router.push(`/workspaces/${data.workspaceId}/projects/${data.$id}`)}});
      }
    const handleImageChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if(file){
            form.setValue("image",file)
        }
    }
    
  return (
    <Card className='w-full h-full border-none shadow-none'>
        <CardHeader className='flex p-7'>
            <CardTitle className='text-xl font-bold'>
                Create new Project
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
                                    Project Name
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder='Enter project name'/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            )}/>

                    <FormField
                    control={form.control}
                    name='image'
                    render={({field})=>(
                           <div className='flex flex-col gap-y-2'>
                                <div className='flex items-center gap-x-5'>
                                    {
                                        field.value ? (<div className='size-[72px] relative rounded-md overflow-hidden'><Image fill className='object-cover' alt='logo' src={field.value instanceof File ? URL.createObjectURL(field.value):field.value}/></div>):
                                        (<Avatar className='size-[72px'>
                                            <AvatarFallback>
                                                <ImageIcon className='size-[36px] text-neutral-400'/>
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className='flex flex-col'>
                                        <p className='text-sm'>
                                            Project Icon
                                        </p>
                                        <p className='text-sm text-muted-foreground'>
                                            JPG, PNG, SVG or JPEG, max 1mb
                                        </p>
                                        <input className='hidden' type='file' ref={inputRef} disabled={isPending} onChange={handleImageChange}/>
                                        {
                                        field.value ?
                                        <Button type='button' variant='destructive' size='xs' disabled={isPending} className='w-fit mt-2' onClick={()=> {
                                            field.onChange(null);
                                        }}>
                                            Remove Image
                                        </Button>
                                        :
                                        <Button type='button' variant='teritary' size='xs' disabled={isPending} className='w-fit mt-2' onClick={()=> inputRef.current?.click()}>
                                            Upload Image
                                        </Button>
                                       
                                        }

                                    </div>    
                                </div>
                           </div>
                            )}/>
                    <Separator className='my-7'/>

                    </div>
                    <div className='flex items-center justify-between'>
                        <Button variant="secondary" size="lg" onClick={onCancel} className={cn(!onCancel && "invisible")} type='button' disabled={isPending}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="lg" type='submit' disabled={isPending}>
                            Create Project
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}

export default CreateProjectForm