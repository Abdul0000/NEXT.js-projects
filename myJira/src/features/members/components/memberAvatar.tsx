import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface MemeberAvatarProps{
    name?:string,
    className?:string,
    fallbackClassName?:string
}
const MemeberAvatar = ({name,className,fallbackClassName}:MemeberAvatarProps) => {
    
    return(
        <Avatar className={cn("size-5 transition border border-neutral-300 rounded-full ",className)}>
            <AvatarFallback className={cn("bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",fallbackClassName)}>
                {name?.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )

}

export default MemeberAvatar