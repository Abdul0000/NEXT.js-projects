'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import Link from 'next/link'
import { Button } from '../ui/button'
import { SquareArrowUpIcon, XIcon } from 'lucide-react'
import {
  insertDepartmentSchema,
  insertDepartmentSchemaType,
} from '@/db/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useSearchParams } from 'next/navigation'

const NewDepartmentForm = () => {
  const form = useForm<insertDepartmentSchemaType>({
    resolver: zodResolver(insertDepartmentSchema),
    defaultValues: {},
  })

  const searchParams = useSearchParams()
  let page = Number(searchParams.get('/departments/page'))
  let perPage = Number(searchParams.get('/departments/perPage'))
  if (page < 1) page = 1
  if (perPage < 1) perPage = 8

  const [{ data: allDepartments }] =
    trpc.departments.getAllDepartments.useSuspenseQuery({ page, perPage })

  const [{ employees: allEmployees }] =
    trpc.getEmployees.getAllEmployees.useSuspenseQuery({ page, perPage })

  const utils = trpc.useUtils()

  const createDepartment = trpc.departments.createDepartment.useMutation({
    onSuccess: () => {
      toast.success('Department created successfully')
      utils.departments.getAllDepartments.invalidate()
    },
    onError: (error) => console.log(error),
  })

  const onSubmit = (data: insertDepartmentSchemaType) => {
    createDepartment.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Header Section */}
        <div className="flex flex-1 gap-x-1 p-4">
          <Link href={'./'}>
            <Button
              className="hover:bg-blue-600 hover:text-white hover:border-blue-700 text-gray-600 border border-gray-400"
              variant={'secondary'}
              size={'sm'}
            >
              New
            </Button>
          </Link>
          <div className="flex flex-col justify-center">
            <Link href="/departments">
              <p className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                Departments
              </p>
            </Link>
            <p className="text-xs">New</p>
          </div>
          <div className="flex justify-center items-center gap-x-2 pl-4">
            <Button
              type="submit"
              variant={'secondary'}
              disabled={createDepartment.isPending}
              className="size-6 hover:bg-gray-300"
            >
              <SquareArrowUpIcon className="size-6" />
            </Button>
            <Button variant={'secondary'} className="size-6 hover:bg-gray-300">
              <XIcon className="size-6" />
            </Button>
          </div>
        </div>

        {/* Main Form Fields */}
        <div className="overflow-y-auto max-h-[420px] border m-4 p-8 border-gray-300">
          <div className="grid grid-cols-1">
            <div className="flex flex-col gap-y-2 gap-x-8">
              {/* Department Name */}
              <div className="flex items-center gap-x-2">
                <div>
                  <FormField
                    control={form.control}
                    name={'department_name'}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            style={{ fontSize: '1.9rem' }}
                            className="border-0 border-b w-[250px] lg:w-[400px] placeholder:text-lg rounded-none lg:placeholder:text-3xl"
                            placeholder="Department's Name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Labels + Fields */}
              <div className="flex gap-x-2 w-full justify-start">
                <div className="flex flex-col gap-y-5 lg:gap-y-8 h-full pt-3 text-xs lg:text-[15px]">
                  <p>Manager</p>
                  <p>Parent Department</p>
                  <p>Company</p>
                </div>

                <div className="flex flex-col gap-y-2 h-full">
                  {/* Manager */}
                  <FormField
                    control={form.control}
                    name={'manager'}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? undefined}
                          >
                            <SelectTrigger className="border-0 ring-0 focus:ring-0 border-b rounded-none w-[250px] lg:w-[300px]">
                              <SelectValue placeholder="Select manager" />
                            </SelectTrigger>
                            <SelectContent>
                              {allEmployees
                                ?.filter(emp => !!emp.newEmployees?.manager)
                                .map((emp, index) => {
                                  const manager = emp.newEmployees!.manager!
                                  return (
                                    <SelectItem key={`${manager}-${index}`} value={manager}>
                                      {manager}
                                    </SelectItem>
                                  )
                                })}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Parent Department */}
                  <FormField
                    control={form.control}
                    name={'parent_department'}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? undefined}
                          >
                            <SelectTrigger className="border-0 ring-0 focus:ring-0 border-b rounded-none w-[250px] lg:w-[300px]">
                              <SelectValue placeholder="Parent Department" />
                            </SelectTrigger>
                            <SelectContent>
                              {allDepartments
                                ?.filter(dep => !!dep.department_name)
                                .map(dep => (
                                  <SelectItem
                                    key={dep.id}
                                    value={dep.department_name!}
                                  >
                                    {dep.department_name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Company Input */}
                  <FormField
                    control={form.control}
                    name={'company'}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            className="border-0 border-b rounded-none w-[250px] lg:w-[300px]"
                            placeholder="Company"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default NewDepartmentForm
