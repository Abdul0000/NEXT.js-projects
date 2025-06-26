import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertNewEmployeeSchemaType } from "@/db/schema";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface WorkInformationProps {
  form: UseFormReturn<insertNewEmployeeSchemaType>;
  getEmployees: insertNewEmployeeSchemaType[];
}

const WorkInformation = ({ form, getEmployees }: WorkInformationProps) => {
  const approvers_content = ["Expense", "Time Off", "Timesheet", "Attendance"] as const;
  const schedule_fields = ["Working Hours", "Timezone"] as const;

  const getApproverField = (label: string) =>
    label === "Expense"
      ? "expense"
      : label === "Time Off"
      ? "time_off"
      : label === "Timesheet"
      ? "timesheet"
      : label === "Attendance"
      ? "attendance"
      : "";

  const getScheduleField = (label: string) =>
    label === "Working Hours"
      ? "working_hours"
      : label === "Timezone"
      ? "timezone"
      : "";

  return (
    <div className="flex text-gray-800 flex-col gap-y-8 p-4 w-full max-w-full">
      {/* APPROVERS SECTION */}
      <div>
        <p className=" border-gray-300 text-sm font-semibold pb-1">APPROVERS</p>
        <div className="flex flex-col md:flex-row gap-x-2 gap-y-4 pt-4">
          <div className="flex flex-col gap-y-6 mt-2 min-w-[120px]">
            {approvers_content.map((label) => (
              <p className="text-xs lg:text-[0.875rem] font-semibold min-w-36" key={label}>{label}</p>
            ))}
          </div>
          <div className="flex flex-col gap-y-1 w-full">
            {approvers_content.map((label) => {
              const fieldName = getApproverField(label);
              return (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as keyof insertNewEmployeeSchemaType}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={
                            field.value != undefined ? String(field.value) : ""
                          }
                          defaultValue={
                           field.value != undefined ? String(field.value) : ""
                          }
                        >
                          <SelectTrigger className="border-0  rounded-none w-full max-w-[300px]">
                            <SelectValue placeholder={`Select ${label} approver`} />
                          </SelectTrigger>
                          <SelectContent>
                            {getEmployees && Array.isArray(getEmployees) && getEmployees.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id!}>
                                {emp.employee_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* SCHEDULE SECTION */}
      <div>
        <p className=" border-gray-300 text-sm font-semibold pb-1">SCHEDULE</p>
        <div className="flex flex-col md:flex-row gap-x-2 gap-y-4 pt-4">
          <div className="flex flex-col gap-y-6 mt-2 text-gray-700 ">
            {schedule_fields.map((label) => (
              <p className="text-xs lg:text-[0.875rem] font-semibold min-w-36" key={label}>{label}</p>
            ))}
          </div>
          <div className="flex flex-col gap-y-1 w-full">
            {schedule_fields.map((label) => {
              const fieldName = getScheduleField(label);
              return (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as keyof insertNewEmployeeSchemaType}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          value={String(field.value ?? "")}
                          className="border-0  rounded-none w-full max-w-[300px]"
                          placeholder={label}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkInformation;
