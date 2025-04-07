import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Separator } from './ui/separator'
import Navigation from './navigation'
import WorkspaceSwitcher from './WorkspaceSwitcher'
import Projects from './projects'

const Sidebar = () => {
  return (
    <aside className='h-full p-4 bg-neutral-100  w-full'>
        <Link href="/" className='fixed scroll-none'>
            <Image src="/logo.svg" alt='logo' height={"48"} width={"164"}/>
        </Link>
        <Separator className='my-4 mt-12'/>
        <WorkspaceSwitcher/>
        <Separator className='my-4'/>
        <Navigation/>
        <Separator className='my-4'/>
      
        <Projects/>

    </aside>
  )
}

export default Sidebar