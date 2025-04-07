"use client"
import ResponsiveModel from '@/components/responsiveModel'
import React from 'react'
import { useEditTaskModal } from '../hooks/use-edit-task-modal'
import EditTaskFormWrapper from './edit-task-form-wraper'

const EditTaskModal = () => {
    const {taskId,close} = useEditTaskModal()
  return (
    <ResponsiveModel open={!!taskId} onOpenChange={close}>
      {taskId && 
        <EditTaskFormWrapper id = {taskId} onCancel={close}/>
      }
    </ResponsiveModel>
  )
}

export default EditTaskModal