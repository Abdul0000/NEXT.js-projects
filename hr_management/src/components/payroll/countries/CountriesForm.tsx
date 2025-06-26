'use client'
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { SubmitHandler, useForm } from "react-hook-form"
import { SquareArrowUpIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { trpc } from "@/trpc/client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { insertCountrySchema, insertCountrySchemaType, updateCountrySchema, } from "@/db/schema";

interface CountryFormProps {
  country_id?: string;
  title?: string;
}

const CountryForm = ({country_id}:CountryFormProps) => {
  const path = usePathname();
  const utils = trpc.useUtils();
  const searchParams = useSearchParams();

  let page = Number(searchParams.get("page")) || 1;
  let perPage = Number(searchParams.get("perPage")) || 8;

  if (page < 1) page = 1;
  if (perPage < 1) perPage = 8;
  const createCountry = trpc.settings.createCountry.useMutation({
    onSuccess: () => {
      toast.success(`Country created successfully!`);
      utils.settings.getOneCountry.invalidate();
    },
    onError: (error) => {
      console.error("Error creating country", error);
    }
  });

  const updateCountry = trpc.settings.updateCountry.useMutation({
    onSuccess: () => {
      toast(`Country updated successfully!`);
      utils.settings.getOneCountry.invalidate({ id:country_id });
      utils.settings.getAllCountries.invalidate();
    },
    onError: (error) => {
      console.error("Error updating country", error);
    }
  });

  const [getCountry] = trpc.settings.getOneCountry.useSuspenseQuery({id:country_id})
  const form = useForm<z.infer<typeof insertCountrySchema>>({
    resolver: zodResolver(insertCountrySchema),
    defaultValues:getCountry ? getCountry : {}
  });

  const onSubmit : SubmitHandler<insertCountrySchemaType> = async (data) => {
    if (getCountry) {
      updateCountry.mutate({ ...data, id:country_id });
    } else {
      createCountry.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        {/* Header buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-2 sm:gap-y-0 p-4 pb-0 w-full">
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
              <Link href="/countries">
                <p className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  Countries
                </p>
              </Link>
              <p className="text-xs">New</p>
            </div>
            <div className="flex items-center gap-x-2">
                {/* updateCountry.isPending || createCountry.isPending */}
              <Button type="submit" disabled={createCountry.isPending} variant="secondary" className="p-1 hover:bg-gray-300">
                <SquareArrowUpIcon className="h-5 w-5" />
              </Button>
              <Button type="button" variant="secondary" className="p-1 hover:bg-gray-300">
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main form container */}
        <div className="overflow-y-auto max-h-[420px] border m-4 p-4 lg:p-6 border-gray-300">
          {/* Country Name */}
          <div className="border-0 border-b w-[190px] md:w-[250px] lg:w-[300px] placeholder:text-lg rounded-none lg:placeholder:text-3xl">
            <FormField
              control={form.control}
              name={"country_name" as keyof insertCountrySchemaType}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      name={String(field.name)}
                      value={String(field.value) ?? ""}
                      style={{ fontSize: '1.5rem' }}
                      className="border-0 border-b w-full placeholder:text-xl rounded-none lg:placeholder:text-2xl"
                      placeholder="Country Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 mt-4 ">
            {/* Left column */}
            <div className="flex flex-col gap-y-2 gap-x-8">
              <div className="flex gap-x-2 w-full justify-start">
                {/* Labels column */}
                <div className="flex flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700 w-1/3">
                  <p>Currency</p>
                  <p>Country Code</p>
                  <p>Country Calling Code</p>
                  <p>Vat Label</p>
                </div>

                {/* Inputs column */}
                <div className="flex flex-col gap-y-1 w-2/3">
                  {/* Currency */}
                  {[
                    "currency",
                    "country_code",
                    "country_calling_code",
                    "vat_label",
                    ].map((fieldName) => (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={fieldName as keyof insertCountrySchemaType}
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input
                                    type={fieldName === "country_calling_code" ? "number":"text"}
                                    {...field}
                                    name={String(field.name)}
                                    value={String(field.value) ?? ""}
                                    onChange={(e) => field.onChange(fieldName === "country_calling_code" ? Number(e.target.value) : e.target.value)}
                                    className="border-0 border-b rounded-none w-full"
                                    placeholder={`${fieldName.replaceAll("_"," ")}`}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    ))
                }
                </div>
              </div>
            </div>

            {/* Right column - Advanced Address Formatting */}
            <div className="flex flex-col gap-y-2 gap-x-8">
              <div className="flex gap-x-2 w-full justify-start">
                {/* Labels */}
                <div className="flex flex-col gap-y-7 h-full pt-3 text-xs lg:text-[14px] text-gray-700 w-1/3">
                  <p>Intrastat member</p>
                  <p>Enforce Cities</p>
                  <p>Zip Required</p>
                  <p>State Required</p>
                </div>

                <div className="flex flex-col items-start gap-y-5 pt-2 w-2/3">
                   {/* Checkbox fields */}
                {["intrastat_member", "enforce_cities", "zip_required", "state_required"].map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName as keyof insertCountrySchemaType}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={!!field.value || false}
                              onCheckedChange={field.onChange}
                              className="rounded-[2px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CountryForm;