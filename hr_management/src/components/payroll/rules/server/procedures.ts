import { db } from "@/db";
import { insertSalaryRulesSchema, salaryRules, updateSalaryRuleSchema } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, eq } from "drizzle-orm";

import { z } from "zod";

export const payrollSalaryRule = createTRPCRouter({
    createSalaryrule: protectedProcedure.input(insertSalaryRulesSchema).mutation(async({ctx, input})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const createdSalaryrule = await db.insert(salaryRules).values({
            ...input,
            userId: userId,
        })
        if(!createdSalaryrule) throw new Error("Fail to create salary rule")
        return createdSalaryrule
    }),

    updateSalaryrule: protectedProcedure.input(insertSalaryRulesSchema).mutation(async({ctx, input})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const {id:rule_id} = input
        if(!rule_id) throw new Error("MISSING RULE ID")
        const updatedSalaryrule = await db.update(salaryRules).set({
            userId,
            ...input,
        }).where(and(eq(salaryRules.userId,userId),eq(salaryRules.id, rule_id)))
        if(!updatedSalaryrule) throw new Error("Fail to update salary rule")
        return updatedSalaryrule
    }),

    getAllSalaryRulesPage: protectedProcedure.input(z.object({
        page:z.number(),
        perPage: z.number(),
    })).query(async({ctx, input})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const [countRecords] = await db.select({count:count()})
                            .from(salaryRules)
                            .where(eq(salaryRules.userId, userId))
        const offset = (input.page - 1) * input.perPage
        const limit = input.perPage
        const totalPages = Math.ceil(countRecords.count/limit)
        const salaryRuleRecords = await db.select()
            .from(salaryRules)
            .offset(offset)
            .limit(limit)
            .where(eq(salaryRules.userId, userId))
        if(!salaryRuleRecords) throw new Error("Fail to fetch salary structure rule")
        return {salaryRuleRecords, totalPages}
    }),
    getOneSalaryRule: protectedProcedure
    .input(updateSalaryRuleSchema)
    .query(async({ctx,input})=>{
        const userId = ctx.session
        const {id:rule_id} = input
        if(!rule_id) return false
        const [salaryRule] = await db.select()
            .from(salaryRules)
            .where(and(eq(salaryRules.userId, userId),eq(salaryRules.id, rule_id)))
        if(!salaryRule) throw new Error("Fail to fetch salary rule")
        return salaryRule
    }),
    // getAllSalaryRules: protectedProcedure.query(async({ctx})=>{
    //     const userId = ctx.session
    //     if(!userId) redirect("/signin")
    //     if(!userId) throw new Error("UNAUTHORIZED USER")
    //     const salaryStructureTypes = await db.select()
    //         .from(salaryStructuresType)
    //         .where(eq(salaryStructuresType.userId, userId))
    //     if(!salaryStructureTypes) throw new Error("Fail to fetch salary structure type")
    //     return salaryStructureTypes
    // }),
})
