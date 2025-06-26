import {
  useForm,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { insertWorkSheduleLineSchema } from "@/db/schema";

const WorkScheduleLines = () => {
  type WorkScheduleFormType = z.infer<typeof insertWorkSheduleLineSchema>;
  
  const form = useForm<WorkScheduleFormType>({
    resolver: zodResolver(insertWorkSheduleLineSchema),
    defaultValues: {
      lines: [
        {
          name: "",
          day_of_week: "Monday",
          day_period: "Morning",
          work_from: "8:00",
          work_to: "4:00",
          duration: "",
          work_entry_type: "Attendance",
        },
      ],
    },
  });
  
  const { control, handleSubmit } = form;
  
  const { fields: lineFields, append, remove } = useFieldArray({
    control,
    name: "lines" as keyof z.infer<typeof insertWorkSheduleLineSchema>,
  });

  const onSubmit = (data: z.infer<typeof insertWorkSheduleLineSchema>) => {
    console.log("Submitted lines:", data);
  };

  const inputFields = [
    { field: "name", type: "input", placeholder: "Name" },
    {
      field: "day_of_week",
      type: "select",
      placeholder: "Day of Week",
      options: [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
      ],
    },
    {
      field: "day_period",
      type: "select",
      placeholder: "Day Period",
      options: ["Morning", "Afternoon", "Evening", "Full Day"],
    },
    { field: "work_from", type: "input", placeholder: "Work From" },
    { field: "work_to", type: "input", placeholder: "Work To" },
    { field: "duration", type: "input", placeholder: "Duration" },
    {
      field: "work_entry_type",
      type: "select",
      placeholder: "Work Entry Type",
      options: ["Attendance", "Leave", "Break", "Meeting"],
    },
  ] as const;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 ">
        <Table>
          <TableHeader>
            <TableRow>
              {inputFields.map((f) => (
                <TableHead key={f.field}>{f.placeholder}</TableHead>
              ))}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineFields.map((line, index) => (
              <TableRow key={line.id}>
                {inputFields.map((f) => (
                  <TableCell key={f.field}>
                    <FormField
                      control={form.control}
                      name={`lines.${index}.${f.field}` as keyof z.infer<typeof insertWorkSheduleLineSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            {f.type === "input" ? (
                              <Input className="border-none ring-0 bg-transparent" {...field} name={String(field.name)} placeholder={f.placeholder} />
                            ) : (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="border-none ring-0 pr-2">
                                  <SelectValue className="pr-2" placeholder={f.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                  {f.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <button
                    type="button"
                    className="text-red-500 hover:underline text-xs"
                    onClick={() => remove(index)}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              append({
                name: "",
                day_of_week: "",
                day_period: "",
                work_from: "",
                work_to: "",
                duration: "",
                work_entry_type: "",
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            + Add Line
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </Form>
  );
};

export default WorkScheduleLines;
