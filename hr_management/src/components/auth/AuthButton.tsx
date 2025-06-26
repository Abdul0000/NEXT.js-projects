"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SignIn from "./SignIn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button";
import Register from "./Register";
import { Loader2Icon } from "lucide-react";
import ProfileCard from "./ProfileDetails";

const AuthButton = () => {
  const { data: session, status } = useSession();
  const [card,setCard]= useState("login"); // Default to profile card
  // Early loading state

  if (status === "loading") {
    return (
        <Loader2Icon className="size-4 animate-spin"/> 
    );
  }

  const setCardData = (data: string) => {
    setCard(data);
  };
  // If authenticated, show nothing (or a different UI, if needed)
//   if (status === "authenticated") {
//     return null;
//   }

  return (
    <Popover>
      <PopoverTrigger asChild>
          {session && session.user.id ? <Avatar className="cursor-pointer">
            <AvatarImage src="https://github.com/shadc" />
            <AvatarFallback className="text-xl font-bold bg-pink-600 text-white">{session.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar> 
            :
        <Button onClick={() => setCardData("login")} className="rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Sign In
        </Button>
            }
        
      </PopoverTrigger>
      <PopoverContent className="m-0 p-0 mr-8">
        {
            session && session.user.id
            ? <ProfileCard setCardData={setCardData} />
            :
            card === "login" 
            ? <SignIn setCardData={setCardData} />
            :  card !== "profile" && <Register setCardData={setCardData} />
        }
      </PopoverContent>
    </Popover>
  );
};

export default AuthButton;
