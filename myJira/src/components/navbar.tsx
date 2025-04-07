"use client"
import UserButton from './user-button'
import MobileSidebar from './mobileSidebar'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname= usePathname()
  const pathkey = pathname.split("/")[3] as 'projects' | 'tasks'

  const pathMap = {projects:{
        title:"Projects",
        description:"Monitor all your projects.",
      },
      tasks:{
        title:"Tasks",
        description:"Monitor all your tasks.",
      }}
  const defaultMap = {
    title:"Home",
    description:"Monitor all your projects and tasks."
  }
  const { title, description } = pathMap[pathkey] || defaultMap
  // console.log(title, description)
  return (
    <nav className='w-full pt-4 px-6 flex justify-between items-center '>
        <div className='flex-col hidden lg:flex'>
            <h1 className='text-2xl font-semibold'>{title}</h1>
            <p className='text-muted-foreground'>{description}</p>
        </div>
        <MobileSidebar/>
        <UserButton/>
    </nav>
  )
}

export default Navbar