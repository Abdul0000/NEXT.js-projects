"use client"
import { useCurrent } from "@/features/auth/api/use-current"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader, LogOut } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useLogout } from "@/features/auth/api/use-logout"

const UserButton = () => {
    const {data:user, isLoading} = useCurrent()
    const { mutate: logout} = useLogout()
    if (isLoading){
        return  <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
                    <Loader className="size-4 animate-spin text-muted-foreground"/>
                </div>
    }
    if(!user){
        return null
    }
    const { name,email } = user
    const avatarFalllback = name ? name.charAt(0).toUpperCase():
        email.charAt(0).toUpperCase() ?? "U"
  return (
    <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative cursor-pointer">
            <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
                <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                    {avatarFalllback}
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" className="w-60" sideOffset={10}>
            <div className="flex flex-col items-center justify-center px-2.5 py-4 gap-2">
                <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
                    <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
                        {avatarFalllback}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center items-center">
                    <p className="text-xs text-neutral-500">
                        {email}
                    </p>
                </div>
            </div>
            <Separator className="mb-1"/>
            <DropdownMenuItem onClick={()=>logout()} className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer">
                <LogOut className="size-4 mr-2"/>
                Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton