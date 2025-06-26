import CountriesForm from '@/components/payroll/countries/CountriesForm'
import React from 'react'

import { createTRPCContext } from "@/trpc/init";


const page = async() => {
  const {session} =await createTRPCContext()
        
    if(!session){
    return(<p>Need to Login or Register</p>)
  } ; 
    
  return (
    <div>
        <CountriesForm/>
    </div>
  )
}

export default page