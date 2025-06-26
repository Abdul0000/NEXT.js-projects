'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { SquareArrowUpIcon, XIcon } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { trpc } from "@/trpc/client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { insertEmployeeAttendanceSchema } from "@/db/schema"
import { toast } from "sonner"
// import EmployeeContractTabs from "./EmployeeContractTabs";
import { format } from "date-fns";
import AttendanceStatusBadge from "./AttendanceStatusBadge";
import { useState } from "react";

// import ContractStatusBadge from "./ContractStatusBadge";

interface EmployeeContractFormProps {
  contract_id?: string;
  title?: string;
}

const AttendanceForm = ({ contract_id, title }: EmployeeContractFormProps) => {
  const path = usePathname();
  const utils = trpc.useUtils();
  const searchParams = useSearchParams()
  let page = Number(searchParams.get("/attendance/page"))
  let perPage =  Number(searchParams.get("/attendance/perPage"))
  if(page < 1) page = 1;
  if(perPage < 1) perPage = 8;
  const [{employees:getEmployees}] = trpc.getEmployees.getAllEmployees.useSuspenseQuery({page, perPage});

  const createEmployeeAttendance = trpc.employeeAttendance.createAttendance.useMutation({
    onSuccess: () => {
      toast.success(`Attendance created successfully!`);
      utils.employeeAttendance.getAllAttendance.invalidate();
    },
    onError: (error) => {
      console.error("Error creating attendance", error);
    }
  });

  // const updateEmployeeContract = trpc.employeeContracts.updateEmployeeContract.useMutation({
  //   onSuccess: () => {
  //     toast(`Employee contract updated successfully!`);
  //     utils.employeeContracts.getOneContract.invalidate({ id: contract_id });
  //     utils.employeeContracts.getAllContracts.invalidate();
  //   },
  //   onError: (error) => {
  //     console.error("Error updating employee contract", error);
  //   }
  // });

  // contract_id = contract_id ?? '123e4567-e89b-12d3-a456-426614174000';
  // const [getEmployeeContract] = trpc.employeeContracts.getOneContract.useSuspenseQuery({ contract_id });

  // const isValidEmployee = contract_id && !Array.isArray(getEmployeeContract);

  // const data = isValidEmployee
  //   ? {
  //       status: getEmployeeContract.status,
  //       contract_name: getEmployeeContract.contract_name ?? "",
  //       start_date: getEmployeeContract.start_date,
  //       end_date: getEmployeeContract.end_date,
  //       working_schedule: getEmployeeContract.working_schedule ?? "",
  //     }
  //   : {};

  const form = useForm<z.infer<typeof insertEmployeeAttendanceSchema>>({
    resolver: zodResolver(insertEmployeeAttendanceSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: z.infer<typeof insertEmployeeAttendanceSchema>) => {
    // if (isValidEmployee) {
    //   updateEmployeeContract.mutate({ ...data, id: contract_id });
    // } else {
      createEmployeeAttendance.mutate(data);
    // }
  };

  const [calendarOpen, setCalendarOpen] = useState<{ [key: string]: boolean }>({
    start_date: false,
    end_date: false,
  });

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          {/* Header buttons + Status badge */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-2 sm:gap-y-0 p-4 pb-0 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Link href={path}>
                <Button
                  type="button"
                  className="hover:bg-blue-600 hover:text-white hover:border-blue-700 text-gray-600 border border-gray-400 text-sm sm:text-base"
                  variant="secondary"
                  size="sm"
                >
                  New
                </Button>
              </Link>
              <div className="flex flex-col">
                <Link href="/employee-attendance">
                  <p className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                    Attendance
                  </p>
                </Link>
                <p className="text-xs">New</p>
              </div>
              <div className="flex items-center gap-x-2">
                <Button type="submit" disabled={createEmployeeAttendance.isPending} variant="secondary" className="p-1 hover:bg-gray-300">
                  <SquareArrowUpIcon className="h-5 w-5" />
                </Button>
                <Button type="button" variant="secondary" className="p-1 hover:bg-gray-300">
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {title === "attendance" && (
              <div className="mt-2 sm:mt-0">
                <AttendanceStatusBadge
                  contract_id={contract_id ?? ""}
                  status="New"
                  // status={Array.isArray(getEmployeeContract) && getEmployeeContract[0]?.employeeContracts?.status
                  //   ? getEmployeeContract[0].employeeContracts.status as string
                  //   : "New"}
                />
              </div>
            )}
          </div>
          {/* Main form container */}
          <div className="overflow-y-auto max-h-[420px] border m-4 p-4 lg:p-6 border-gray-300 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 mt-4">
              {/* Left column */}
              <div className="flex flex-col gap-y-2 gap-x-8">
                <div className="flex gap-x-2 w-full justify-start">
                  {/* Labels column */}
                  <div className="flex flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700">
                    <p>Employee</p>
                    <p>Check In</p>
                    <p>Check Out</p>
                  </div>

                  {/* Inputs column */}
                  <div className="flex flex-col gap-y-1 w-full sm:w-2/3">
                    {/* Employee dropdown */}
                    <FormField
                      control={form.control}
                      name={"employee_id" as keyof z.infer<typeof insertEmployeeAttendanceSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                              }}
                              value={String(field.value) ?? ''}
                            >
                              <SelectTrigger className="border-0 ring-0 focus:ring-0 border-b rounded-none w-full max-w-sm">
                                <SelectValue placeholder="Select Employee" />
                              </SelectTrigger>
                              <SelectContent>
                                {getEmployees?.map((emp) => (
                                  <SelectItem key={emp.newEmployees?.id} value={emp.newEmployees?.id ?? ""}>
                                    {emp.newEmployees?.employee_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Start Date, End Date, Working Schedule */}
                    {["check_in", "check_out"].map((fieldName) => {
                      const isDateField = fieldName === "check_in" || fieldName === "check_in";
                      return (
                        <FormField
                          key={fieldName}
                          control={form.control}
                          name={fieldName as keyof z.infer<typeof insertEmployeeAttendanceSchema>}
                          render={({ field }) => {
                          const dateValue =
                              isDateField && field.value ? new Date(field.value) : null;
                            return (
                              <FormItem>
                                <FormControl>
                                    <Popover
                                      open={calendarOpen[fieldName]}
                                      onOpenChange={(open) =>
                                        setCalendarOpen((prev) => ({ ...prev, [fieldName]: open }))
                                      }
                                    >
                                      <PopoverTrigger asChild>
                                        <Input
                                          readOnly
                                          value={
                                            dateValue
                                              ? format(dateValue, "yyyy-MM-dd")
                                              : new Date().toISOString().split("T")[0]
                                          }
                                          placeholder="Pick a date"
                                          onClick={() =>
                                            setCalendarOpen((prev) => ({
                                              ...prev,
                                              [fieldName]: true,
                                            }))
                                          }
                                          className="cursor-pointer text-start border-0 border-b rounded-none w-full max-w-sm"
                                        />
                                      </PopoverTrigger>
                                      <PopoverContent>
                                        <Calendar
                                          mode="single"
                                          selected={dateValue || undefined}
                                          onSelect={(date) => {
                                            if (date) {
                                              field.onChange(date.toISOString());
                                            }
                                            setCalendarOpen((prev) => ({
                                              ...prev,
                                              [fieldName]: false,
                                            }));
                                          }}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-y-2 gap-x-8">
                <div className="flex gap-x-2 w-full justify-start">
                  {/* Labels */}
                  <div className="flex flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700">
                    <p>Work Time</p>
                    <p>Extra Hours</p>
                  </div>

                  {/* Inputs */}
                  <div className="flex flex-col gap-y-1 w-full sm:w-2/3">
                    {/* Other text inputs */}
                    {["work_time", "extra_hours",].map(
                      (fieldName) => (
                        <FormField
                          key={fieldName}
                          control={form.control}
                          name={fieldName as keyof z.infer<typeof insertEmployeeAttendanceSchema>}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  name={String(field.name)}
                                  value={
                                    // field.value instanceof Date
                                    //   ? field.value.toISOString().split("T")[0]
                                      field.value !== undefined && field.value !== null
                                        ? String(field.value)
                                        : ""
                                  }
                                  className="border-0 border-b rounded-none w-full max-w-sm"
                                  placeholder={fieldName.replace("_", " ")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
  );
};

export default AttendanceForm;
