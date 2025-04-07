"use client"
import ResponsiveModel from '@/components/responsiveModel'
import React from 'react'
import { useCreateTaskModal } from '../hooks/use-create-task-modal'
import CreateTaskFormWrapper from './create-task-form-wraper'

const CreateTaskModal = () => {
    const {isOpen, setIsOpen, close} = useCreateTaskModal()
  return (
    <ResponsiveModel open={isOpen} onOpenChange={setIsOpen}>
        <CreateTaskFormWrapper onCancel={close}/>
    </ResponsiveModel>
  )
}

export default CreateTaskModal