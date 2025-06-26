"use client";

import { useState } from "react";
// import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Register ke baad direct login ke liye
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "../ui/button";
interface RegisterProps {  
    setCardData?: (data: string) => void; // Optional prop for setting card data
}
const Register = ({ setCardData }: RegisterProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const registerMutation = trpc.registerUser.register.useMutation({
    onSuccess: () => {
      setSuccess("Registration successful! Redirecting to login...");
      toast.success("Registration successful! Redirecting to login...");

      // Redirect to login page after successful registration
      router.push("/signin");
    },
    onError: (err) => {
      setError(err.message || "An unexpected error occurred during registration.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await registerMutation.mutateAsync({ name, email, password });
      setSuccess("Registration successful! Redirecting to login...");
      
      // Optional: Auto-login after successful registration
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Registration successful, but auto-login failed: " + result.error);
        router.push("/");
      } else {
        router.push("/");
      }

    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "message" in err) {
        setError((err as { message: string }).message);
      } else {
        setError("An unexpected error occurred during registration.");
      }
    }
  };

  return (
    <div className="flex h-auto flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          {success && <p className="mt-2 text-center text-sm text-green-600">{success}</p>}
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Button onClick={() => setCardData?("login"):""} className="bg-white font-medium text-indigo-600 hover:text-indigo-700 hover:bg-transparent">
            Login here
          </Button>
        </p>
      </div>
    </div>
  );
}
export default Register;