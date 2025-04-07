import { useMedia } from "react-use"
import { Dialog, DialogContent,DialogTitle } from "./ui/dialog"
import { Drawer, DrawerContent } from "./ui/drawer"
import React from "react"

interface ResponsiveModalProps{
    children:React.ReactNode;
    open:boolean;
    onOpenChange:(open:boolean) => void;
}

const ResponsiveModel = ({children,open,onOpenChange}:ResponsiveModalProps) => {
    const isDesktop= useMedia("(min-width: 1024px)",true)
    if(isDesktop){
        return(
            <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogTitle></DialogTitle>
                <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
                    {children}
                </DialogContent>
            </Dialog>
        )
    }
    return(
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="m-7">
                <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default ResponsiveModel