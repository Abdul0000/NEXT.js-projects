// components/private-information/Citizenship.tsx
import { UseFormReturn } from "react-hook-form"
import { insertNewEmployeeSchemaType } from "@/db/schema"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface CitizenshipProps {
  form: UseFormReturn<insertNewEmployeeSchemaType>
}

const Citizenship = ({ form }: CitizenshipProps) => {
  const fields: Array<{
    label: string
    name: string
    placeholder?: string
    type?: "text" | "date"
  }> = [
    {
      label: "Nationality (Country)",
      name: "nationality_country",
      placeholder: "Country…",
    },
    {
      label: "Identification No",
      name: "identification_no",
      placeholder: "ID Number",
    },
    {
      label: "SSN No",
      name: "ssn_no",
      placeholder: "SSN Number",
    },
    {
      label: "Passport No",
      name: "passport_no",
      placeholder: "Passport Number",
    },
    {
      label: "Gender",
      name: "gender",
      placeholder: "Male / Female / Other",
    },
    {
      label: "Birthday",
      name: "birthday",
      type: "date",
    },
    {
      label: "Place of Birth",
      name: "place_of_birth",
      placeholder: "City / State",
    },
    {
      label: "Country of Birth",
      name: "country_of_birth",
      placeholder: "Country…",
    },
  ]

  return (
    <section>
      <h3 className="text-sm font-semibold  border-gray-300 mt-4">
        CITIZENSHIP
      </h3>

      <div className="flex flex-col gap-y-1">
        {/* —————————————————————————————————————————————————————————————————————
           2️⃣ Loop over `fields` and render each as a flex-row (label to the left)
        ————————————————————————————————————————————————————————————————————— */}
        {fields.map(({ label, name, placeholder, type }) => (
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
                        type={type ?? "text"}
                        placeholder={type === "date" ? undefined : placeholder}
                        className="border-0  rounded-none w-full"
                        value={
                          typeof field.value === "string"
                            ? field.value
                            : typeof field.value === "number"
                            ? field.value
                            : undefined
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

        <div className="flex items-center gap-x-4">
          {/* Label column */}
          <div className="w-48 text-xs text-gray-700" />

          {/* Checkbox column */}
          <div className="flex items-center gap-x-2">
            <FormField
              control={form.control}
              name={"non_resident" as keyof insertNewEmployeeSchemaType}
              render={({ field }) => (
                <input
                  type="checkbox"
                  name={field.name}
                  ref={field.ref}
                  checked={Boolean(field.value)}
                  onChange={e => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              )}
            />
            <label className="text-xs lg:text-[0.875rem] font-semibold">Non-resident</label>
          </div>
          <FormMessage />
        </div>
      </div>
    </section>
  )
}

export default Citizenship
