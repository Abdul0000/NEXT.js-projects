import { Input } from "@/components/ui/input"
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { insertNewEmployeeSchemaType } from "@/db/schema"
import { UseFormReturn } from "react-hook-form"

interface SettingsProps {
  form: UseFormReturn<insertNewEmployeeSchemaType>
  getEmployees: insertNewEmployeeSchemaType[]
}

const fields = [
  {
    label: "Employee Type",
    name: "employee_type",
    static: "Employee",
    disabled: true,
  },
  {
    label: "Related User",
    name: "related_user",
    placeholder: "Select or enter user",
    button: "Create User",
  },
  {
    label: "Hourly Cost",
    name: "hourly_cost",
    type: "number",
    placeholder: "0.00",
    prefix: "$",
  },
  {
    label: "Fleet Mobility Card",
    name: "fleet_mobility_card",
    placeholder: "Enter card info",
  },
  {
    label: "PIN Code",
    name: "pin_code",
    placeholder: "Enter PIN",
  },
  {
    label: "Badge ID",
    name: "badge_id",
    placeholder: "Badge ID",
    button: "Generate",
  },
]

const Settings = ({ form }: SettingsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 m-2 mt-4 mb-4">
      {fields.map(({ label, name, static: staticVal, placeholder, type, prefix, button }) => (
        <div key={name.toString()} className="flex items-center gap-x-0 md:gap-x-2">
          {/* Label */}
          <div className="text-xs lg:text-[0.875rem] font-semibold min-w-36">{label}</div>

          {/* Field and optional button */}
          <div className="flex items-end gap-x-2 w-[200px] md:w-[250px] lg:w-[300px]">
            {staticVal ? (
              <Input value={staticVal} disabled />
            ) : (
              <FormField
                control={form.control}
                name={name as keyof insertNewEmployeeSchemaType}
                render={({ field }) => (
                  <FormItem className="w-full relative">
                    {prefix && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {prefix}
                      </span>
                    )}
                    <FormControl>
                      <Input
                        {...field}
                        type={type || "text"}
                        placeholder={placeholder}
                        className={`w-full border-0 border-none rounded-none ${
                          prefix ? "pl-7" : ""
                        }`}
                        value={
                          field.value === null || field.value === undefined
                            ? String(field.value)
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {button && (
              <button
                type="button"
                className="text-blue-600 text-sm underline mb-1 whitespace-nowrap"
              >
                {button}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Settings
