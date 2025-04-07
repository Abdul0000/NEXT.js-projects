"use client"
import ResponsiveModel from '@/components/responsiveModel'
import React from 'react'
import CreateProjectForm from './createProjectForm'
import { useCreateProjectModal } from '../hooks/use-create-project-modal'

const CreateProjectModal = () => {
    const {isOpen, setIsOpen, close} = useCreateProjectModal()
  return (
    <ResponsiveModel open={isOpen} onOpenChange={setIsOpen}>
        <CreateProjectForm onCancel={close}/>
    </ResponsiveModel>
  )
}

export default CreateProjectModal