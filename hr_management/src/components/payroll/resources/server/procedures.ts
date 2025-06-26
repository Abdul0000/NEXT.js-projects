import { db } from "@/db";
import { country, insertCountrySchema, insertWorkingSheduleSchema, updateCountrySchema, workingSchedules } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, eq } from "drizzle-orm";

import { z } from "zod";

export const workingSheduleRouter = createTRPCRouter({
    createWorkingShedule: protectedProcedure.input(insertWorkingSheduleSchema).mutation(async({ctx, input})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const createdWorkShedule = await db.insert(workingSchedules).values({
            userId,
            ...input,
            })

        if(!createdWorkShedule) {
            throw new Error("Country failed to work shedule")
        }
        return createdWorkShedule
    }),
    updateWorkingShedule: protectedProcedure
     .input(
        insertWorkingSheduleSchema)
    .mutation(async({ctx, input}
    )=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const {id:work_shedule_id, ...data} = input
        if(!work_shedule_id) return false
        const updatedWorkShedule = await db.update(workingSchedules).set({
            userId,
            ...data,
            })
            .where(and(
                eq(workingSchedules.userId, userId),
                eq(workingSchedules.id, work_shedule_id as string)
            ))

        if(!updatedWorkShedule) {
            throw new Error("Work shedule failed to update")
        }
        return updatedWorkShedule
    }),

    getAllWorkingShedules: protectedProcedure.query(async({ctx})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const workShedules = await db.select()
                        .from(workingSchedules)
                        .where(eq(workingSchedules.userId, userId))
        if(!workShedules) return ("Fail to fetch work shedules")
        return workShedules
    }),
    getOneWorkingShedule: protectedProcedure
    .input(insertWorkingSheduleSchema)
    .query(async({ctx, input})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const {id:shedule_id} = input
        if(!shedule_id) return false
        const [workShedule] = await db.select()
                        .from(workingSchedules)
                        .where(and(eq(workingSchedules.userId, userId),eq(workingSchedules.id, shedule_id)))
        return workShedule
    }),
    getAllWorkingShedulesPage: protectedProcedure
    .input(z.object({
        page:z.number(),
        perPage: z.number(),
    }))
    .query(async({ctx, input})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const [countRecords] = await db.select({count:count()})
                            .from(workingSchedules)
                            .where(eq(workingSchedules.userId, userId))
        const offset = (input.page - 1) * input.perPage
        const limit = input.perPage
        const totalPages = Math.ceil(countRecords.count/limit)

        const workShedulesPage = await db.select()
                        .from(workingSchedules)
                        .offset(offset)
                        .limit(limit)
                        .where(eq(workingSchedules.userId, userId))
        // if(!workShedulesPage) return ("Fail to fetch workShedule")
        return {workShedulesPage,totalPages}
    }),

    createCountry: protectedProcedure.input(
        insertCountrySchema
    ).mutation(async({ctx, input})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const createdCountry = await db.insert(country).values({
            ...input,
            country_name:input.country_name ??"",
            currency: input.currency ??"",
            country_code: input.country_code ??"",
            country_calling_code:input.country_calling_code ??0,
            userId
        }).returning()

        if(!createdCountry) {
            throw new Error("Country failed to create")
        }
        return createdCountry
    }),
    updateCountry: protectedProcedure.input(
       updateCountrySchema
    ).mutation(async({ctx, input})=>{
        const userId = ctx.session
        
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const {id:country_id} = input
        if(!country_id) return false
        const updatedCountry = await db.update(country).set({
            userId,
            ...input,
            })
            .where(and(eq(country.userId, userId),eq(country.id, country_id)))

        if(!updatedCountry) {
            throw new Error("Country failed to update")
        }
        return updatedCountry
    }),
    getOneCountry: protectedProcedure.input(
    updateCountrySchema
    )
    .query(async({ctx, input})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const {id:country_id} = input
        if(!country_id) return false
        const [getCountry] = await db.select()
                        .from(country)
                        .where(and(eq(country.userId, userId),eq(country.id, country_id)))
        return getCountry
    }),

    getAllCountries: protectedProcedure.query(async({ctx})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const countries = await db.select()
                        .from(country)
                        .where(eq(country.userId, userId))
        if(!countries) return ("Fail to fetch countries")
        return countries
    }),
    getAllCountriesPage: protectedProcedure
    .input(z.object({
        page:z.number(),
        perPage: z.number(),
    }))
    .query(async({ctx, input})=>{
        const userId = ctx.session
        if(!userId) throw new Error("UNAUTHORIZED USER")
        const [countRecords] = await db.select({count:count()})
                            .from(country)
                            .where(eq(country.userId, userId))
        const offset = (input.page - 1) * input.perPage
        const limit = input.perPage
        const totalPages = Math.ceil(countRecords.count/limit)

        const countries = await db.select()
                        .from(country)
                        .offset(offset)
                        .limit(limit)
                        .where(eq(country.userId, userId))
        if(!countries) return ("Fail to fetch countries")
        return {countries, totalPages}
    })
})
