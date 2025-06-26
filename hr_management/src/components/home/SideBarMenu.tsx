import { Grid3X3Icon, PanelRightIcon, Table2Icon } from 'lucide-react'

interface SideBarMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}
const SideBarMenu = ({isOpen, setIsOpen}: SideBarMenuProps) => {
    const onOpen = ()=>{
        setIsOpen(!isOpen)
    }
  return (
    <div className={`flex-col lg:flex gap-4 bg-gray-50 p-4 border-r h-full ${isOpen ? "w-64": "w-16"}`}>
    <div className={`${isOpen ? "self-end":"self-center"} cursor-pointer`} onClick={onOpen}> <PanelRightIcon size={16} /> </div>
        <div className={`flex items-center cursor-pointer w-40 justify-start gap-2 ${isOpen ? "self-start": "self-center"}`}>
            <Grid3X3Icon size={18}/>
            <p className={`${isOpen ? "block":"hidden"} text-emerald-800 font-semibold`}>Company</p>
        </div>
        <div className={`pl-6 flex items-start flex-col ${!isOpen && "hidden"}`}>
            <p className='p-1 pl-2 cursor-pointer hover:bg-slate-300 w-[160px] '>All</p>
            <p className='p-1 pl-2 cursor-pointer hover:bg-slate-300 w-[160px] '>Demo company</p>
        </div>

        <div className={`flex items-center cursor-pointer w-40 justify-start gap-2 ${isOpen ? "self-start": "self-center"}`}>
            <Table2Icon size={18}/>
            <p className={`${isOpen ? "block":"hidden"} text-emerald-800 font-semibold`}>Department</p>
        </div>
        <div className={`pl-6 flex items-start flex-col ${!isOpen && "hidden"}`}>
            <p className='p-1 pl-2 cursor-pointer hover:bg-slate-300 w-[160px] '>All</p>
            <p className='p-1 pl-2 cursor-pointer hover:bg-slate-300 w-[160px] '>Management</p>
        </div>
    </div>
  )
}

export default SideBarMenu