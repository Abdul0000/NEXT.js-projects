
import { getcurrent } from "@/features/actions"
import SignInCard from "@/features/auth/components/SignInCard"
import { redirect } from "next/navigation"

const SignIn = async() => {
  const user = await getcurrent()
  if(user) redirect("/")
  return (
    <SignInCard/>
  )
}

export default SignIn