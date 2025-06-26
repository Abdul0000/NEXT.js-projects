"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
interface SignInProps {
  setCardData?: (data: string) => void; // Optional prop for setting car
}
const SignIn =({setCardData}:SignInProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn("credentials", {
      redirect: false, // Redirect na karein
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/"); // Successful login ke baad dashboard par redirect karein
    }
  };

  return (
    <div className="flex h-auto flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign In
          </button>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Dont have an account?{" "}
          <Button onClick={() => setCardData?("register"):""} className="bg-white font-medium text-indigo-600 hover:text-indigo-700 hover:bg-transparent">
            Register here
          </Button>
        </p>
      </div>
    </div>
  );
}
export default SignIn;