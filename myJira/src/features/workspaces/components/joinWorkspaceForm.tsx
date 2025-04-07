"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link';
import React from 'react'
import { useJoinWorkspace } from '../api/use-join-workspace';
import { useInviteCode } from '../hooks/use-invite-code';
import { useWorkspaceId } from '../hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
interface JoinWorkspaceFormProps{
    initialValues:{name:string;}

}
const JoinWorkspaceForm = ({initialValues}:JoinWorkspaceFormProps) => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const inviteCode = useInviteCode()
    const { mutate,isPending } = useJoinWorkspace();
    const onClick = ()=>{
        mutate({
            param: {workspaceId},
            json: {code: inviteCode}
            },
            {
            onSuccess: ({data}) =>{
                router.push(`/workspaces/${data.$id}`)}
            }
        )
    }
  return (
    <Card className='w-full h-full shadow-none border-none'>
        <CardHeader className='p-7'>
            <CardTitle className='text-xl font-bold'>
                Join Workspace
            </CardTitle>
            <CardDescription>
                You&apos;ve been invited to join <strong>{initialValues.name}</strong>
            </CardDescription>
            
        </CardHeader>
        <CardContent className='flex gap-2 flex-col lg:flex-row items-center justify-between'>
                <Button asChild className='w-full lg:w-fit' variant="secondary" size="lg" disabled={isPending}>
                    <Link href="/">
                        Cancel
                    </Link>
                    
                </Button>
                <Button className='w-full lg:w-fit' variant="primary" size="lg" type='button' onClick={onClick} disabled={isPending}>
                    Join Workspace
                </Button>
            </CardContent>
    </Card>
  )
}

export default JoinWorkspaceForm