"use client"
import { trpc } from "@/trpc/client";
import { signOut } from "next-auth/react";
import { Suspense } from "react";
import Loading from "../Loading";

interface DashboardProps{
    session:{user?: {
        email: string;
        id: string;
    };}
}
const Dashboard = ({session}: DashboardProps) => {
    // const { data: session } = useSession();
    // if(!session || !session.user) {
    //   return null;
    // }
    const [userDetails] = trpc.getUser.getMe.useSuspenseQuery();
    // const { data: session } = useSession();

  return (
    <Suspense fallback={<Loading/>}>
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Welcome to your Dashboard!
        </h1>

        <div className="mb-4 text-center">
          <p className="text-lg text-gray-700">
            You are logged in as: <span className="font-semibold">{session.user?.email}</span>
          </p>
          {session.user?.id && (
            <p className="text-sm text-gray-500">User ID from session: {session.user.id}</p>
          )}
        </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Your Full Profile (from tRPC)</h2>
            <p className="mb-2">
              <span className="font-medium">Email:</span> {userDetails.email}
            </p>
            <p className="mb-2">
              <span className="font-medium">Account Created At:</span>{" "}
              {new Date(userDetails.createdAt).toLocaleString()}
            </p>
            <p className="mb-2">
              <span className="font-medium">Last Updated At:</span>{" "}
              {new Date(userDetails.updatedAt).toLocaleString()}
            </p>
          </div>
        
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })} // Sign out and redirect to login
          className="mt-8 block w-full rounded-md bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </div>
    </div>
    </Suspense>
  )
}

export default Dashboard