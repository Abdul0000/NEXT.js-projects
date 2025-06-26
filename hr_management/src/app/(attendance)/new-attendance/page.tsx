import AttendanceForm from '@/components/attendance/AttendanceForm'
import Loading from '@/components/Loading'
import { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<Loading/>}>
        <AttendanceForm title='attendance'/>
    </Suspense>
  )
}

export default page