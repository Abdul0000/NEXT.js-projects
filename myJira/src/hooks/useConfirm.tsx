import React, { JSX, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import ResponsiveModel from '@/components/responsiveModel'


export const useConfirm = (title: string, message: string, variant: "primary" | "destructive" | "outline" | "secondary" | "ghost" | "muted" | "teritary" | "link"): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise,setPromise] = useState<{resolve:(value:boolean) => void} | null>(null)
    const confirm = ()=>{
        return new Promise((resolve)=>{
            setPromise({resolve})
        })
    }
    const handleClose = ()=>{
        setPromise(null)
    }
    const handleConfirm = ()=>{
        promise?.resolve(true)
        handleClose()
    }
    const handleCancel = ()=>{
        promise?.resolve(false)
        handleClose()
    }
    const ConfirmationDialog = ()=>(
        <ResponsiveModel open={ promise!=null} onOpenChange={handleClose}>
            <Card className='h-full w-full border-none shadow-none'>
                <CardContent className='p-8'>
                    <CardHeader>
                        <CardTitle className='p-0'>{title}</CardTitle>
                        <CardDescription>{message}</CardDescription>
                    </CardHeader>
                    <div className='pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end'>
                        <Button variant='outline' onClick={handleCancel} className='w-full lg:w-auto'>
                            Cancel
                        </Button>
                        <Button variant= {variant} onClick={handleConfirm} className='w-full lg:w-auto'>
                            Confirm
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </ResponsiveModel>
    )
  return [ConfirmationDialog, confirm]
}
