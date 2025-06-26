// components/private-information/Education.tsx
import { UseFormReturn } from "react-hook-form"
import { insertNewEmployeeSchemaType } from "@/db/schema"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface EducationProps {
  form: UseFormReturn<insertNewEmployeeSchemaType>
}

const Education = ({ form }: EducationProps) => {
  //
  // 1️⃣ Define an array of education fields
  //
  const fields: Array<{
    label: string
    name: string
    placeholder: string
  }> = [
    {
      label: "Certificate Level",
      name: "certificate_level",
      placeholder: "e.g. Bachelor, Master",
    },
    {
      label: "Field of Study",
      name: "field_of_study",
      placeholder: "e.g. Computer Science",
    },
    {
      label: "School",
      name: "school",
      placeholder: "School Name",
    },
  ]

  return (
    <section>
      <h3 className="text-sm font-semibold  border-gray-300 mt-4">
        EDUCATION
      </h3>

      <div className="flex flex-col gap-y-1">
        {fields.map(({ label, name, placeholder }) => (
          <div key={name.toString()} className="flex items-end gap-x-0 md:gap-x-2">
            {/* Label column (fixed width) */}
            <div className="text-xs lg:text-[0.875rem] font-semibold min-w-36">{label}</div>

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
                            : String(field.value)
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

export default Education
