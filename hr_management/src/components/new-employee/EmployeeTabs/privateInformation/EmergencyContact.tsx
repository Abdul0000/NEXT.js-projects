// components/private-information/EmergencyContact.tsx
import { UseFormReturn } from "react-hook-form"
import { insertNewEmployeeSchemaType } from "@/db/schema"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface EmergencyContactProps {
  form: UseFormReturn<insertNewEmployeeSchemaType>
}

const EmergencyContact = ({ form }: EmergencyContactProps) => {

  const fields: Array<{
    label: string
    name: string
    placeholder: string
  }> = [
    {
      label: "Contact Name",
      name: "emergency_contact_name",
      placeholder: "Name",
    },
    {
      label: "Contact Phone",
      name: "emergency_contact_phone",
      placeholder: "+123456789",
    },
  ]

  return (
    <section>
      <h3 className="text-sm font-semibold  border-gray-300 mt-4">
        EMERGENCY
      </h3>

      <div className="flex flex-col gap-y-1">
        {fields.map(({ label, name, placeholder }) => (
          <div key={name.toString()} className="flex items-end gap-x-0 md:gap-x-2">
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
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EmergencyContact
