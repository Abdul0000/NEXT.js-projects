"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form,FormControl,FormField,FormItem,FormMessage} from "@/components/ui/form"
import { registerSchema } from "@/features/registerSchema"
import { useRegister } from "../api/use-signup"
import { signUpWithGithub, signUpWithGoogle } from "@/lib/server/oauth/page"

const SignUpCard = () => {
    const { mutate, isPending } =useRegister()
    const submitHandle=(values:z.infer<typeof registerSchema>)=>{
        mutate(values)
      }
    const form= useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues:{
            name:"",
            email:"",
            password:""
        }
    })

  return (
    <Card className=" w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">
          Sign Up
        </CardTitle>
        <CardDescription>
            By signing up, you agree to our{" "}
            <Link href="/privacy" className="text-blue-700">
            Privacy Policy 
            </Link>
            {" "}
            and 
            {" "}
            <Link href="/terms" className="text-blue-700">
            Terms of Service
            </Link>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-y-6">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(submitHandle)}>
        <FormField name="name" control={form.control} 
        render={({field})=>(
            <FormItem>
            <FormControl>
            <Input {...field} type="text" placeholder="Enter your name" disabled={false}/>
            </FormControl>
            <FormMessage/>
            </FormItem>
            )} />

        <FormField name="email" control={form.control} 
        render={({field})=>(
            <FormItem>
            <FormControl>
            <Input {...field} type="email" placeholder="Enter your email" disabled={false}/>
            </FormControl>
            <FormMessage/>
            </FormItem>
            )} />
        <FormField name="password" control={form.control} 
        render={({field})=>(
            <FormItem>
            <FormControl>
            <Input {...field} type="password" autoComplete="new-password" placeholder="Enter your password" disabled={false}/>
            </FormControl>
            <FormMessage/>
            </FormItem>
            )} />

        <Button className="w-full" variant="primary" size="lg" disabled={isPending}>Register</Button>
        </form>
        </Form>
        
      </CardContent>
      
      <Separator/>
      <CardContent className="p-7 pt-4 flex flex-col gap-y-4">
      <Button onClick={signUpWithGoogle} type="button" variant="secondary" size="lg" disabled={isPending}>
        <FcGoogle className="mr-2 size-5"/>
          Login with Google
        </Button>
      
      <Button onClick={signUpWithGithub} type="button" variant="secondary" size="lg" disabled={isPending}>
        <FaGithub className="mr-2 size-5"/>
        Login with Github
      </Button>
      
      </CardContent>
      <CardContent className="p-7 pt-0 flex justify-center ">
       <span className="text-gray-600 text-sm"> Already have an account? <Link className="text-blue-600" href={"/sign-in"}>Sign In</Link> </span>
      </CardContent>
    </Card>
  )
}

export default SignUpCard