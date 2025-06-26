'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { SquareArrowUpIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSalaryStrucureTypeSchema } from "@/db/schema";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import SalaryRuleTabs from "./salaryRuleTabs/SalaryRuleTabs";

interface SalaryStructureTypeFormProps {
  structureTypeId?: string;
  title?: string;
}

const SalaryStructureTypeForm = ({ structureTypeId }: SalaryStructureTypeFormProps) => {
  const path = usePathname();
  const utils = trpc.useUtils();
  const searchParams =  useSearchParams()
  let page = Number(searchParams.get("/new-rule/page"))
  let perPage = Number(searchParams.get("/new-rule/perPage"))
  if(page < 1) page=1;
  if(perPage < 1) perPage=8;
  const [{data:getDepartments}] = trpc.departments.getAllDepartments.useSuspenseQuery({page,perPage});
  // const [{employees:getEmployees}] = trpc.getEmployees.getAllEmployees.useSuspenseQuery({page,perPage});
  const [salaryStructures] = trpc.payroll.getAllSalaryStructure.useSuspenseQuery()
  const createSheduleStructureType = trpc.payroll.createSalaryStructureType.useMutation({
    onSuccess: () => {
      toast.success(`Salary stryucture type created successfully!`);
      utils.payroll.getAllSalaryStructurePage.invalidate();
    },
    onError: (error) => {
      console.error("Error creating Salary stryucture type", error);
    }
  });
  const updateSalaryStructureType = trpc.payroll.updateSalaryStructureType.useMutation({
    onSuccess: () => {
      toast.success(`Salary stryucture type updated successfully!`);
      utils.payroll.getAllSalaryStructuretypePage.invalidate();
      utils.payroll.getOneSalaryStructuretype.invalidate({id:structureTypeId});
    },
    onError: (error) => {
      console.error("Error update Salary stryucture type", error);
    }
  })
  const [countries] = trpc.settings.getAllCountries.useSuspenseQuery()
  const [workingShedules] = trpc.settings.getAllWorkingShedules.useSuspenseQuery()
  const [getSalaryStructureType]= trpc.payroll.getOneSalaryStructuretype.useSuspenseQuery({id:structureTypeId})

  const spreadData = getSalaryStructureType ? {
      ...getSalaryStructureType
    }
    :
    {}
    
  const form = useForm<z.infer<typeof insertSalaryStrucureTypeSchema>>({
    resolver: zodResolver(insertSalaryStrucureTypeSchema),
    defaultValues: spreadData as z.infer<typeof insertSalaryStrucureTypeSchema> ,
  });
  const onSubmit = async (data: z.infer<typeof insertSalaryStrucureTypeSchema>) => {
    if (getSalaryStructureType) {
      updateSalaryStructureType.mutate({ ...data, id:structureTypeId });
    } else {
      createSheduleStructureType.mutate(data);
    }
  };
  
const scheduledPayOptions = [
  { value: "annually", type: "Annually" },
  { value: "semi-annually", type: "Semi Annually" },
  { value: "quarterly", type: "Quarterly" },
  { value: "bi-monthly", type: "Bi Monthly" },
  { value: "monthly", type: "Monthly" },
  { value: "bi-weekly", type: "Bi Weekly" },
  { value: "weekly", type: "Weekly" },
  { value: "daily", type: "Daily" },
] as const;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-2 sm:gap-y-0 p-4 pb-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Link href={path}>
              <Button type="button" className="hover:bg-blue-600 hover:text-white hover:border-blue-700 text-gray-600 border border-gray-400 text-sm sm:text-base" variant="secondary" size="sm">New</Button>
            </Link>
            <div className="flex flex-col">
              <Link href="/structure-types">
                <p className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Salary structure types</p>
              </Link>
              <p className="text-xs">New</p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={createSheduleStructureType.isPending||updateSalaryStructureType.isPending} variant="secondary" className="p-1 hover:bg-gray-300">
                <SquareArrowUpIcon className="h-5 w-5" />
              </Button>
              <Button type="button" variant="secondary" className="p-1 hover:bg-gray-300">
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[420px] border m-4 p-4 lg:p-6 border-gray-300">
          <div className="border-0 border-b w-[190px] md:w-[250px] lg:w-[300px] placeholder:text-lg rounded-none lg:placeholder:text-3xl">
            {/* {JSON.stringify(getSalaryStructureType)} */}
            <FormField
                control={form.control}
                name={"structure_type_name" as keyof z.infer<typeof insertSalaryStrucureTypeSchema>}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        name={String(field.value)}
                        value={String(field.value) ?? ""}
                        style={{ fontSize: '1.5rem' }}
                        className="border-0 border-b w-full placeholder:text-xl rounded-none lg:placeholder:text-2xl"
                        placeholder="eg. Employee"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 mt-4">
            <div className="flex flex-col gap-y-2 gap-x-8">
              <div className="flex gap-x-2 w-full justify-start">
                <div className="flex flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700">
                  <p>Country</p>
                  <p>Category</p>
                  <p>Sheduled Pay</p>
                </div>
                <div className="flex flex-col gap-y-1 w-full sm:w-2/3">
                  {["country_id", "wage_type", "sheduled_pay"].map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName as keyof z.infer<typeof insertSalaryStrucureTypeSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                              <Select onValueChange={field.onChange} value={String(field.value) ?? ''}>
                                <SelectTrigger className="border-0 ring-0 focus:ring-0 border-b rounded-none w-full max-w-sm">
                                  <SelectValue placeholder={`${fieldName === "country_id" ? "country" : fieldName.replace("_", " ")}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldName === "country_id" && Array.isArray(countries) ? countries.map((country) => (
                                    <SelectItem key={country.id} value={country.id}>{country.country_name}</SelectItem>
                                  ))
                                  : fieldName === "sheduled_pay"
                                  ? scheduledPayOptions.map((data)=>(
                                    <SelectItem key={data.value} value={data.value}>{data.type}</SelectItem>
                                  ))
                                  : [{type:"Fixed Wage", value:"fixed-wage"},{type:"Hourly",value:"hourly"}].map((data)=>(
                                      <SelectItem key={data.value} value={data.value}>{data.type}</SelectItem>
                                    ))
                                  }
                                </SelectContent>
                              </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-2 gap-x-8">
              <div className="flex gap-x-2 w-full justify-start">
                <div className="flex flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700">
                  <p>Working Hours</p>
                  <p>Pay Structure</p>
                  <p>Work Entry</p>
                </div>
                
                <div className="flex flex-col gap-y-1 w-full sm:w-2/3"> 
                  {["working_hours_id", "pay_structure_id", "work_entry_type_id"].map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName as keyof z.infer<typeof insertSalaryStrucureTypeSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                              <Select onValueChange={field.onChange} value={String(field.value) ?? ''}>
                                <SelectTrigger className="border-0 ring-0 focus:ring-0 border-b rounded-none w-full max-w-sm">
                                  <SelectValue placeholder={`${fieldName === "salary_structure_id" ? "salary structure": fieldName.replaceAll("_"," ").slice(0,-2)}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {
                                    fieldName === "working_hours_id" && Array.isArray(workingShedules)  
                                    ? workingShedules?.map((shedule) => (
                                    <SelectItem key={shedule.id} value={shedule.id}>{shedule.work_shedule_name}</SelectItem>))
                                    : fieldName === "pay_structure_id" && Array.isArray(salaryStructures)
                                    ? salaryStructures.map((structure)=>(
                                    <SelectItem key={structure.id} value={structure.id}>{structure.salary_structure_name}</SelectItem>
                                    ))
                                    :
                                     getDepartments?.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>{dept.department_name}</SelectItem>
                                  ))
                                  }
                                  
                                </SelectContent>
                              </Select>
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
          {/* <SalaryRuleTabs form={form}/> */}
        </div>
      </form>
    </Form>
  );
};

export default SalaryStructureTypeForm;
