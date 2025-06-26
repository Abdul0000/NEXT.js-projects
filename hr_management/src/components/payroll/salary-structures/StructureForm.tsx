'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { SquareArrowUpIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { trpc } from "@/trpc/client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { insertSalaryStrucureSchema, updateSalaryStrucureSchema } from "@/db/schema"
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmployeeContractFormProps {
  structure_id?: string;
  title?: string;
}

const StructureForm = ({ structure_id, title }: EmployeeContractFormProps) => {
  const path = usePathname();
  const utils = trpc.useUtils();
  const searchParams = useSearchParams();

  let page = Number(searchParams.get("page")) || 1;
  let perPage = Number(searchParams.get("perPage")) || 8;

  if (page < 1) page = 1;
  if (perPage < 1) perPage = 8;

  const [countries] = trpc.settings.getAllCountries.useSuspenseQuery()
  const [structureTypes] = trpc.payroll.getAllSalaryStructuretype.useSuspenseQuery()
  const [{data:getDepartments}] = trpc.departments.getAllDepartments.useSuspenseQuery({page, perPage});
  // const [{employees:getEmployees}] = trpc.getEmployees.getAllEmployees.useSuspenseQuery({page, perPage});

  const createSalaryStructure = trpc.payroll.createSalaryStructure.useMutation({
    onSuccess: () => {
      toast.success(`Salary structure created successfully!`);
      utils.payroll.getAllSalaryStructurePage.invalidate();
    },
    onError: (error) => {
      console.error("Error creating Salary structure", error);
    }
  });

  const updateSalaryStructure = trpc.payroll.updateSalaryStructure.useMutation({
    onSuccess: () => {
      toast(`Salary structure updated successfully!`);
      utils.payroll.getAllSalaryStructurePage.invalidate();
      utils.payroll.getOneSalaryStructure.invalidate({ id: structure_id });
    },
    onError: (error) => {
      console.error("Error updating salary structure", error);
    }
  });

  const [getStructure] = trpc.payroll.getOneSalaryStructure.useSuspenseQuery({id:structure_id})
  const spreadData = getStructure ? {
    ...getStructure
  }
  :
  {}
  const form = useForm<z.infer<typeof insertSalaryStrucureSchema>>({
    resolver: zodResolver(insertSalaryStrucureSchema),
    defaultValues: spreadData as z.infer<typeof insertSalaryStrucureSchema>,
  });

  const onSubmit = async (data: z.infer<typeof insertSalaryStrucureSchema>) => {
    if (getStructure) {
      updateSalaryStructure.mutate({ ...data, id: structure_id });
    } else {
      createSalaryStructure.mutate(data);
    }
  };

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
              <Link href="/salary-structures">
                <p className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  Salary structures
                </p>
              </Link>
              <p className="text-xs">New</p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={createSalaryStructure.isPending|| updateSalaryStructure.isPending} variant="secondary" className="p-1 hover:bg-gray-300">
                <SquareArrowUpIcon className="h-5 w-5" />
              </Button>
              <Button type="button" variant="secondary" className="p-1 hover:bg-gray-300">
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {title === "contract" && (
            <div className="mt-2 sm:mt-0">
              {/* <ContractStatusBadge
                contract_id={contract_id}
                status={getEmployeeContract.status || "New"}
              /> */}
            </div>
          )}
        </div>
        {/* Main form container */}
        <div className="overflow-y-auto max-h-[420px] border m-4 p-4 lg:p-6 border-gray-300 ">
          {/* Contract Reference */}
          <div className="border-0 border-b w-[190px] md:w-[250px] lg:w-[300px] placeholder:text-lg rounded-none lg:placeholder:text-3xl">
            <FormField
                control={form.control}
                name={"salary_structure_name" as keyof z.infer<typeof insertSalaryStrucureSchema>}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        name={String(field.value)}
                        value={field.value != undefined ? String(field.value ) : ""}
                        style={{ fontSize: '1.5rem' }}
                        className="border-0 border-b w-full placeholder:text-xl rounded-none lg:placeholder:text-2xl"
                        placeholder="Regular Pay"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 mt-4">
            {/* Left column */}
            <div className="flex flex-col gap-y-2 gap-x-8">
              <div className="flex gap-x-2 w-full justify-start">
                {/* Labels column */}
                <div className="flex flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700">
                  <p>Type</p>
                  <p>Country</p>
                  <p>Use Work Day Lines</p>
                  <p>Year to Date Computation</p>
                </div>

                {/* Inputs column */}
                <div className="flex flex-col gap-y-1 w-full sm:w-2/3">
                  
                  {["structure_type_id", "country_id"].map((fieldName) => {
                    return (
                      <FormField
                        key={fieldName}
                        control={form.control}
                        name={fieldName as keyof z.infer<typeof insertSalaryStrucureSchema>}
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Select
                                // onValueChange={field.onChange}
                                onValueChange={(val) => {
                                  field.onChange(val);
                                  const selected = structureTypes.find(structType => structType.id === val);
                                  if (selected) {
                                    form.setValue("shedule_pay", selected.sheduled_pay ?? '');
                                  } else {
                                    form.setValue("shedule_pay", 'monthly');
                                  }
                                }}
                                value={String(field.value) ?? ''}>
                                <SelectTrigger className="border-0 ring-0 focus:ring-0 border-b rounded-none w-full max-w-sm">
                                <SelectValue placeholder={fieldName.replaceAll("_"," ").slice(0,-3)} />
                                </SelectTrigger>
                                <SelectContent>
                                {
                                  fieldName === "structure_type_id" 
                                  ?
                                  structureTypes && Array.isArray(structureTypes) && structureTypes?.map((structureType) => (
                                      <SelectItem key={structureType.id} value={structureType.id}>
                                      {structureType.structure_type_name}
                                      </SelectItem>
                                  ))
                                  :
                                  countries && Array.isArray(countries) && countries?.map((country) => (
                                      <SelectItem key={country.id} value={country.id}>
                                      {country.country_name}
                                      </SelectItem>
                                  ))
                                }
                                </SelectContent>
                            </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    );
                  })}
                <div className="flex flex-col items-start gap-y-7 pt-2 pl-2 w-full sm:w-2/3">
                  {["use_work_day_lines", "year_to_date_computation"].map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName as keyof z.infer<typeof insertSalaryStrucureSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="checkbox"
                              name={typeof field.name === "string" ? field.name : String(field.name)}
                              checked={!!field.value}
                              onChange={field.onChange}
                              value="true"
                              className="border-0 border-b rounded-none size-4 pt-4"
                              placeholder={fieldName.replace("_", " ")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-y-2 gap-x-8">
              <div className="flex gap-x-2 w-full justify-start">
                {/* Labels */}
                <div className="flex flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700">
                  <p>Template</p>
                  <p>Payslip Name</p>
                  <p>Sheduled Pay</p>
                  <p>Salary Journal</p>
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-y-1 w-full sm:w-2/3">
                  <FormField
                    control={form.control}
                    name="template_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ''}
                          >
                            <SelectTrigger className="border-0 ring-0 focus:ring-0 border-b rounded-none w-full max-w-sm">
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              {getDepartments?.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.department_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Wage on Signed Contract */}
                    <FormField
                        control={form.control}
                        name={"payslip_name" as keyof z.infer<typeof insertSalaryStrucureSchema>}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                name={String(field.value)}
                                value={
                                  field.value instanceof Date
                                    ? field.value.toISOString().split("T")[0]
                                    : field.value !== undefined && field.value !== null
                                      ? String(field.value)
                                      : ""
                                }
                                className="border-0 border-b rounded-none w-full max-w-sm"
                                placeholder={"payslip name"}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                  {/* Other text inputs */}
                  {["shedule_pay", "salary_journal"].map(
                    (fieldName) => (
                      <FormField
                        key={fieldName}
                        control={form.control}
                        name={fieldName as keyof z.infer<typeof insertSalaryStrucureSchema>}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                name={String(field.value)}
                                disabled={fieldName === "shedule_pay" ? true: false}
                                value={
                                  field.value instanceof Date
                                    ? field.value.toISOString().split("T")[0]
                                    : field.value !== undefined && field.value !== null
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

          {/* Tabs (below the two‑column grid) */}
          <div className="mt-6">
            {/* <EmployeeContractTabs /> */}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default StructureForm;
