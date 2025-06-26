import WorkingScheduleForm from "@/components/payroll/resources/WorkingSheduleForm"
import { createTRPCContext } from "@/trpc/init";


const page = async() => {
  const {session} =await createTRPCContext()
        
    if(!session){
      return(<p>Need to Login or Register</p>)
    } ; 

  return (
    <div>
        <WorkingScheduleForm/>
    </div>
  )
}

export default page