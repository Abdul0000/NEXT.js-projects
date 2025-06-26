'use client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { SquareArrowUpIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { insertWorkingSheduleSchema } from "@/db/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
// import WorkScheduleLines from "./WokingSheduleLines";
import { Suspense } from "react";
import Loading from "@/components/Loading";
interface WorkingSheduleForm{
  shedule_id?:string;
  title? : string;
}
const WorkingSheduleForm = ({shedule_id}:WorkingSheduleForm) => {
  const path = usePathname();
  const utils = trpc.useUtils()
  const [workShedule] = trpc.settings.getOneWorkingShedule.useSuspenseQuery({id:shedule_id})
  // const spreadData = workShedule ? {
  //   ...workShedule
  // }
  // :
  // {}
  const form = useForm<z.infer<typeof insertWorkingSheduleSchema>>({
    resolver: zodResolver(insertWorkingSheduleSchema),
    defaultValues:{}
  });
  const createWorkShedule = trpc.settings.createWorkingShedule.useMutation({
      onSuccess: () => {
        toast.success(`Work Shedule created successfully!`);
        utils.settings.getOneWorkingShedule.invalidate();
      },
      onError: (error) => {
        console.error("Error creating Work Shedule", error);
      }
    });

    const updateWorkShedule = trpc.settings.updateWorkingShedule.useMutation({
      onSuccess: () => {
        toast(`Work shedule updated successfully!`);
        utils.settings.getOneWorkingShedule.invalidate({ id:shedule_id });
        utils.settings.getAllWorkingShedules.invalidate();
      },
      onError: (error) => {
        console.error("Error updating work shedule", error);
      }
    });
  const onSubmit = async (data: z.infer<typeof insertWorkingSheduleSchema>) => {
    if(workShedule)
    {
      updateWorkShedule.mutate({...data, id:shedule_id})
    }
    else{
      createWorkShedule.mutate(data)
    }
  };

  return (
    <>
    <Suspense fallback={<Loading/>}>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-2 sm:gap-y-0 p-4 pb-0 w-full ">
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
          <Link href="/working-shedules">
            <p className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              Working Shedules
            </p>
          </Link>
          <p className="text-xs">New</p>
        </div>
        <div className="flex items-center gap-x-2">
          <Button disabled={createWorkShedule.isPending || updateWorkShedule.isPending} type="submit" variant="secondary" className="p-1 hover:bg-gray-300">
            <SquareArrowUpIcon className="h-5 w-5" />
          </Button>
          <Button type="button" variant="secondary" className="p-1 hover:bg-gray-300">
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>

    <div className="flex flex-col overflow-y-auto max-h-[500px] m-4 mb-0 border border-b-0 border-gray-300">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-4 lg:p-6 ">
        {/* Header - identical structure */}
        
        {/* Main form container - same structure */}
          {/* Title input - same styling */}
          <div className="border-0 border-b w-full md:w-[260px] lg:w-[360px] rounded-none">
            <FormField
              control={form.control}
              name={"work_shedule_name" as keyof z.infer<typeof insertWorkingSheduleSchema>}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      name={String(field.name)}
                      value={field.value != undefined ? String(field.value) : ""}
                      style={{ fontSize: "1.8rem" }}
                      className="border-0 border-b w-full rounded-none text-2xl"
                      placeholder="Standard 40 hours/week"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Two-column layout - identical to working schedule form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 mt-6">
            {/* Left column - text/number inputs */}
            <div className="flex flex-col gap-y-1">
              {[
                { name: "flexible_hours",label:"Flexible Hours", placeholder: "", type:"checkbox" },
                { name: "company_full_time",label:"Company Full Time", placeholder: "8" },
                { name: "average_hour_per_day",label:"Average Hour Per Day", placeholder: "40:00", type:"number" },
                { name: "work_time_rate",label:"Work time Rate", placeholder: "08:00", type: "number" },
              ].map((f) => (
                <div key={f.name} className="flex items-center gap-x-4">
                    <div className="flex w-40 flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700">
                        {f.label}
                    </div>
                  <div className="flex flex-col gap-y-1 w-full sm:w-2/3">
                  <FormField
                    control={form.control}
                    name={f.name as keyof z.infer<typeof insertWorkingSheduleSchema>}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input
                            {...field}
                            name={String(field.name)}
                            type={f.type || "text"}
                            value={field.value != undefined ? String(field.value) : ""}
                            placeholder={f.placeholder}
                            className={`${f.name === "flexible_hours" && "size-4 float-left"} border-0 border-b rounded-none`}
                            onChange={
                              (e) => field.onChange(
                                f.type === "number" 
                                ? Number(e.target.value)
                                : f.type === "checkbox"
                                ? !!e.target.checked
                                : e.target.value) 
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                </div>
              ))}
            </div>

            {/* Right column - checkboxes */}
            <div className="flex flex-col gap-y-2 gap-x-8">
              {[
                { name: "company_name",label:"Company", placeholder: "Demo Company" },
                { name: "timezone",label:"Timezone", placeholder: "Timezone" },
              ].map((f) => (
                <div key={f.name} className="flex items-center w-full gap-x-4">
                    <div className="flex flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700">
                        {f.label}
                    </div>
                  <div className="flex flex-col gap-y-1 w-full sm:w-2/3">  
                  <FormField
                        key={f.name}
                        control={form.control}
                        name={f.name as keyof z.infer<typeof insertWorkingSheduleSchema>}
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Select
                                onValueChange={(value: string) => field.onChange(value)}
                                value={String(field.value ?? '')}>
                                <SelectTrigger className="border-0 ring-0 focus:ring-0 border-b rounded-none min-w-full">
                                <SelectValue placeholder={f.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                {["test"]?.map((emp) => (
                                    <SelectItem key={emp} value={emp}>
                                    {emp}
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
                </div>
              ))}
            </div>
          </div>
        
    </form>
    </Form>
    <div className="ml-4">
      <h3 className="p-4 pl-6 pb-2 pt-2 border border-b-0 w-40 border-gray-300">Working Hours</h3>
    </div>
    <div className="border border-b-0 border-l-0 border-gray-300 mb-20">
      {/* <WorkScheduleLines/> */}
    </div>
    </div>
  </Suspense>
  </>
  );
};

export default WorkingSheduleForm;