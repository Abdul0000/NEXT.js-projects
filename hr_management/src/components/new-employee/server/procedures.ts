import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { insertNewEmployeeSchema, newEmployees } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const newEmployeeRouter = createTRPCRouter({
    createEmployee: protectedProcedure.input(insertNewEmployeeSchema).mutation(async ({ ctx, input })=>{
        const userId  = ctx.session
        if(!userId) throw new Error("MISSING USER")
        const [createEmployee] = await db.insert(newEmployees).values({
            userId,
            ...input,
        })
        .returning()
        if(!createEmployee) {
            throw new Error("Employee failed to create")
        }
        return createEmployee
    }),

    updateEmployee: protectedProcedure.input(insertNewEmployeeSchema).mutation(async ({ ctx, input })=>{
        const userId  = ctx.session
        if(!userId) {
            throw new Error("User ID is required")
        }
        const {id:employee_id} = input
        if(!employee_id) return false
        const [createEmployee] = await db
        .update(newEmployees)
        .set({
            userId,
            ...input,
        }).where(and(eq(newEmployees.userId, userId), eq(newEmployees.id, employee_id)))
        .returning()
        if(!createEmployee) {
            throw new Error("Employee failed to update")
        }
        return createEmployee
    }),
})
