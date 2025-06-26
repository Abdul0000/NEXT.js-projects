import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { insertEmployeeContractSchema } from '@/db/schema';
import React from 'react'
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
interface SalaryInformationProps{
    form: UseFormReturn<z.infer<typeof insertEmployeeContractSchema>>
}
const SalaryInformation = ({form}:SalaryInformationProps) => {
    const fieldsData = [
            {
                field: "wage_type",
                label: "Wage Type",
                options: [
                { field: "fixed_wage", label: "Fixed Wage" },
                { field: "hourly_wage", label: "Hourly Wage" },
                ],
            },
            {
                field: "frequency",
                label: "Shedule Pay",
                options: [
                { field: "annually", label: "Annually" },
                { field: "semi-annually", label: "Semi-Annually" },
                { field: "quarterly", label: "Quarterly" },
                { field: "bi-monthly", label: "Bi-Monthly" },
                { field: "monthly", label: "Monthly" },
                { field: "bi-weekly", label: "Bi-Weekly" },
                { field: "weekly", label: "Weekly" },
                { field: "daily", label: "Daily" },
                ],
            },
            ] as const;

  return (
    <div className='p-1 md:p-4 md:pl-2 text-gray-700 '>
        <div className='grid grid-cols-1 lg:grid-cols-2'>
            <div className='flex flex-col gap-y-1'>
                {
                    fieldsData.map((item)=>(
                        <div key={item.label} className='flex items-end sm:gap-x-2'>
                        <p className='min-w-32 p-1 pl-0 text-sm md:text-[0.875rem] font-semibold'>{item.label}</p>
                        <FormField
                            control={form.control}
                            name={item.field as keyof z.infer<typeof insertEmployeeContractSchema>}
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={String(field.value) }
                                    defaultValue={String(field.value)}
                                >
                                    <SelectTrigger className="border-0 ring-0 focus:ring-0  rounded-none text-sm md:text-[0.875rem]">
                                    <SelectValue placeholder={`Select ${item.label}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {item.options?.map((opt) => (
                                        <SelectItem key={opt.label} value={opt.field}>
                                        {opt.label}
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
                    ))
                }
                <div className='flex items-end sm:gap-x-2'>
                    <p className='min-w-32 p-1 pl-0 text-sm md:text-[0.875rem] font-semibold'>Wage</p>
                    <FormField
                    control={form.control}
                    name={"wage" as keyof z.infer<typeof insertEmployeeContractSchema>}
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input
                            {...field}
                            name={typeof field.name === "string" ? field.name : String(field.name)}
                            value={field.value != undefined ? String(field.value): ""}
                            className="border-0  rounded-none text-sm md:text-[0.875rem]"
                            placeholder="Wage"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <span>/ month</span>
                </div>
            </div>
            <div className='flex flex-col gap-y-1'>
                <div className='flex items-end sm:gap-x-2'>
                    <p className='min-w-32 p-1 pl-0 text-sm md:text-[0.875rem] font-semibold'>Yearly Cost</p>
                        <FormField
                        control={form.control}
                        name={"yearly_cost" as keyof z.infer<typeof insertEmployeeContractSchema>}
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input
                                {...field}
                                name={typeof field.name === "string" ? field.name : String(field.name)}
                                value={field.value != undefined ? String(field.value): ""}
                                className="border-0  rounded-none text-sm md:text-[0.875rem]"
                                placeholder="Yearly Cost"
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <span>/ year</span>

                </div>
                <div className='flex items-end sm:gap-x-2'>
                    <p className='min-w-32 p-1 pl-0 text-sm md:text-[0.875rem] font-semibold'>Monthly Cost</p>
                    <FormField
                    control={form.control}
                    name={"monthly_cost" as keyof z.infer<typeof insertEmployeeContractSchema>}
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input
                            {...field}
                            name={typeof field.name === "string" ? field.name : String(field.name)}
                            value={field.value != undefined ? String(field.value): ""}
                            className="border-0  rounded-none text-sm md:text-[0.875rem]"
                            placeholder="Monthly Cost"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <span>/ month</span>

                </div>
            </div>
            
        </div>
    </div>
  )
}

export default SalaryInformation