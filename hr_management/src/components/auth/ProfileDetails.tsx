"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CiLogout } from "react-icons/ci";
import { signOut } from "next-auth/react";
import { trpc } from "@/trpc/client";

interface SignInProps {
  setCardData?: (data: string) => void;
}

const ProfileCard = ({ setCardData }: SignInProps) => {
  // const router = useRouter();
  const [data] = trpc.getUser.getMe.useSuspenseQuery();

  const handleLogout = async() => {
    // implement logout logic here
    const logout =await signOut()
    if(logout){
      setCardData?.("login")
    }
    console.log("Logging out...");
  };

  return (
    <Card className="w-full max-w-xs rounded-2xl shadow-xl border">
      <CardContent className="p-0">
        {/* Profile Info */}
        <div className="flex flex-col items-center p-6 text-center bg-muted">
          <Avatar className="h-16 w-16 border-2 border-white shadow">
            {/* AvatarImage can go here */}
            <AvatarFallback className="text-xl font-bold bg-pink-600 text-white">
              A
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-lg font-semibold text-foreground">{data?.name ?? ""}</h2>
          <p className="text-sm text-muted-foreground">{data?.email ?? ""}</p>
        </div>

        <Separator className="my-2" />

        {/* Options */}
        <div className="divide-y text-sm">
          <div
            className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-accent"
            onClick={() => setCardData?.("passwords")}
          >
            <span className="text-muted-foreground">🔐</span>
            <span className="text-foreground">Passwords & Autofill</span>
          </div>

          <div
            className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-accent"
            onClick={() => setCardData?.("google-account")}
          >
            <span className="text-muted-foreground">⚙️</span>
            <span className="text-foreground">Manage Google Account</span>
          </div>

          <div
            className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-accent"
            onClick={() => setCardData?.("customize-profile")}
          >
            <span className="text-muted-foreground">✏️</span>
            <span className="text-foreground">Customize Profile</span>
          </div>

          <div
            className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-red-100"
            onClick={handleLogout}
          >
            <CiLogout className="text-destructive text-xl" />
            <span className="text-destructive">Log Out</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
