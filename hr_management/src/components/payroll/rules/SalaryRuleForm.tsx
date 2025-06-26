'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { SquareArrowUpIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSalaryRulesSchema } from "@/db/schema";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import SalaryRuleTabs from "./salaryRuleTabs/SalaryRuleTabs";

interface EmployeeContractFormProps {
  rule_id?: string;
  title?: string;
}

const SalaryRuleForm = ({ rule_id }: EmployeeContractFormProps) => {
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
  const createSalaryRule = trpc.payrollSalaryRule.createSalaryrule.useMutation({
    onSuccess: () => {
      toast.success(`Salary rule created successfully!`);
      // utils.employeeContracts.getOneContract.invalidate();
    },
    onError: (error) => {
      console.error("Error creating salary rule", error);
    }
  });

  const updateSalaryRule = trpc.payrollSalaryRule.updateSalaryrule.useMutation({
    onSuccess: () => {
      toast(`Salary rule updated successfully!`);
      utils.payrollSalaryRule.getOneSalaryRule.invalidate({ id:rule_id });
      utils.payrollSalaryRule.getAllSalaryRulesPage.invalidate();
    },
    onError: (error) => {
      console.error("Error updating salary rule", error);
    }
  });

  const [getSalaryRule] = trpc.payrollSalaryRule.getOneSalaryRule.useSuspenseQuery({id:rule_id})
  const spreadData = getSalaryRule ? {
      ...getSalaryRule
    }
    :
    {}

  const form = useForm<z.infer<typeof insertSalaryRulesSchema>>({
    resolver: zodResolver(insertSalaryRulesSchema),
    defaultValues: spreadData,
  });

  const onSubmit = async (data: z.infer<typeof insertSalaryRulesSchema>) => {
    if (getSalaryRule) {
      updateSalaryRule.mutate({ ...data, id:rule_id });
    } else {
      createSalaryRule.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-2 sm:gap-y-0 p-4 pb-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Link href={path}>
              <Button type="button" className="hover:bg-blue-600 hover:text-white hover:border-blue-700 text-gray-600 border border-gray-400 text-sm sm:text-base" variant="secondary" size="sm">New</Button>
            </Link>
            <div className="flex flex-col">
              <Link href="/salary-rules">
                <p className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Salary Rules</p>
              </Link>
              <p className="text-xs">New</p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={createSalaryRule.isPending||updateSalaryRule.isPending} variant="secondary" className="p-1 hover:bg-gray-300">
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
            <FormField control={form.control} 
            name={"rule_name" as keyof z.infer<typeof insertSalaryRulesSchema>}
             render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                 <Input
                    {...field}
                    name={String(field.name)}
                    value={String(field.value) ?? ""}
                    style={{ fontSize: '1.5rem' }}
                    className="border-0 border-b w-full placeholder:text-xl rounded-none lg:placeholder:text-2xl"
                    placeholder="eg. Salary Rule"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 mt-4">
            <div className="flex flex-col gap-y-2 gap-x-8">
              <div className="flex gap-x-2 w-full justify-start">
                <div className="flex flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700">
                  <p>Code</p>
                  <p>Category</p>
                  <p>Salary Structure</p>
                </div>
                <div className="flex flex-col gap-y-1 w-full sm:w-2/3">
                  {["code", "category_id", "salary_structure_id"].map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName as keyof z.infer<typeof insertSalaryRulesSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            {fieldName != "code" ? (
                              <Select onValueChange={field.onChange} value={String(field.value) ?? ''}>
                                <SelectTrigger className="border-0 ring-0 focus:ring-0 border-b rounded-none w-full max-w-sm">
                                  <SelectValue placeholder={`${fieldName === "salary_structure_id" ? "salary structure":"category"}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  
                                  { fieldName === "salary_structure_id" 
                                  ?
                                  salaryStructures && Array.isArray(salaryStructures) &&
                                    salaryStructures.map((structure)=>(
                                    <SelectItem key={structure.id} value={structure.id}>{structure.salary_structure_name}</SelectItem>
                                    ))
                                  :
                                  getDepartments?.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>{dept.department_name}</SelectItem>
                                  ))
                                  }
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                {...field}
                                name={String(field.name)}
                                value={field.value !== undefined ? String(field.value) : ""}
                                className="border-0 border-b rounded-none w-full max-w-sm"
                                placeholder={fieldName.replace("_", " ")}
                              />
                            )}
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
              <div className="flex w-full justify-start">
                <div className="flex flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700">
                  <p>Active</p>
                  <p>Apears on payslip</p>
                  <p>view on payslip reporting</p>
                </div>
                
                <div className="flex flex-col items-center gap-y-7 w-full sm:w-2/3">
                  <FormField
                      control={form.control}
                      name={"active" as keyof z.infer<typeof insertSalaryRulesSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  {["appears_on_payslip", "view_on_payroll_reporting"].map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName as keyof z.infer<typeof insertSalaryRulesSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="checkbox"
                              name={String(field.name)}
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              onBlur={field.onBlur}
                              ref={field.ref}
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
          {/* <SalaryRuleTabs form={form}/> */}
        </div>
      </form>
    </Form>
  );
};

export default SalaryRuleForm;
