import {  createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { boolean, date, doublePrecision, integer, numeric, pgEnum, pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";
import { users } from "./auth-schema";

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").references(()=> users.id ,{
    onDelete:"cascade"
  }),
  department_name: text("department_name"),
  manager: text("manager"),
  parent_department: text("parent_department"),
  company: text("company"),
  employees: text("employees"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
})
export type insertDepartmentSchemaType = typeof departments.$inferInsert
export const insertDepartmentSchema = createInsertSchema(departments)
export const selectDepartmentSchema = createSelectSchema(departments);
export const updateDepartmentSchema = createUpdateSchema(departments);

export const newEmployees = pgTable("newEmployees", {
  id: uuid("id").primaryKey().defaultRandom(),
  image_url: text("image_url"),
  imageKey: text("image_key"),
  userId: uuid("userId").references(()=> users.id ,{
    onDelete:"cascade"
  }),
  expense: uuid("expense"),
  time_off: uuid("time_off"),
  timesheet: uuid("timesheet"),
  attendance: uuid("attendance"),
  employee_name: text("employee_name").notNull(),
  job_title: text("job_title"),
  work_email: text("work_email"),
  work_phone: text("work_phone").notNull(),
  work_mobile: text("work_mobile").notNull(),
  company: text("company"),
  tags: text("tags"),
  job_position: text("job_position"),
  manager: text("manager"),
  coach: text("coach"),
  department_id: uuid("department_id").references(() => departments.id, {
  onDelete: "set null"
}),

  // Work Information – Schedule
  working_hours:          text("working_hours"),
  timezone:               text("timezone"),

  // Private Contact
  private_address_street1:   text("private_address_street1"),
  private_address_street2:   text("private_address_street2"),
  private_address_city:      text("private_address_city"),
  private_address_state:     text("private_address_state"),
  private_address_zip:       text("private_address_zip"),
  private_address_country:   text("private_address_country"),
  private_email:             text("private_email"),
  private_phone:             text("private_phone"),
  bank_account:            text("bank_account"),
  home_work_distance:      integer("home_work_distance"),
  private_car_plate:       text("private_car_plate"),

  // Citizenship
  nationality_country:     text("nationality_country"),
  identification_no:       text("identification_no"),
  ssn_no:                  text("ssn_no"),
  passport_no:             text("passport_no"),
  gender:                  text("gender"),
  birthday:                date("birthday"),
  place_of_birth:          text("place_of_birth"),
  country_of_birth:        text("country_of_birth"),
  non_resident:            boolean("non_resident"),

  // Emergency Contact
  emergency_contact_name:  text("emergency_contact_name"),
  emergency_contact_phone: text("emergency_contact_phone"),

  // Family Status
  marital_status:                text("marital_status"),
  number_of_dependent_children:  integer("number_of_dependent_children"),

  // Education
  certificate_level:       text("certificate_level"),
  field_of_study:          text("field_of_study"),
  school:                  text("school"),

  // Work Permit
  visa_no:                        text("visa_no"),
  work_permit_no:                 text("work_permit_no"),
  visa_expiration_date:           date("visa_expiration_date"),
  work_permit_expiration_date:    date("work_permit_expiration_date"),
  work_permit_file:               text("work_permit_file"),

  // Settings
  employee_type:            text("employee_type"),
  related_user:             text("related_user"),
  hourly_cost:              numeric("hourly_cost", { precision: 10, scale: 2 }),
  fleet_mobility_card:      text("fleet_mobility_card"),
  pin_code:                 text("pin_code"),
  badge_id:                 text("badge_id"),

  // Payroll
  legal_name:               text("legal_name"),
  payslip_language:         text("payslip_language"),
  employee_reference:       text("employee_reference"),
  disabled:                 boolean("disabled").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()  
});

const phoneSchema = z.string()
  .regex(/^(\+?\d{7,15})$/, "Invalid phone number");

export type insertNewEmployeeSchemaType = typeof newEmployees.$inferInsert
export const insertNewEmployeeSchema = createInsertSchema(newEmployees,{
  employee_name: z.string().min(2,{
    message:"Atleast 2 characaters"
  }).max(50),
  work_mobile:phoneSchema,
  work_phone:phoneSchema,
})
export const selectNewEmployeeSchema = createSelectSchema(newEmployees);
export const updateNewEmployeeSchema = createUpdateSchema(newEmployees)

export const employeeContracts = pgTable("employeeContracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId"),
  status: text("status").default("new"),
  contract_name: text("contract_name").notNull(),
  start_date: date("start_date"),
  end_date: date("end_date"),
  working_schedule: text("working_schedule"),
  job_position: text("job_position"),
  wage_on_signed: doublePrecision("wage_on_signed").default(0), 
  contract_type: text("contract_type"),
  salary_structure_type: text("salary_structure_type"),
  hr_responsible: text("hr_responsible"),
  department_id: uuid("department_id").references(() => departments.id, {
  onDelete: "set null" }),
  employee_id: uuid("employeee_id").references(() => newEmployees.id, {
  onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow() 
});

export const insertEmployeeContractSchema = createInsertSchema(employeeContracts)
export const selectEmployeeContractSchema = createSelectSchema(employeeContracts);
export const updateEmployeeContractSchema = createUpdateSchema(employeeContracts)

export type insertEmployeeContractSchemaType = typeof employeeContracts.$inferInsert
export type updateEmployeeContractSchemaType = typeof employeeContracts.$inferSelect

