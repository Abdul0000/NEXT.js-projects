"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { updateProjectSchema } from '../schemas'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar,AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUpdateProject } from '../api/use-update-project'
import { useDeleteProject } from '../api/use-delete-project'
import { useConfirm } from '@/hooks/useConfirm'
import { project } from '../types'

interface EditWorkSpaceFormProps {
    onCancel?:()=> void,
    initialValues:project;
}
const EditProjectForm = ({onCancel,initialValues}:EditWorkSpaceFormProps) => {
    const router= useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const form = useForm<z.infer<typeof updateProjectSchema>>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
           ...initialValues,
           image: initialValues.imageUrl ?? "",
        }
    })
    const { mutate, isPending } = useUpdateProject()
    const { mutate:deleteProject, isPending:isDeletingProject} = useDeleteProject()

    const [DeleteDialog, ConfirmDelete] = useConfirm(
        "Delete Project",
        "This action cannot be undone.",
        "destructive"
    )
    const onSubmit=(values:z.infer<typeof updateProjectSchema>)=>{
    const finalValues= {
            ...values,
            image:values.image instanceof File ? values.image: ""
        }
        mutate({form:finalValues,param:{projectId: initialValues.$id}});
      }
    const handleImageChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if(file){
            form.setValue("image",file)
        }
    }
   
    const handleDelete = async()=>{
        const ok = await ConfirmDelete()
        if(!ok) return
        deleteProject({
            param:{projectId: initialValues.$id}
        },
        {
            onSuccess: ()=> window.location.href ="/"
        }
    )
    }

  return (
    <div className='flex flex-col gap-y-4'>
    <DeleteDialog/>
    <Card className='w-full h-full border-none shadow-none'>
        <CardHeader className='flex flex-row p-7 pt-4 gap-12 w-full '>
            <Button onClick={onCancel? onCancel : ()=>{ router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)}} variant="secondary" className='size-5 h-8 ' size="xs">
                Back
            </Button>
            <CardTitle className='text-xl font-bold'>
                {initialValues.name}
            </CardTitle>
        </CardHeader>
        {/* <div className='px-7'> */}
            <Separator/>
        {/* </div> */}
        <CardContent className='pb-4'>
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
                                        {field.value ?
                                        <Button type='button' variant='destructive' size='xs' disabled={isPending} className='w-fit mt-2' onClick={()=> field.onChange(null)}>
                                            Remove Image
                                        </Button>:
                                        <Button type='button' variant='teritary' size='xs' disabled={isPending} className='w-fit mt-2' onClick={()=> inputRef.current?.click()}>
                                            Upload Image
                                        </Button>
                                        }
                                       
                                    </div>    
                                </div>
                           </div>
                            )}/>
                    </div>
                    <Separator className='my-7'/>
                    <div className='flex items-center justify-between'>
                        <Button variant="secondary" size="lg" onClick={onCancel} className={cn(!onCancel && "invisible")} type='button' disabled={isDeletingProject}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="lg" type='submit' disabled={isPending}>
                            Save changes
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>

    <Card className='w-full h-full border-none shadow-none'>
        <CardContent className='pb-4'>
            <div className='flex flex-col'>
                <h3 className='font-bold'>Danger Zone</h3>
                <p className='text-sm text-muted-foreground'>Deleting a project is irreversible and will remove all associated data. </p>
                <Button className='mt-6 w-fit ml-auto' type='button' size="sm" variant="destructive" onClick={handleDelete} disabled={isPending || isDeletingProject}>
                    Delete Project
                </Button>
            </div>
        </CardContent>
    </Card>
</div>
  )
}

export default EditProjectForm