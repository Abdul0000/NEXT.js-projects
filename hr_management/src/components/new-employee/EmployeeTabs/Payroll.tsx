import { UseFormReturn } from "react-hook-form"
import { insertNewEmployeeSchemaType } from "@/db/schema"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface PayrollProps {
  form: UseFormReturn<insertNewEmployeeSchemaType>
}

const Payroll = ({ form }: PayrollProps) => {
  
  const fields: Array<{
    label: string
    name: string
    placeholder: string
  }> = [
    {
      label: "Legal Name",
      name: "legal_name",
      placeholder: "Name",
    },
    {
      label: "Payslip Language",
      name: "payslip_language",
      placeholder: "eg. eng, urd...",
    },
    {
      label: "Employee Reference",
      name: "employee_reference",
      placeholder: "Registration no.",
    },
    {
      label: "Disabled",
      name: "disabled",
      placeholder: "",
    },
  ]

  return (
    <section>
      <h3 className="text-sm font-semibold  border-gray-300 pb-2 mb-4 mt-4">
        EMERGENCY
      </h3>

      <div className="flex flex-col gap-y-1 mb-4">
        
        {fields.map(({ label, name, placeholder }) => (
          <div key={name.toString()} className="flex items-center gap-x-0 md:gap-x-2">
            {/* Label column (fixed width) */}
            <div className="text-xs lg:text-[0.875rem] font-semibold min-w-36">{label}</div>

            {/* Input column (flex-grow) */}
            <div className="flex flex-col gap-y-1 w-[200px] md:w-[250px] lg:w-[300px]">
              {name.toString() === "disabled" ? 
              (<FormField
                control={form.control}
                name={name as keyof insertNewEmployeeSchemaType}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="checkbox"
                        value={
                          field.value === null || field.value === undefined
                            ? ""
                            : typeof field.value === "string" || typeof field.value === "number"
                            ? field.value
                            : ""
                        }
                        placeholder={placeholder}
                        className="border rounded-none self-start size-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />)
              :
              (<FormField
                control={form.control}
                name={name as keyof insertNewEmployeeSchemaType}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={
                          field.value === null || field.value === undefined
                            ? ""
                            : typeof field.value === "string" || typeof field.value === "number"
                            ? field.value
                            : ""
                        }
                        placeholder={placeholder}
                        className="border-0  rounded-none w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />)
            }
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Payroll
