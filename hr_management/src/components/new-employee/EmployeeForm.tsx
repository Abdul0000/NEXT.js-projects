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
import { Input } from "../ui/input"
import { BriefcaseIcon, ImagePlusIcon, SquareArrowUpIcon, XIcon } from "lucide-react"
import EmployeeTabs from "./EmployeeTabs/EmployeeTabs"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { trpc } from "@/trpc/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { insertNewEmployeeSchema, insertNewEmployeeSchemaType } from "@/db/schema"
import { toast } from "sonner"
import ImageUploadModal from "./ImageUploadModal";
import { useState } from "react";
import Image from "next/image";

interface EmployeeFormProps {
    employee_id?: string;
}

const EmployeeForm = ({employee_id}: EmployeeFormProps) => {
  const path = usePathname()
  const utils = trpc.useUtils()
  const searchParams = useSearchParams()
  let page = Number(searchParams.get("/employees/page"))
  let perPage = Number(searchParams.get("/employees/perPage"))
  if(page < 1) page=1;
  if(perPage < 1) perPage=8;
  const [{data:getDepartments}] = trpc.departments.getAllDepartments.useSuspenseQuery({page, perPage})
  
  const createNewEmployee = trpc.createNewEmployee.createEmployee.useMutation({
    onSuccess: () => {
      toast.success(`Employee created successfully!`)
      utils.getEmployees.getAllEmployees.invalidate()
    },
    onError: (error) => {
      console.error("Error creating employee", error)
    }
  })

  const updateEmployee = trpc.createNewEmployee.updateEmployee.useMutation({
    onSuccess: () => {
      toast(`Employee updated successfully!`)
      utils.getEmployees.getOneEmployee.invalidate({ id:employee_id })
      utils.getEmployees.getAllEmployees.invalidate()
    },
    onError: (error) => {
      console.error("Error updating employee", error)
    }
  })

  const [getEmployee] = trpc.getEmployees.getOneEmployee.useSuspenseQuery({ id:employee_id })
  const [{employees:getEmployees}] = trpc.getEmployees.getAllEmployees.useSuspenseQuery({page, perPage})
  const spreadData = getEmployee ? {
    ...getEmployee
  }
  :
  {}
  // const mergedData = getEmployees.map((item) => ({
  //   ...item.newEmployees,
  //   department_name: item.department_name ?? "",
  // }));
  
  const form = useForm<insertNewEmployeeSchemaType>({
    resolver: zodResolver(insertNewEmployeeSchema),
    defaultValues: 
    spreadData ?? {}
  })

  const onSubmit = async (data: insertNewEmployeeSchemaType) => {
    if(getEmployee){
      updateEmployee.mutate({ ...data, id:employee_id })
    }
    else
    {
      createNewEmployee.mutate(data)
    }
  }

  const [open, setOpen] = useState(false)

  return (
    <>
      <ImageUploadModal open={open} onOpenChanage={setOpen} employee_id={employee_id}/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Header */}
          
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-2 sm:gap-y-0 p-4 pb-0 ">
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
              <Link href="/">
                <p className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  Employees
                </p>
              </Link>
              <p className="text-xs">New</p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={updateEmployee.isPending || createNewEmployee.isPending} variant="secondary" className="p-1 hover:bg-gray-300">
                <SquareArrowUpIcon className="h-5 w-5" />
              </Button>
              <Button type="button" variant="secondary" className="p-1 hover:bg-gray-300">
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
      
        </div>
          {/* Form body */}
          <div className="overflow-y-auto text-gray-800 max-h-[21.25rem] sm:max-h-[27.5rem] border m-2 p-2 mb-0 md:m-4 md:p-6 border-gray-300">
            <div className="flex items-center gap-x-2">
                  <div className="border size-24 p-0 pr-2 rounded-sm cursor-pointer" onClick={()=>{setOpen(true)}}>
                    {getEmployee && !Array.isArray(getEmployee) && getEmployee.image_url ? (
                      <Image
                        width={100}
                        height={100}
                        className="max-w-24 max-h-24"
                        alt="emp_image"
                        src={getEmployee.image_url}
                      />
                    ) : (
                      <ImagePlusIcon className="size-24 hover:text-gray-600 cursor-pointer text-gray-500" />
                    )}
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name={"employee_name" as keyof insertNewEmployeeSchemaType}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value != undefined ? String(field.value) : ""}
                              style={{ fontSize: '1.9rem' }}
                              className="border-0  w-[190px] md:w-[250px] lg:w-[300px] placeholder:text-lg rounded-none lg:placeholder:text-3xl"
                              placeholder="Employee's Name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-start gap-x-1 mt-1">
                      <BriefcaseIcon className="size-5 text-gray-500" />
                      <FormField
                        control={form.control}
                        name={"job_title" as keyof insertNewEmployeeSchemaType}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value != undefined ? String(field.value) : ""}
                                style={{ fontSize: '1.4rem' }}
                                className="border-0  rounded-none text-xl w-[166px] md:w-[228px] lg:w-[278px] pl-0 ml-0 placeholder:text-lg"
                                placeholder="Job Title"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-0 mt-2">
              {/* Left side */}
              <div className="flex flex-col gap-y-2 gap-x-8">
                  <div className="flex flex-col gap-y-1  sm:w-2/3">
                    {[
                        { label: "Work Email", field: "work_email" },
                        { label: "Work Phone", field: "work_phone" },
                        { label: "Work Mobile", field: "work_mobile" },
                        { label: "Tags", field: "tags" },
                        { label: "Company", field: "company" },
                      ].map((fieldData) => (
                    <div key={fieldData.field} className="flex items-end gap-x-2 justify-start">
                      <p className="min-w-36 font-semibold p-1 pl-0 text-xs lg:text-[0.875rem]">{fieldData.label}</p>
                      <FormField
                        control={form.control}
                        name={fieldData.field as keyof insertNewEmployeeSchemaType}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                value={String(field.value ?? "")}
                                className="border-0  rounded-none text-xs lg:text-[0.875rem]"
                                placeholder={fieldData.field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      </div>
                    ))}
                  </div>
                {/* </div> */}
              </div>

              {/* Right side */}
              <div className="flex flex-col gap-y-2 gap-x-8">
                <div className="flex flex-col gap-y-1 h-full">
                  <div className="flex items-end gap-x-2 justify-start">
                  <p className="min-w-36 font-semibold p-1 pl-0 text-xs lg:text-[0.875rem]">Department</p>
                  <FormField
                    control={form.control}
                    name={"department_id" as keyof insertNewEmployeeSchemaType}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={String(field.value) ?? ''}
                            defaultValue={String(field.value) ?? ''}
                          >
                            <SelectTrigger className="border-0  ring-0 focus:ring-0  rounded-none w-[250px] lg:w-[300px]">
                              <SelectValue placeholder="Select department" />
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
                  </div>

                  {[
                    { label: "Job Position", field: "job_position" },
                    { label: "Manager", field: "manager" },
                    { label: "Coach", field: "coach" },
                  ].map((fieldData) => (
                  <div key={fieldData.field} className="flex items-end gap-x-2 justify-start">
                    <p className="min-w-36 font-semibold p-1 pl-0 text-xs lg:text-[0.875rem]">{fieldData.label}</p>
                    <FormField
                      control={form.control}
                      name={fieldData.field as keyof insertNewEmployeeSchemaType}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              value={String(field.value ?? "")}
                              className="border-0   rounded-none"
                              placeholder={fieldData.label}
                            />
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
             {/* Tabs */}
            <EmployeeTabs
              form={form}
              getEmployees={getEmployees?.map((item) => ({
                ...item.newEmployees,
                department_name: item.department_name ?? "",
              }))}
            />
          </div>
        </form>
      </Form>
    </>
  )
}

export default EmployeeForm;
