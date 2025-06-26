import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { attendance, insertEmployeeAttendanceSchema, newEmployees } from "@/db/schema";
import { count, eq } from "drizzle-orm";
// import { and, eq } from "drizzle-orm";

export const attendanceRouter = createTRPCRouter({
    createAttendance: protectedProcedure.input(insertEmployeeAttendanceSchema).mutation(async ({ ctx, input })=>{
       
        const userId = ctx.session;
        if (!userId) {
          throw new Error("User not found");
        }
        const [createAttendance] = await db.insert(attendance).values({
            ...input,
            userId: userId
        })
        .returning()
        if(!createAttendance) {
            throw new Error("Attendance failed to create")
        }
        return createAttendance
    }),
    getAllAttendance: protectedProcedure
    .input(z.object({
        page: z.number(),
        perPage:  z.number()
    }))
    .query(async ({ctx, input}) => {
    const userId = ctx.session
        if (!userId) {
          throw new Error("User not found");
        }
    const limit = input.perPage
    const offset = (input.page - 1) * input.perPage
    const [attendanceCount] = await db.select({count:count()}).from(attendance)
    const totalPages = Math.ceil(attendanceCount.count/limit)
    const data =  await db.select({
        id: attendance.id,
        userId: attendance.userId,
        employee_id: attendance.employee_id,
        check_in: attendance.check_in,
        check_out: attendance.check_out,
        work_time: attendance.work_time,
        extra_hours: attendance.extra_hours,
        createdAt: attendance.createdAt,
        updatedAt: attendance.updatedAt,
        employee_name: newEmployees.employee_name,
    })
    .from(attendance)
    .offset(offset)
    .limit(limit)
    .leftJoin(newEmployees,eq(attendance.employee_id, newEmployees.id))
    .where(eq(attendance.userId, userId));
    return {data, totalPages};
  }),
})
