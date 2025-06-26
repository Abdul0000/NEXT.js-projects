import { Dialog, DialogContent,DialogHeader,DialogTitle } from "./ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer"
import React from "react"
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveModalProps{
    children:React.ReactNode;
    open:boolean;
    onOpenChange:(open:boolean) => void;
    title:string;
}

const ResponsiveModel = ({children,open,onOpenChange,title}:ResponsiveModalProps) => {
    const isMobile = useIsMobile()
    if(!isMobile){
        return(
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                        {children}
                </DialogContent>
            </Dialog>
        )
    }
    return(
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>
                    {title}
                </DrawerTitle>
            </DrawerHeader>
                {children}
            </DrawerContent>
        </Drawer>
    )
}

export default ResponsiveModel