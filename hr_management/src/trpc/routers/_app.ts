
import { newEmployeeRouter } from '@/components/new-employee/server/procedures';
import { createTRPCRouter } from '../init';
import { getEmployees } from '@/components/home/server/procedures';
import { departmentRouter } from '@/components/department/server/procedures';
import { newEmployeeContractRouter } from '@/components/employee-contracts/server/procedures';
import { attendanceRouter } from '@/components/attendance/server/procedures';
import { payrollRouter } from '@/components/payroll/server/procedures';
import { workingSheduleRouter } from '@/components/payroll/resources/server/procedures';
import { payrollSalaryRule } from '@/components/payroll/rules/server/procedures';
import { authRouter } from '@/components/auth/routers/authRouter';
import { userRouter } from '@/components/auth/routers/getUser';

export const appRouter = createTRPCRouter({
    createNewEmployee: newEmployeeRouter,
    getEmployees: getEmployees,
    departments: departmentRouter,
    employeeContracts:newEmployeeContractRouter,
    employeeAttendance:attendanceRouter,
    payroll:payrollRouter,
    payrollSalaryRule:payrollSalaryRule,
    settings:workingSheduleRouter,
    registerUser: authRouter,
    getUser: userRouter,
});
export type AppRouter = typeof appRouter;