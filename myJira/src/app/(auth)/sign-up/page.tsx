import { getcurrent } from "@/features/actions"
import SignUpCard from "@/features/auth/components/SignUpCard"
import { redirect } from "next/navigation"

const SignUp = async() => {
  const user = await getcurrent()
  if(user) redirect("/")
  return (
    <SignUpCard/>
  )
}

export default SignUp