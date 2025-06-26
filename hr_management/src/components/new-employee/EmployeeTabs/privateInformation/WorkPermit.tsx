// components/private-information/WorkPermit.tsx
import { UseFormReturn } from "react-hook-form"
import { insertNewEmployeeSchemaType } from "@/db/schema"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface WorkPermitProps {
  form: UseFormReturn<insertNewEmployeeSchemaType>
}

const WorkPermit = ({ form }: WorkPermitProps) => {
  //
  // 1️⃣ Define an array of work permit fields (excluding file upload)
  //
  const fields: Array<{
    label: string
    name: string
    placeholder?: string
    type?: "text" | "date"
  }> = [
    {
      label: "Visa No",
      name: "visa_no",
      placeholder: "Visa Number",
    },
    {
      label: "Work Permit No",
      name: "work_permit_no",
      placeholder: "Permit Number",
    },
    {
      label: "Visa Expiration Date",
      name: "visa_expiration_date",
      type: "date",
    },
    {
      label: "Work Permit Expiration Date",
      name: "work_permit_expiration_date",
      type: "date",
    },
  ]

  return (
    <section>
      <h3 className="text-sm font-semibold  border-gray-300 mt-4">
        WORK PERMIT
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
                          typeof field.value === "string" || typeof field.value === "number"
                            ? field.value
                            : field.value instanceof Date
                            ? field.value.toISOString().slice(0, 10)
                            : field.value === null || field.value === undefined
                            ? ""
                            : String(field.value)
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

        {/* —————————————————————————————————————————————————————————————————————
           3️⃣ Handle the Work Permit File Upload separately
        ————————————————————————————————————————————————————————————————————— */}
        <div className="flex items-center gap-x-4">
          {/* Label column */}
          <div className="text-xs lg:text-[0.875rem] font-semibold min-w-36">Work Permit File</div>

          {/* Button column */}
          <div className="flex-1">
            <FormField
              control={form.control}
              name={"work_permit_file" as keyof insertNewEmployeeSchemaType}
              render={() => (
                <FormItem>
                  <FormControl>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        /* open file picker or modal */
                      }}
                    >
                      Upload your file
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkPermit
