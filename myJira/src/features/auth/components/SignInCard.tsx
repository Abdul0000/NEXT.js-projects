"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form,FormControl,FormField,FormItem,FormMessage} from "@/components/ui/form"
import { loginSchema } from "@/features/schema"
import { useLogin } from "../api/use-login"
import Link from "next/link"
import { signUpWithGithub, signUpWithGoogle } from "@/lib/server/oauth/page"

const SignInCard = () => {
  const { mutate, isPending } = useLogin()
  const onSubmitHandler=(values:z.infer<typeof loginSchema>)=>{
    mutate({json:values});
    // console.log("mutate",mutate)
  }

  const form = useForm<z.infer <typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email:"",
      password:""
    },
  })
  return (
    <Card className=" w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">
          Log In
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-y-6">
        <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmitHandler)}>  
        <FormField
          name="email"
          control={form.control}
          render={ ({field})=>(
            <FormItem>
            <FormControl>
            <Input type="email" {...field}  placeholder="Enter email address" disabled={false}/>
            </FormControl>
            <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={ ({field})=>(
            <FormItem>
            <FormControl>
            <Input type="password" autoComplete="new-password" {...field} placeholder="Enter password" disabled={false}/>
            </FormControl>
            <FormMessage/>
            </FormItem>
          )}
        />
        <Button className="w-full" variant="primary" size="lg" disabled={isPending}>Login</Button>
        </form>
        </Form>
        
      </CardContent>
      
      <Separator/>
      <CardContent className="p-7 pt-4 flex flex-col gap-y-4">
        <Button type="button" onClick={signUpWithGoogle} variant="secondary" size="lg" disabled={isPending}>
        <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>
      
      <Button onClick={signUpWithGithub} type="button" variant="secondary" size="lg" disabled={isPending}>
        <FaGithub className="mr-2 size-5"/>
        Login with Github
      </Button>
      </CardContent>
      <CardContent className="p-7 pt-0 flex justify-center ">
       <span className="text-gray-600 text-sm"> Don&apos;t have an account? <Link className="text-blue-600" href={"/sign-up"}>Sign Up</Link> </span>
      </CardContent>
    </Card>
  )
}

export default SignInCard