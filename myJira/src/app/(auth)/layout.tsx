"use client"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

interface AuthlayoutProps{
    children: React.ReactNode
}

const Authlayout = ({children}:AuthlayoutProps) => {
  const pathname= usePathname()

  return (
    <main className="bg-neutral-100 min-h-screen">
    <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between gap-2">
        <Image src='/logo.svg' alt="logo" height={56} width={152} />
        <Link href={pathname === "/sign-up" ? "/sign-in": "/sign-up"}><Button variant="secondary">{pathname === "/sign-up" ? "Login": "Sign Up"}</Button></Link>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
        <Toaster/>
        {children}
        </div> 
    </div>
    </main>
    
  )
}

export default Authlayout