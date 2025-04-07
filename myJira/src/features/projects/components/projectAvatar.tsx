import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface workspaceAvatarProps{
    image?:string,
    name?:string,
    className?:string
}
const ProjectAvatar = ({image,name,className}:workspaceAvatarProps) => {
    if (image){
        return (
            <div className={cn(
                "size-6 relative rounded-md overflow-hidden",
                className
            )}>
                <Image alt="" src={image} fill className="object-cover"/>
            </div>
        )
    }
    return(
        <Avatar className={cn("size-6 rounded-md",className)}>
            <AvatarFallback className="text-white bg-blue-600 font-semibold uppercase rounded-md">
                {name && name[0]}
            </AvatarFallback>
        </Avatar>
    )

}

export default ProjectAvatar