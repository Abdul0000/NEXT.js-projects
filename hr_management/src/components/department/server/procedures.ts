import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { departments, insertDepartmentSchema } from "@/db/schema";
import { count, eq } from "drizzle-orm";
// import { and, eq } from "drizzle-orm";
export const departmentRouter = createTRPCRouter({
    createDepartment: protectedProcedure.input(insertDepartmentSchema).mutation(async ({ ctx, input }
    ) => {
        const userId = ctx.session
        if (!userId) {
          throw new Error("User not found");
        }
        const [createdepartemnt] = await db
            .insert(departments)
            .values({
              userId,
              ...input,
            })
      .returning();

        if (!createdepartemnt) {
            throw new Error("Department failed to create")
        }
        return createdepartemnt
    }),
    getAllDepartments: protectedProcedure
    .input(z.object({
        page:z.number(),
        perPage:z.number(),
      }))
      .query(async ({ctx, input}) => {
      const [departmentCount] = await db.select({count:count()}).from(departments)
      const limit = input.perPage
      const offset = (input.page - 1) * input.perPage
      const totalPages = Math.ceil(departmentCount.count/limit)
      // if(!ctx.user){
      //     throw new Error("Department failed to get")
      // }
      const userId = ctx.session
          if (!userId) {
            throw new Error("User not found");
          }
      const data =  await db.select().from(departments)
                  .offset(offset)
                  .limit(limit)
                  .where(eq(departments.userId, userId));
      return {data, totalPages};
    }),


    // updateEmployee: protectedProcedure.input(updateDepartmentSchema).mutation(async ({ ctx, input }:{
    //     ctx: { user: { id: string } },
    //     input: z.infer<typeof updateDepartmentSchema>,
    // })=>{
    //     const userId  = ctx.session
    //     if(!userId) {
    //         throw new Error("User ID is required")
    //     }

    //     if (!input.userId) {
    //         throw new Error("Employee ID (input.userId) is required");
    //     }
    //     const [updateDepartment] = await db
    //     .update(departments)
    //     .set({
    //         department_name:input.department_name,
    //         manager:input.manager,
    //         parent_manager:input.parent_manager,
    //         company:input.company,
    //         updatedAt: new Date(),

    //     }).where(and(eq(newEmployees.userId, userId), eq(newEmployees.id, input.userId)))
    //     .returning()
    //     if(!updateDepartment) {
    //         throw new Error("Employee failed to create")
    //     }
    //     return updateDepartment
    // }),
})
