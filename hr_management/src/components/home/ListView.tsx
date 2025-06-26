"use client";

import { insertNewEmployeeSchema, insertNewEmployeeSchemaType } from "@/db/schema";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useRef, useState, Fragment } from "react";

type emps = insertNewEmployeeSchemaType &
{
  department_name: string;
}
type GroupedData = {
  group?: Record<string, string | number | null>;
  employees?: z.infer<typeof insertNewEmployeeSchema>[] | emps[];
}[];

interface ListViewProps {
  data: z.infer<typeof insertNewEmployeeSchema>[] | GroupedData;
  filter?: string;
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds: string[];
}

const ListView = ({ data, filter, selectedIds, setSelectedIds }: ListViewProps) => {
  const router = useRouter();
  const onRowClick = (id: string) => router.push(`/employee_update/${id}`);

  const allEmployees = filter
    ? (data as GroupedData).flatMap((group) => group.employees)
    : (data as z.infer<typeof insertNewEmployeeSchema>[]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const headerCheckboxRef = useRef<HTMLButtonElement>(null);

  const allSelected =
    allEmployees.length > 0 && selectedIds.length === allEmployees.length;
  const isIndeterminate = selectedIds.length > 0 && !allSelected;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      const input = headerCheckboxRef.current.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement | null;
      if (input) input.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? allEmployees.map((emp) => emp?.id as string) : []);
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[600px] sm:min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[30px] px-1 py-2 text-center text-red-900">
              <Checkbox
                ref={headerCheckboxRef}
                checked={allSelected}
                onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                className="rounded-[1px] mx-auto"
              />
            </TableHead>
            <TableHead className="px-2 py-2 text-xs sm:text-sm w-[120px] text-red-900">
              Employee
            </TableHead>
            <TableHead className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden sm:table-cell text-red-900">
              Work Phone
            </TableHead>
            <TableHead className="px-2 py-2 text-xs sm:text-sm w-[140px] hidden md:table-cell text-red-900">
              Work Email
            </TableHead>
            <TableHead className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden lg:table-cell text-red-900">
              Department
            </TableHead>
            <TableHead className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden lg:table-cell text-red-900">
              Job Position
            </TableHead>
            <TableHead className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden xl:table-cell text-red-900">
              Manager
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filter ? (
            (data as GroupedData).map((groupData) => {
              const groupKey = JSON.stringify(groupData.group);
              const isExpanded = expandedGroups.has(groupKey);

              return (
                <Fragment key={groupKey}>
                  <TableRow
                    className="bg-gray-50 cursor-pointer"
                    onClick={() => toggleGroup(groupKey)}
                  >
                    <TableCell colSpan={7} className="px-4 py-3 bg-gray-50">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base">
                          {isExpanded ? "▾" : "▸"}
                        </span>
                        {Object.entries(groupData.group).map(([key, value]) => {
                          const formattedValue =
                            typeof value === "string"
                              ? value
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())
                              : value ?? "N/A";
                          return (
                            <span
                              key={key}
                              className="text-sm sm:text-base font-semibold"
                            >
                              {formattedValue}
                            </span>
                          );
                        })}
                        <span className="text-sm text-gray-600">
                          ({groupData.employees.length}{" "}
                          {groupData.employees.length !== 1
                            ? "employees"
                            : "employee"}
                          )
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>

                  {isExpanded &&
                    groupData.employees.map((employee) => (
                      <TableRow
                        onClick={() => onRowClick(employee.id!)}
                        key={employee.id}
                        className="hover:bg-emerald-50 cursor-pointer"
                      >
                        <TableCell
                          className="px-1 py-2 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={selectedIds.includes(employee.id!)}
                            onCheckedChange={(checked) =>
                              toggleSelectOne(employee.id!, !!checked)
                            }
                            className="rounded-[1px] mx-auto"
                          />
                        </TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:text-sm font-medium w-[120px] text-emerald-900">
                          {employee.employee_name}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden sm:table-cell text-emerald-900">
                          {employee.work_phone}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:text-sm w-[140px] hidden md:table-cell truncate text-emerald-900">
                          {employee.work_email}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden lg:table-cell text-emerald-900">
                          {employee.department_name}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden lg:table-cell text-emerald-900">
                          {employee.job_title}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden xl:table-cell text-emerald-900">
                          {employee.manager}
                        </TableCell>
                      </TableRow>
                    ))}
                </Fragment>
              );
            })
          ) : (
            (data as z.infer<typeof insertNewEmployeeSchema>[]|emps[]).map(
              (employee) => (
                <TableRow
                  onClick={() => onRowClick(employee.id!)}
                  key={employee.id}
                  className="hover:bg-emerald-50 cursor-pointer"
                >
                  <TableCell
                    className="px-1 py-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedIds.includes(employee.id!)}
                      onCheckedChange={(checked) =>
                        toggleSelectOne(employee.id!, !!checked)
                      }
                      className="rounded-[1px] mx-auto"
                    />
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:text-sm font-medium w-[120px] text-emerald-900">
                    {employee.employee_name}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden sm:table-cell text-emerald-900">
                    {employee.work_phone}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:text-sm w-[140px] hidden md:table-cell truncate text-emerald-900">
                    {employee.work_email}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden lg:table-cell text-emerald-900">
                    {employee.department_name}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden lg:table-cell text-emerald-900">
                    {employee.job_title}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-xs sm:text-sm w-[120px] hidden xl:table-cell text-emerald-900">
                    {employee.manager}
                  </TableCell>
                </TableRow>
              )
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListView;
