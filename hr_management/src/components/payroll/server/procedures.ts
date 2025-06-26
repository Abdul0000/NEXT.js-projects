import { db } from "@/db";
import { country, insertSalaryStrucureSchema, insertSalaryStrucureTypeSchema, salaryStructures, salaryStructuresType, updateSalaryStrucureSchema, updateSalaryStrucureTypeSchema, workingSchedules } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";

export const payrollRouter = createTRPCRouter({
    createSalaryStructureType: protectedProcedure.input(insertSalaryStrucureTypeSchema).mutation(async({ctx, input})=>{
        const userId = ctx.session
        
        if(!userId) throw new Error("UNAUTHORIZED USER")
        // const createdStructureType = await db.insert(salaryStructuresType).values({
        //     userId,
        //     ...input,
        //     })
        // if(!createdStructureType) throw new Error("Fail to create salary structure type")
        // return createdStructureType
    }),
    updateSalaryStructureType: protectedProcedure.input(updateSalaryStrucureTypeSchema).mutation(async({ctx, input})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const {id:structureTypeId} = input
        if(!structureTypeId) throw new Error("MISSING STRUCTURE TYPE ID")
        const updatedStructureType = await db.update(salaryStructuresType).set({
            userId,
            ...input,
        })
            .where(and(eq(salaryStructuresType.userId, userId),eq(salaryStructuresType.id,structureTypeId)))
        if(!updatedStructureType) throw new Error("Fail to create salary structure type")
        return updatedStructureType
    }),
    getAllSalaryStructuretype: protectedProcedure.query(async({ctx})=>{
        const userId = ctx.session
        const salaryStructureTypes = await db.select()
            .from(salaryStructuresType)
            .where(eq(salaryStructuresType.userId, userId))
        if(!salaryStructureTypes) throw new Error("Fail to fetch salary structure type")
        return salaryStructureTypes
    }),
    getOneSalaryStructuretype: protectedProcedure
    .input(updateSalaryStrucureTypeSchema)
    .query(async({ctx,input})=>{
        const userId = ctx.session
        const {id:structureTypeId} = input
        if(!structureTypeId) return false
        
        // if(!userId) throw new Error("UNAUTHORIZED USER")
        const [salaryStructureType] = await db.select()
        .from(salaryStructuresType)
        .where(and(eq(salaryStructuresType.userId, userId),eq(salaryStructuresType.id,structureTypeId)))
        if(!salaryStructureType) throw new Error("Fail to fetch salary structure type")
        return salaryStructureType
    }),
    getAllSalaryStructuretypePage: protectedProcedure.input(z.object({
        page:z.number(),
        perPage:z.number(),
    })).query(async({ctx, input})=>{
        const userId = ctx.session
        // 
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const [countRecords] = await db.select({count:count()})
                            .from(salaryStructuresType)
                            .where(eq(salaryStructuresType.userId, userId))
        const offset = (input.page - 1) * input.page
        const limit = input.perPage
        const totalPages = Math.ceil(countRecords.count/limit)
        const salaryStructureTypes = await db.select({
            salaryStructuresType,
            country_name: country.country_name,
            work_shedule_name: workingSchedules.work_shedule_name,
            pay_structure_name: salaryStructures.salary_structure_name,
        })
            .from(salaryStructuresType)
            .offset(offset)
            .limit(limit)
            .leftJoin(country,eq(country.id, salaryStructuresType.country_id))
            .leftJoin(workingSchedules,eq(workingSchedules.id, salaryStructuresType.working_hours_id))
            .leftJoin(salaryStructures,eq(salaryStructures.id,salaryStructuresType.pay_structure_id))
            .where(eq(salaryStructuresType.userId, userId))

        if(!salaryStructureTypes) throw new Error("Fail to fetch salary structure type")
        return {salaryStructureTypes, totalPages}
    }),

    createSalaryStructure: protectedProcedure.input(insertSalaryStrucureSchema).mutation(async({ctx, input})=>{
        const userId = ctx.session
        
        if(!userId) throw new Error("UNAUTHORIZED USER")
        // const createdStructure = await db.insert(salaryStructures).values({
        //     userId,
        //     ...input
        // })
        // if(!createdStructure) throw new Error("Fail to create salary structure")
        // return createdStructure
    }),
    updateSalaryStructure: protectedProcedure.input(updateSalaryStrucureSchema).mutation(async({ctx, input})=>{
        const userId = ctx.session
        
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const {structureId} = input
        if(!structureId) throw new Error("MISSING STRUCTURE ID")
        const updatedStructure = await db.update(salaryStructures).set({
            userId,
            ...input,
        }).where(and(eq(salaryStructures.userId,userId),eq(salaryStructures.id, structureId)))
        if(!updatedStructure) throw new Error("Fail to update salary structure")
        return updatedStructure
    }),
    getOneSalaryStructure: protectedProcedure
    .input(updateSalaryStrucureSchema)
    .query(async({ctx,input})=>{
        const userId = ctx.session
        const {structureId} = input
        if(!structureId) return false
        
        const [salaryStructure] = await db.select()
        .from(salaryStructures)
        .where(and(eq(salaryStructures.userId, userId),eq(salaryStructures.id,structureId)))
        if(!salaryStructure) throw new Error("Fail to fetch salary structure")
        return salaryStructure
    }),
    getAllSalaryStructure: protectedProcedure.query(async({ctx})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const salaryStructure = await db.select()
            .from(salaryStructures)
            .where(eq(salaryStructures.userId, userId))
        if(!salaryStructure) throw new Error("Fail to fetch salary structure")
        return salaryStructure
    }),
    getAllSalaryStructurePage: protectedProcedure.input(
        z.object({
            page:z.number(),
            perPage:z.number(),
        })
    ).query(async({ctx, input})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const [countRecords] = await db.select({count:count()})
                                    .from(salaryStructures)
                                    .where(eq(salaryStructures.userId, userId))
        const offset = (input.page - 1) * input.perPage
        const limit = input.perPage
        const totalPages = Math.ceil(countRecords.count/limit)

        const salaryStructurePage = await db.select({
            salaryStructures,
            country_name: country.country_name
         })
            .from(salaryStructures)
            .offset(offset)
            .limit(limit)
            .leftJoin(country,eq(country.id, salaryStructures.country_id))
            .where(eq(salaryStructures.userId, userId))
        if(!salaryStructurePage) throw new Error("Fail to fetch salary structure")
        return {salaryStructurePage, totalPages}
    })
})
