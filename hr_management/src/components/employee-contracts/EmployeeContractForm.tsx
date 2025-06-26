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
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useState } from "react";
import ContractStatusBadge from "./ContractStatusBadge";
import ContractTabs from "./contract-tabs/ContractTabs";
import { insertEmployeeContractSchema, insertEmployeeContractSchemaType } from "@/db/schema";

interface EmployeeContractFormProps {
  contract_id?: string;
  title?: string;
}

const EmployeeContractForm = ({ contract_id, title }: EmployeeContractFormProps) => {
  const path = usePathname();
  const utils = trpc.useUtils();
  const searchParams = useSearchParams();

  let page = Number(searchParams.get("page")) || 1;
  let perPage = Number(searchParams.get("perPage")) || 8;

  if (page < 1) page = 1;
  if (perPage < 1) perPage = 8;
  const [{data:getDepartments}] = trpc.departments.getAllDepartments.useSuspenseQuery({page, perPage});
  const [{employees}] = trpc.getEmployees.getAllEmployees.useSuspenseQuery({page, perPage});
  const emps = employees.map((item)=>({
    ...item.newEmployees,
    department_name:item.department_name
  }))

  const createNewEmployeeContract = trpc.employeeContracts.createContract.useMutation({
    onSuccess: () => {
      toast.success(`Employee created successfully!`);
      utils.employeeContracts.getOneContract.invalidate();
    },
    onError: (error) => {
      console.error("Error creating employee", error);
    }
  });

  const updateEmployeeContract = trpc.employeeContracts.updateEmployeeContract.useMutation({
    onSuccess: () => {
      toast(`Employee contract updated successfully!`);
      utils.employeeContracts.getOneContract.invalidate({ id:contract_id });
      utils.employeeContracts.getAllContracts.invalidate();
    },
    onError: (error) => {
      console.error("Error updating employee contract", error);
    }
  });

  const [contract] = trpc.employeeContracts.getOneContract.useSuspenseQuery({ id:contract_id });
  const mergedData:insertEmployeeContractSchemaType & {department_name?:string,employee_name?:string} = contract ? {
    ...contract.employeeContracts,
    department_name: contract?.department_name ? contract.department_name : "",
    employee_name: contract.employee_name ?? ""
  }
  :
  {
    contract_name: ""
  }

  const form = useForm<insertEmployeeContractSchemaType>({
    mode:"onBlur",
    resolver: zodResolver(insertEmployeeContractSchema),
    defaultValues: mergedData,
  });

  const onSubmit = async (data: insertEmployeeContractSchemaType) => {
    if (contract) {
      updateEmployeeContract.mutate({ ...data, id:contract_id });
    } else {
      createNewEmployeeContract.mutate(data);
    }
  };

  const [calendarOpen, setCalendarOpen] = useState<{ [key: string]: boolean }>({
    start_date: false,
    end_date: false,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        {/* Header buttons + Status badge */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-2 sm:gap-y-0 p-4 pb-0 ">
          <div className="flex justify-between sm:justify-start flex-row sm:items-center gap-2">
            <div className="flex gap-x-2">
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
                <Link href="/employee-contracts">
                  <p className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                    Contracts
                  </p>
                </Link>
                <p className="text-xs">New</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={updateEmployeeContract.isPending || createNewEmployeeContract.isPending} variant="secondary" className="p-1 hover:bg-gray-300">
                <SquareArrowUpIcon className="h-5 w-5" />
              </Button>
              <Button type="button" variant="secondary" className="p-1 hover:bg-gray-300">
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {title === "contract" && (
            <div className="mt-2 sm:mt-0">
              <ContractStatusBadge
                contract_id={contract_id}
                status={mergedData.status ?? "new"}
              />
            </div>
          )}
        </div>
        {/* Main form container */}
        <div className="overflow-y-auto text-gray-800 max-h-[21.25rem] sm:max-h-[27.5rem] border m-1 p-1 mt-4 sm:m-4 sm:p-4 lg:p-0 border-gray-300 ">
          {/* Contract Reference */}
          <div className="p-4 lg:p-6">
          <div className="border-0 w-[11.875rem] md:w-[15.265rem] lg:w-[18.75rem] placeholder:text-lg rounded-none lg:placeholder:text-3xl">
            <FormField
                control={form.control}
                name={"contract_name" as keyof insertEmployeeContractSchemaType}
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <Input
                        {...field}
                        name={String(field.name)}
                        value={String(field.value) ?? ""}
                        style={{ fontSize: '1.5rem' }}
                        className="border-0 placeholder:text-xl rounded-none lg:placeholder:text-2xl"
                        placeholder="Contract Reference"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-0 mt-4">
            {/* Left column */}
           
            <div className="flex flex-col md:gap-y-1 sm:w-2/3 text-sm  md:text-[0.875rem]">
              {/* Employee dropdown */}
              <div className="flex gap-x-2  items-end">
                <p className="min-w-36 p-1 pl-0 font-semibold">Employee</p>
                <FormField
                  control={form.control}
                  name={"employee_id" as keyof insertEmployeeContractSchemaType}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={String(field.value) ?? ''}
                          defaultValue={String(field.value) ?? ''}
                        >
                          <SelectTrigger className="border-0 ring-0 focus:ring-0 rounded-none">
                            <SelectValue placeholder="Select Employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {emps?.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id}>
                                <p className="text-sm md:text-[0.875rem]">{emp.employee_name}</p>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* field.value.toISOString().split("T")[0] */}
              {/* Start Date, End Date, Working Schedule */}
              {[{field:"start_date",label:"Contract Start Date"}, {field:"end_date", label:"Contract End Date"}, {field:"working_schedule", label:"Working Schedule"}].map((fieldData) => (
                  <div key={fieldData.label} className="flex gap-x-2 items-end">
                  <p className="min-w-36 p-1 pl-0 font-semibold">{fieldData.label}</p>
                  <FormField
                    key={fieldData.label}
                    control={form.control}
                    name={fieldData.field as keyof insertEmployeeContractSchemaType}
                    render={({ field }) => {
                      const dateValue =
                      (fieldData.field === "start_date" || fieldData.field === "end_date") && field.value != null
                        ? new Date(field.value)
                        : null;
                      return (
                        <FormItem>
                          <FormControl>
                            {fieldData.field === "start_date" || fieldData.field === "end_date" ? (
                              <Popover
                                open={calendarOpen[fieldData.field]}
                                onOpenChange={(open) =>
                                  setCalendarOpen((prev) => ({ ...prev, [fieldData.field]: open }))
                                }
                              >
                                <PopoverTrigger asChild>
                                  <Input
                                    readOnly
                                    value={
                                      dateValue?
                                         new Date().toISOString().split("T")[0] :""
                                    }
                                    placeholder="Pick a date"
                                    onClick={() =>
                                      setCalendarOpen((prev) => ({
                                        ...prev,
                                        [fieldData.field]: true,
                                      }))
                                    }
                                    className="text-sm md:text-[0.875rem] cursor-pointer text-start border-0 rounded-none"
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
                                        [fieldData.field]: false,
                                      }));
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <Input
                                {...field}
                                value={
                                  field.value === undefined ? String(field.value) : "" 
                                }
                                name={String(field.name)}
                                className="text-sm md:text-[0.875rem] border-0 rounded-none"
                                placeholder={fieldData.field.replace("_", " ")}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Right column */}
            <div className="flex flex-col md:gap-y-1  sm:w-2/3 text-sm md:text-[0.875rem] text-gray-700 ">
              {[
                { field: "department_id", label: "Department", type: "select", options: getDepartments, optionLabel: "department_name" },
                { field: "wage_on_signed", label: "Wage on Signed Contract", type: "number" },
                { field: "job_position", label: "Job Position" },
                { field: "contract_type", label: "Contract Type" },
                { field: "salary_structure_type", label: "Salary Structure Type" },
                { field: "hr_responsible", label: "HR Responsible" },
              ].map(({ field, label, type, options, optionLabel }) => (
                <div key={field} className="flex gap-x-2  items-end">
                  <p className="min-w-36 md:min-w-48 p-1 pl-0 font-semibold">{label}</p>

                  <FormField
                    control={form.control}
                    name={field as keyof insertEmployeeContractSchemaType}
                    render={({ field: formField }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          {type === "select" && options ? (
                            <Select
                              onValueChange={formField.onChange}
                              value={String(formField.value) ?? ''}
                            >
                              <SelectTrigger className="border-0 ring-0 focus:ring-0 rounded-none">
                                <SelectValue placeholder={`Select ${label}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {options.map((opt) => (
                                  <SelectItem key={opt.id} value={opt.id}>
                                    {optionLabel === "department_name"
                                      ? opt.department_name
                                      : optionLabel === "manager"
                                      ? opt.manager
                                      : optionLabel === "parent_department"
                                      ? opt.parent_department
                                      : optionLabel === "company"
                                      ? opt.company
                                      : optionLabel === "employees"
                                      ? opt.employees
                                      : opt.id}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-end">
                              <Input
                                type={type || "text"}
                                value={formField.value != undefined ? String(formField.value) : ""}
                                onChange={(e) =>
                                  formField.onChange(
                                    type === "number" ? Number(e.target.value) : e.target.value
                                  )
                                }
                                name={String(formField.name)}
                                className="text-sm md:text-[0.875rem] border-0 rounded-none"
                                placeholder={label}
                              />
                              {field === "wage_on_signed" && (
                                <span className="ml-2 text-sm">/month</span>
                              )}
                            </div>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

          </div>
          </div>
            <ContractTabs form = {form} />
        </div>
      </form>
    </Form>
  );
};

export default EmployeeContractForm;
