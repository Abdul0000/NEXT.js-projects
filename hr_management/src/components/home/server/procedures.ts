import { db } from "@/db";
import { departments, insertNewEmployeeSchema, newEmployees, updateNewEmployeeSchema } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

export const getEmployees = createTRPCRouter({
  getAllEmployees: protectedProcedure
        .input(z.object({
    page: z.number(),
    perPage: z.number(),
  }))
  .query(async ({ ctx, input }) => {
    const userId  = ctx.session;

    // Total count filtered by userId
    const [totalCount] = await db
      .select({ count: count() })
      .from(newEmployees)
      .where(eq(newEmployees.userId, userId));

    const offset = (input.page - 1) * input.perPage;
    const limit = input.perPage;
    const totalPages = Math.ceil(totalCount.count / limit);

    const employees = await db
      .select({
        newEmployees,
        department_name: departments.department_name,
      })
      .from(newEmployees)
      .where(eq(newEmployees.userId, userId))
      .offset(offset)
      .limit(limit)
      .leftJoin(departments, eq(departments.id, newEmployees.department_id))
      .orderBy(desc(newEmployees.id));

    return { employees, totalPages};
  }),
    getOneEmployee: protectedProcedure
        .input(updateNewEmployeeSchema)
        .query(async({ ctx, input })=> {
            const userId  = ctx.session
            const { id:employee_id} = input
            if(!employee_id) return false
            const [employee] = await db.select().from(newEmployees)
            .where(and(eq(newEmployees.userId, userId),eq(newEmployees.id,employee_id)));
            return employee
        }),

    filterByGroup: protectedProcedure
        .input(
        z.object(
        {
            filter_list: z.array(z.enum(['department', 'manager', 'job_position', 'status'])).optional()
        }))
        .query(async ({ ctx, input }) => {
          const userId  = ctx.session
          if (!userId) {
            throw new Error("User not found");
          }

          if (!input.filter_list || input.filter_list.length === 0) {
            throw new Error("Please provide at least one valid grouping field");
          }

          const allEmployees = await db
            .select({
              newEmployees,
              department_name: departments.department_name, 
            })
            .from(newEmployees)
            .leftJoin(departments, eq(departments.id, newEmployees.department_id))
            .where(eq(newEmployees.userId, userId))
            .orderBy(desc(newEmployees.id));

          const groupKeyAccessors = {
            department: 'department_name',  
            manager: 'manager',
            job_position: 'job_position',
            status : 'status'
          };
          const mergedData = allEmployees.map((item)=>({
              ...item.newEmployees,
              department_name:item.department_name
          }))
          const groupedData = mergedData.reduce((acc, employee) => {
        // Create group key from selected fields
          const groupKeyValues = input.filter_list?.map(key => {
            const prop = groupKeyAccessors[key] as keyof z.infer<typeof insertNewEmployeeSchema>;
            return employee[prop];
          });
          const groupKey = JSON.stringify(groupKeyValues);
          // Create group object (human-readable labels)
          const groupObject: Record<string, string | number | null> = {};
          if (input.filter_list) {
            for (const key of input.filter_list) {
              const prop = groupKeyAccessors[key] as keyof z.infer<typeof insertNewEmployeeSchema>;
              groupObject[key] = employee[prop];
            }
          }

          // Check if group exists, if not initialize
          if (!acc[groupKey]) {
            acc[groupKey] = {
              group: groupObject,
              employees: [],
            };
          }

        acc[groupKey].employees.push(employee);

          return acc;
        }, {} as Record<string, { group: Record<string, string | number | null>; employees: z.infer<typeof insertNewEmployeeSchema>[] }>);

        const groupedArray = Object.values(groupedData);
        return groupedArray
        }),

    deleteEmployeeRecords: protectedProcedure
        .input(
        z.object(
        {
          selected_ids: z.array(z.string()).optional()
        }))
        .mutation(async ({ ctx, input }) => {
          const userId  = ctx.session;
          if (!userId) {
            throw new Error("User not found");
          }

          if (!input.selected_ids || input.selected_ids.length === 0) {
            throw new Error("Please provide at least one valid record id");
          }
          const recordsDeleted = await db.delete(newEmployees).where(inArray(newEmployees.id, input.selected_ids));
          return recordsDeleted
        }
      )

})

