// components/private-information/PrivateContact.tsx
import { UseFormReturn } from "react-hook-form"
import { insertNewEmployeeSchemaType } from "@/db/schema"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface PrivateContactProps {
  form: UseFormReturn<insertNewEmployeeSchemaType>
}

const PrivateContact = ({ form }: PrivateContactProps) => {
  //
  // 1️⃣ Merge all fields into a single array
  //
  const allFields: Array<{
    label: string
    name: string
    placeholder?: string
    type?: "text" | "number"
  }> = [
    // Single‐column fields
    {
      label: "Private Address (Street 1)",
      name: "private_address_street1",
      placeholder: "Street…",
    },
    {
      label: "Private Address (Street 2)",
      name: "private_address_street2",
      placeholder: "Street 2…",
    },
    {
      label: "Private Email",
      name: "private_email",
      placeholder: "e.g. myprivateemail@example.com",
    },
    {
      label: "Private Phone",
      name: "private_phone",
      placeholder: "+123456789",
    },
    {
      label: "Bank Account",
      name: "bank_account",
      placeholder: "Account Number",
    },
    {
      label: "Home‑Work Distance",
      name: "home_work_distance",
      placeholder: "0",
      type: "number",
    },
    {
      label: "Private Car Plate",
      name: "private_car_plate",
      placeholder: "Car Plate #",
    },

    // Address group fields
    {
      label: "City",
      name: "private_address_city",
      placeholder: "City…",
    },
    {
      label: "State",
      name: "private_address_state",
      placeholder: "State…",
    },
    {
      label: "ZIP",
      name: "private_address_zip",
      placeholder: "ZIP…",
    },
    {
      label: "Country",
      name: "private_address_country",
      placeholder: "Country…",
    },
  ]

  return (
    <section>
      <h3 className="text-sm font-semibold  border-gray-300 mt-4">
        PRIVATE CONTACT
      </h3>

      <div className="flex flex-col gap-y-1">
        {allFields.map(({ label, name, placeholder, type }) => (
          <div key={name.toString()} className="flex items-end gap-x-0 md:gap-x-2 w-full justify-start">
            {/* Label column (fixed width) */}
            <div className="text-xs lg:text-[0.875rem] font-semibold min-w-44">
              {label}
            </div>

            {/* Input column (flex-grow) */}
            <div className="flex flex-col gap-y-1 w-[200px] md:w-[250px] lg:w-[300px]">
              <FormField
                control={form.control}
                name={name as keyof insertNewEmployeeSchemaType}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {type === "number" ? (
                        <div className="flex items-center gap-x-2">
                          <Input
                            {...field}
                            type="number"
                            placeholder={placeholder}
                            className="border-0  rounded-none w-full"
                            value={
                              field.value === null || field.value === undefined
                                ? ""
                                : String(field.value)
                            }
                          />
                          {/* Append “km” only for home_work_distance */}
                          {name === "home_work_distance" && (
                            <span className="text-sm text-gray-600">km</span>
                          )}
                        </div>
                      ) : (
                        <Input
                          {...field}
                          placeholder={placeholder}
                          className="border-0  rounded-none w-full"
                          value={
                            field.value === null || field.value === undefined
                              ? ""
                              : String(field.value)
                          }
                        />
                      )}
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

export default PrivateContact
