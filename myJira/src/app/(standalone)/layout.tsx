import UserButton from "@/components/user-button";
import Image from "next/image";
import Link from "next/link";
import React from "react"

interface StandaloneLayoutProps{
    children:React.ReactNode;
}

const StandaloneLayout = ({children}:StandaloneLayoutProps) => {
  return (
    <main className="min-h-screen bg-neutral-100">
        <div className="mx-auto max-w-screen-2xl p-4">
            <nav className="flex justify-between items-center h-[73px]">
                <Link href="/">
                    <Image src="/logo.svg" alt="logo" height={56} width={152}/>
                </Link>
                <UserButton/>
            </nav>
            <div className="flex flex-col justify-center items-center py-4">
                {children}
            </div>
        </div>
    </main>
    
  )
}

export default StandaloneLayout