"use client"
import ResponsiveModel from '@/components/responsiveModel'
import React from 'react'
import CreateWorkspaceForm from './createWorkspaceForm'
import { useCreateWorkspaceModal } from '../hooks/use-create-workspace-modal'

const CreateWorkspaceModal = () => {
    const {isOpen, setIsOpen, close} = useCreateWorkspaceModal()
  return (
    <ResponsiveModel open={isOpen} onOpenChange={setIsOpen}>
        <CreateWorkspaceForm onCancel={close}/>
    </ResponsiveModel>
  )
}

export default CreateWorkspaceModal