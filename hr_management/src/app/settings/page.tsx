import { createTRPCContext } from "@/trpc/init";


const page = async() => {
  const {session} =await createTRPCContext()
        
    if(!session){
    return(<p>Need to Login or Register</p>)
  } ;
    
  return (
    <div>
        Settings
    </div>
  )
}

export default page