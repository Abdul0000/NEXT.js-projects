"use client";

import { insertSalaryStrucureSchema } from "@/db/schema";
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
import { useEffect, useRef, useState, Fragment } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type SalaryStructure = z.infer<typeof insertSalaryStrucureSchema> & { id: string;
  structure_name:string;
 };

interface ListViewProps {
  data: SalaryStructure[];
  selectedFilters: string[];
}

// const StatusBadge = ({ status }: { status: string }) => {
//   const normalizedStatus = status.toLowerCase();
//   const statusClass =
//     {
//       new: "bg-blue-100 text-blue-800 border-blue-200",
//       running: "bg-green-100 text-green-800 border-green-200",
//       expired: "bg-red-100 text-red-800 border-red-200",
//       canceled: "bg-yellow-100 text-yellow-800 border-yellow-200",
//     }[normalizedStatus] || "bg-gray-100 text-gray-800 border-gray-200";

//   return (
//     <div
//       className={cn(
//         "py-0.5 px-2 rounded-full border text-[10px] sm:text-xs font-medium w-fit mx-auto",
//         statusClass
//       )}
//     >
//       {status}
//     </div>
//   );
// };

const SalaryStructureListView = ({ data, selectedFilters }: ListViewProps) => {
  const router = useRouter();
  const onRowClick = (id: string) => router.push(`/update-salary-structure/${id}`);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const headerCheckboxRef = useRef<HTMLButtonElement>(null);

  const groupBy = selectedFilters.length > 0;
  const allAttendance = data;
  const allSelected = allAttendance.length > 0 && selectedIds.length === allAttendance.length;
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
    setSelectedIds(checked ? data.map((c) => c.id!) : []);
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)));
  };

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderRow = (structures: SalaryStructure) => (
    <TableRow
      onClick={() => onRowClick(structures.id!)}
      key={structures.id}
      className="hover:bg-emerald-50 text-emerald-900 cursor-pointer"
    >
      <TableCell
        className="px-1 py-2 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={selectedIds.includes(structures.id!)}
          onCheckedChange={(checked) => toggleSelectOne(structures.id!, !!checked)}
          className="rounded-[1px] mx-auto"
        />
      </TableCell>

      <TableCell className="px-2 py-2 truncate text-xs sm:text-sm font-medium w-[100px] sm:w-[120px]">
        {structures.structure_name}
      </TableCell>

      <TableCell className="px-2 py-2 truncate text-xs sm:text-sm w-[100px] sm:w-[100px]">
        {}
      </TableCell>

      <TableCell className="px-2 py-2 truncate text-xs sm:text-sm w-[100px] sm:w-[120px] hidden sm:table-cell">
        {structures.country_name}
      </TableCell>

      {/* <TableCell className="px-2 py-2 truncate text-xs sm:text-sm w-[100px] sm:w-[120px] hidden md:table-cell">
        {structureType.work_shedule_name}
      </TableCell>

       <TableCell className="px-2 py-2 truncate text-xs sm:text-sm w-[100px] sm:w-[120px] hidden md:table-cell">
        {structureType.wage_type}
      </TableCell>

      <TableCell className="px-2 py-2 truncate text-xs sm:text-sm w-[100px] sm:w-[120px] hidden md:table-cell">
        {structureType.pay_structure_name}
      </TableCell> */}

      {/* <TableCell className="px-2 py-2 text-xs sm:text-sm w-[80px] sm:w-[80px]">
        <StatusBadge status={attendance.status ?? "New"} />
      </TableCell> */}
    </TableRow>
  );

  const groupedData = Object.entries(
    data.reduce<
      Record<
        string,
        { groupKey: string; groupFields: Record<string, string>; structureType: SalaryStructure[] }
      >
    >((acc, salaryStructure) => {
      const groupFields: Record<string, string> = {};
      for (const field of selectedFilters) {
        groupFields[field] = (salaryStructure[field as keyof SalaryStructure] as string) ?? "Unknown";
      }
      const groupKey = selectedFilters.map((f) => groupFields[f]).join(" | ");
      if (!acc[groupKey]) {
        acc[groupKey] = {
          groupKey,
          groupFields,
          structureType: [],
        };
      }
      acc[groupKey].structureType.push(salaryStructure);
      return acc;
    }, {})
  );

  const tableHeaders = [
  { key: "checkbox", label: "", width: "w-[30px]", className: "text-center" },
  { key: "salary_structure_name", label: "Structure", width: "w-[100px] sm:w-[120px]" },
  { key: "salary_rules", label: "Salary Rules", width: "w-[100px] sm:w-[120px]" },
  { key: "country_name", label: "Country", width: "w-[100px] sm:w-[100px]" },
  // { key: "work_shedule_name", label: "Working Hours", width: "w-[100px] sm:w-[100px]" },
  // { key: "wage_type", label: "Wage Type", width: "w-[100px] sm:w-[120px]"},
  // { key: "salary_structure_name", label: "Pay Structure", width: "w-[100px] sm:w-[120px]"},
];


  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[800px] sm:min-w-full">
        <TableHeader>
          <TableRow className="text-[11px] sm:text-[13px] font-semibold">
            {tableHeaders.map((header, idx) => (
              <TableHead
                key={idx}
                className={cn("px-2 py-2", header.width, header.className)}
              >
                {header.key === "checkbox" ? (
                  <Checkbox
                    ref={headerCheckboxRef}
                    checked={allSelected}
                    onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                    className="rounded-[1px] mx-auto"
                  />
                ) : (
                  <span className="truncate">{header.label}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!groupBy && data.map(renderRow)}

          {groupBy &&
            groupedData.map(([groupKey, group]) => {
              const isExpanded = expandedGroups.has(groupKey);
              return (
                <Fragment key={groupKey}>
                  <TableRow
                    className="bg-gray-100 cursor-pointer"
                    onClick={() => toggleGroup(groupKey)}
                  >
                    <TableCell colSpan={12} className="px-4 py-3">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <span className="text-lg">{isExpanded ? "▾" : "▸"}</span>
                        <span className="font-semibold truncate">{groupKey}</span>
                        <span className="text-[10px] sm:text-xs text-gray-600">
                          ({group.structureType.length}{" "}
                          {group.structureType.length > 1 ? "contracts" : "contract"})
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && group.structureType.map(renderRow)}
                </Fragment>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalaryStructureListView;
