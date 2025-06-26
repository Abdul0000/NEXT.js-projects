import NewContract from "@/components/employee-contracts/NewContract"
import { createTRPCContext } from "@/trpc/init";

const page = async() => {
  const {session} =await createTRPCContext()
        
    if(!session){
    return(<p>Need to Login or Register</p>)
  } ; 
  return (
    <div>
        <NewContract/>
    </div>
  )
}

export default page