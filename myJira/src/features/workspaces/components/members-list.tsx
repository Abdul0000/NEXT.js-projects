"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { Fragment } from 'react'
import { useWorkspaceId } from '../hooks/use-workspace-id'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react'
import Link from 'next/link'
import { useGetMembers } from '@/features/members/api/use-get-members'
import MemeberAvatar from '@/features/members/components/memberAvatar'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDeleteMemeber } from '@/features/members/api/use-delete-member'
import { useUpdateMemeber } from '@/features/members/api/use-update-member'
import { MemberRole } from '@/features/members/types'
import { useConfirm } from '@/hooks/useConfirm'


const MembersList = () => {
    const [ ConfirmDialog, Confirm] = useConfirm(
        "Remove Member",
        "This member will be remove from the workspace",
        "destructive"
    )
    const workspaceId = useWorkspaceId()
    const { data } = useGetMembers({ workspaceId })
    const {mutate: deleteMemeber, isPending: isDeletingMember } =useDeleteMemeber()
    const {mutate: updateMemeber, isPending: isUpdatimgMember } =useUpdateMemeber()

    const handleUpdateMember = ( memberId:string , role:MemberRole)=>{
        updateMemeber({
            json: { role },
            param: { memberId }
        })
    }
    const handleDeleteMember = async(memberId:string)=>{
        const ok = await Confirm()
        if (!ok) return
        deleteMemeber({param: { memberId }}, {onSuccess: ()=>{
            window.location.reload()
        }})
    }

  return (
    <Card className='w-full h-full border-none shadow-none'>
        <ConfirmDialog/>
        <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
            <Button asChild variant="secondary" size="sm">
                <Link href={`/workspaces/${workspaceId}`}>
                <ArrowLeftIcon className='size-4 mr-2'/>Back
                </Link>
            </Button>
            <CardTitle className='text-xl font-bold'>
                Members List
            </CardTitle>
        </CardHeader>
        <CardContent className='p-7'>
            {data?.documents.map( (member, index)=>(
                <Fragment key={member.$id}>
                    <div className='flex items-center gap-2'>
                        <MemeberAvatar className='size-10' fallbackClassName='text-lg' name={member.name}/>
                        <div className='flex flex-col'>
                            <p className='text-sm font-medium'>{member.name}</p>
                            <p className='text-xs text-muted-foreground'>{member.email}</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className='ml-auto' variant="secondary" size="icon">
                                    <MoreVerticalIcon className='size-4 text-muted-foreground'/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem className='font-medium text-amber-700' onClick={()=>{handleUpdateMember(member.$id, MemberRole.ADMIN)}} disabled={isUpdatimgMember}>
                                    Set as Administrator
                                </DropdownMenuItem>
                                <DropdownMenuItem className='font-medium' onClick={()=>{handleUpdateMember(member.$id, MemberRole.MEMBER)}} disabled={isUpdatimgMember}>
                                    Set as Member
                                </DropdownMenuItem>
                                <DropdownMenuItem className='font-medium' onClick={()=>{handleDeleteMember(member.$id)}} disabled={isDeletingMember}>
                                    Remove {member.name}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {
                        index < data.documents.length -1 && (
                            <Separator className='my-2.5 text-neutral-300'/>
                        )
                    }
                </Fragment>
            ))}
        </CardContent>
    </Card>
  )
}

export default MembersList