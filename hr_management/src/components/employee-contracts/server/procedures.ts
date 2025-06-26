import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  departments,
  employeeContracts,
  insertEmployeeContractSchema,
  newEmployees,
  updateEmployeeContractSchema,
} from "@/db/schema";
import { and, count, desc, eq } from "drizzle-orm";
const filterFields = ['department', 'job_position', 'status', 'manager'] as const;
  type FilterField = typeof filterFields[number];

  const filterInputSchema = z.object({
    filter_list: z.array(z.enum(filterFields)).optional(),
  });

export const newEmployeeContractRouter = createTRPCRouter({
  createContract: protectedProcedure
    .input(insertEmployeeContractSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing user ID" });
      }

      const [createdContract] = await db
        .insert(employeeContracts)
        .values({ userId, ...input })
        .returning();

      if (!createdContract) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create contract" });
      }

      return createdContract;
    }),

  getAllContracts: protectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const [totalCount] = await db
        .select({ count: count() })
        .from(employeeContracts)
        .where(eq(employeeContracts.userId, userId));

      const offset = (input.page - 1) * input.perPage;
      const limit = input.perPage;
      const totalPages = Math.ceil(totalCount.count / limit);

      const getAllContracts = await db
        .select({
          employeeContracts,
          employee_name: newEmployees.employee_name,
          department_name: departments.department_name,
        })
        .from(employeeContracts)
        .offset(offset)
        .limit(limit)
        .where(eq(employeeContracts.userId, userId))
        .leftJoin(newEmployees, eq(employeeContracts.employee_id, newEmployees.id))
        .leftJoin(departments, eq(employeeContracts.department_id, departments.id))
        .orderBy(desc(employeeContracts.id));

      return { getAllContracts, totalPages };
    }),

  // Define a Zod schema for getOneContract input
  getOneContract: protectedProcedure
    .input(
     updateEmployeeContractSchema
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
      const {id:contract_id} = input
      if (!contract_id) return false;
      const [contract] = await db
        .select({
          employeeContracts,
          employee_name: newEmployees.employee_name,
          department_name: departments.department_name,
        })
        .from(employeeContracts)
        .where(eq(employeeContracts.id, contract_id ))
        .leftJoin(newEmployees, eq(employeeContracts.employee_id, newEmployees.id))
        .leftJoin(departments, eq(employeeContracts.department_id, departments.id));

      if (!contract) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Contract not found" });
      }

      return contract;
    }),

  updateEmployeeContract: protectedProcedure
    .input(updateEmployeeContractSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const {id:contract_id } = input;
      if (!contract_id) throw new TRPCError({ code: "BAD_REQUEST", message: "Missing contract ID" });

      const [updatedContract] = await db
        .update(employeeContracts)
        .set(input)
        .where(and(eq(employeeContracts.id, contract_id as string), eq(employeeContracts.userId, userId)))
        .returning();

      if (!updatedContract) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update contract" });
      }

      return updatedContract;
    }),

  updateEmployeeContractStatus: protectedProcedure
    .input(updateEmployeeContractSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
      const {id:contract_id} = input
      if (!contract_id) throw new TRPCError({ code: "BAD_REQUEST", message: "Missing contract ID" });

      const [updated] = await db
        .update(employeeContracts)
        .set({ status: input.status })
        .where(eq(employeeContracts.id, contract_id))
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update status" });
      }

      return updated;
    }),

filterByGroupContract: protectedProcedure
  .input(filterInputSchema)
  .query(async ({ ctx, input }) => {
    const userId = ctx.session;
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
    if (!input.filter_list || input.filter_list.length === 0) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Please provide at least one valid grouping field" });
    }

    const records = await db
      .select({
        userId: employeeContracts.userId,
        id: employeeContracts.id,
        contract_name: employeeContracts.contract_name,
        start_date: employeeContracts.start_date,
        end_date: employeeContracts.end_date,
        working_schedule: employeeContracts.working_schedule,
        job_position: employeeContracts.job_position,
        wage_on_signed: employeeContracts.wage_on_signed,
        contract_type: employeeContracts.contract_type,
        salary_structure_type: employeeContracts.salary_structure_type,
        hr_responsible: employeeContracts.hr_responsible,
        department_id: employeeContracts.department_id,
        employee_id: employeeContracts.employee_id,
        createdAt: employeeContracts.createdAt,
        updatedAt: employeeContracts.updatedAt,
        employee_name: newEmployees.employee_name,
        department_name: departments.department_name,
        status: employeeContracts.status,
      })
      .from(employeeContracts)
      .where(eq(employeeContracts.userId, userId))
      .leftJoin(newEmployees, eq(employeeContracts.employee_id, newEmployees.id))
      .leftJoin(departments, eq(employeeContracts.department_id, departments.id))
      .orderBy(employeeContracts.id);

    const keyMap: Record<Exclude<FilterField, 'manager'>, keyof (typeof records)[number]> = {
      department: 'department_name',
      job_position: 'job_position',
      status: 'status',
    };

    const grouped = records.reduce((acc, record) => {
      const keyValues = input.filter_list!.map(k => record[keyMap[k as keyof typeof keyMap]]);
      const key = JSON.stringify(keyValues);
      const label: Record<string, string | number | null> = {};

      for (const k of input.filter_list!) {
        const prop = keyMap[k as keyof typeof keyMap];
        const value = record[prop];
        label[k] = value instanceof Date ? value.toISOString() : value;
      }

      if (!acc[key]) {
        acc[key] = { group: label, employees: [] };
      }

      acc[key].employees.push(record);
      return acc;
    }, {} as Record<string, { group: Record<FilterField, string | number | null>; employees: typeof records }>);

    return Object.values(grouped);
  }),

});