export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").references(()=> users.id ,{
    onDelete:"cascade"
  }),
  employee_id: uuid("employee_id").references(()=> newEmployees.id,{onDelete:"cascade"}),
  check_in: date("check_in").notNull().defaultNow(),
  check_out: date("check_out").notNull().defaultNow(),
  work_time: numeric("work_time", { precision: 5, scale: 2 }).default("0.00"),
  extra_hours: numeric("extra_hours", { precision: 5, scale: 2 }).default("0.00"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEmployeeAttendanceSchema = createInsertSchema(attendance).extend({
  employee_name: z.string().optional(),
  status: z.string().optional(),
})
export const selectEmployeeAttendanceSchema = createSelectSchema(attendance)
export const updateEmployeeAttendanceSchema = createUpdateSchema(attendance)

export const country = pgTable("country", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
  country_name: text("country_name").notNull(),
  currency: text("currency").notNull(),
  country_code: text("country_code").notNull(),
  country_calling_code: integer("country_calling_code").notNull(),
  vat_label: text("val_label"),
  intrastat_member: boolean("intrastat_member"),
  enforce_cities: boolean("enforce_cities"),
  zip_required: boolean("zip_required"),
  state_required: boolean("state_required"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCountrySchema = createInsertSchema(country)
export const selectCountrySchema = createSelectSchema(country)
export type insertCountrySchemaType =  typeof country.$inferInsert
export type selectCountrySchemaType = typeof country.$inferSelect


export const updateCountrySchema = createUpdateSchema(country)

export const workingSchedules = pgTable("working_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
  work_shedule_name: text("work_shedule_name"),
  flexible_hours: boolean("flexible_hours").default(false).notNull(),
  company_full_time: text("company_full_time"),
  average_hour_per_day: integer("average_hour_per_day"),
  work_time_rate: integer("work_time_rate"),
  company_name: text("company_name"),
  timezone: text("timezone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWorkingSheduleSchema = createInsertSchema(workingSchedules)
export const selectWorkingSheduleSchema = createSelectSchema(workingSchedules)
export const updateWorkingSheduleSchema = createUpdateSchema(workingSchedules)

export const workScheduleLines = pgTable('work_schedule_lines', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
  name: text('name'),
  dayOfWeek: text('day_of_week'),
  dayPeriod: text('day_period'),
  workFrom: time('work_from'),
  workTo: time('work_to'),
  duration: text('duration'),
  workEntryType: text('work_entry_type'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertWorkSheduleLineSchema = typeof workScheduleLines.$inferInsert

export const insertWorkSheduleLineSchema = createInsertSchema(workScheduleLines)
export const selectWorkSheduleLineSchema = createSelectSchema(workScheduleLines)
export const updateWorkSheduleLineSchema = createUpdateSchema(workScheduleLines)

export const scheduled_pay = pgEnum("scheduled_pay", [
  "annually",
  "semi-annually",
  "quarterly",
  "bi-monthly",
  "monthly",
  "bi-weekly",
  "weekly",
  "daily",
]);
export const salaryStructuresType = pgTable("salary_structures_type", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
  structure_type_name: text("structure_type_name").notNull(),
  country_id: uuid("country_id").notNull().references(() => country.id, { onDelete: "cascade" }),
  wage_type: text("wage_type").notNull(),         
  sheduled_pay: scheduled_pay("sheduled_pay").notNull(), 
  working_hours_id: uuid("working_hours_id"),
  pay_structure_id: uuid("pay_structure_id"),
  work_entry_type_id: uuid("work_entry_type_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSalaryStrucureTypeSchema = createInsertSchema(salaryStructuresType)
  // .extend({
  //   country_name: z.string().optional(),
  //   work_shedule_name : z.string().optional(),
  //   pay_structure_name : z.string().optional(),
  //   structureTypeId : z.string().optional(),
  // })
export const selectSalaryStrucureTypeSchema = createSelectSchema(salaryStructuresType)
export const updateSalaryStrucureTypeSchema = createUpdateSchema(salaryStructuresType)
// .
// extend({
//   country_name: z.string().optional(),
//   work_shedule_name: z.string().optional(),
//   salary_structure_name:z.string().optional(),
// })

export const salaryStructures = pgTable("salaryStructures", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
  salary_structure_name: text("salary_structure_name").notNull(),
  structure_type_id: uuid("structure_type_id").references(() => salaryStructuresType.id, {
    onDelete: "set null",
  }),
  country_id: uuid("country_id").references(() => country.id, {
    onDelete: "set null",
  }),
  use_work_day_lines: boolean("use_work_day_lines").default(false),
  year_to_date_computation: boolean("year_to_date_computation").default(false),
  template_id: uuid("template_id"),
  payslip_name: text("payslip_name"),
  shedule_pay: scheduled_pay("shedule_pay"),
  salary_journal: text("salary_journal"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSalaryStrucureSchema = createInsertSchema(salaryStructures)
// .extend({
//   country_name:z.string().optional()
// })
export const selectSalaryStrucureSchema = createSelectSchema(salaryStructures)
export const updateSalaryStrucureSchema = createUpdateSchema(salaryStructures)
// .extend({structureId: z.string().optional()})

export const salaryRules = pgTable("salary_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
  rule_name: text("rule_name"),
  code: text("code").notNull(),
  category_id: uuid("category_id").references(() => departments.id, {
    onDelete: "set null",
  }),
  salary_structure_id: uuid("salary_structure_id").references(() => salaryStructures.id, {
    onDelete: "set null",
  }),
  active: boolean("active").default(false),
  appears_on_payslip: boolean("appears_on_payslip").default(false),
  view_on_payroll_reporting: boolean("view_on_payroll_reporting").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const insertSalaryRulesSchema = createInsertSchema(salaryRules)
export const selectSalaryRuleSchema = createSelectSchema(salaryRules)
export const updateSalaryRuleSchema = createUpdateSchema(salaryRules)
.extend({
  id:z.string().optional()
})