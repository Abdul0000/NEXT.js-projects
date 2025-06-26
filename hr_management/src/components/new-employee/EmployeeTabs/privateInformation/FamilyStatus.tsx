// components/private-information/FamilyStatus.tsx
import { UseFormReturn } from "react-hook-form"
import { insertNewEmployeeSchemaType } from "@/db/schema"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface FamilyStatusProps {
  form: UseFormReturn<insertNewEmployeeSchemaType>
}

const FamilyStatus = ({ form }: FamilyStatusProps) => {
  const fields: Array<{
    label: string
    name: string
    placeholder: string
    type?: "text" | "number"
  }> = [
    {
      label: "Marital Status",
      name: "marital_status",
      placeholder: "e.g. Single, Married",
    },
    {
      label: "Number of Dependent Children",
      name: "number_of_dependent_children",
      placeholder: "0",
      type: "number",
    },
  ]

  return (
    <section>
      <h3 className="text-sm font-semibold  border-gray-300 mt-4">
        FAMILY STATUS
      </h3>

      <div className="flex flex-col gap-y-1">
        {fields.map(({ label, name, placeholder, type }) => (
          <div key={name.toString()} className="flex items-end gap-x-0 md:gap-x-2 ">
            {/* Label column (fixed width) */}
            <div className="text-xs lg:text-[0.875rem] font-semibold min-w-44">{label}</div>

            {/* Input column (flex-grow) */}
            <div className="flex flex-col gap-y-1 w-[200px] md:w-[250px] lg:w-[300px]">
              <FormField
                control={form.control}
                name={name as keyof insertNewEmployeeSchemaType}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type={type ?? "text"}
                        placeholder={placeholder}
                        className="border-0  rounded-none w-full"
                        value={
                          typeof field.value === "string" || typeof field.value === "number"
                            ? field.value
                            : field.value instanceof Date
                            ? field.value.toISOString()
                            : ""
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
    </section>
  )
}

export default FamilyStatus
