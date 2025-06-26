"use client";

import { insertEmployeeContractSchemaType } from "@/db/schema";
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
import { cn } from "@/lib/utils";

interface ListViewProps {
  data: insertEmployeeContractSchemaType[];
  selectedFilters: string[];
}

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.toLowerCase();
  const statusClass =
    {
      new: "bg-blue-100 text-blue-800 border-blue-200",
      running: "bg-green-100 text-green-800 border-green-200",
      expired: "bg-red-100 text-red-800 border-red-200",
      canceled: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }[normalizedStatus] || "bg-gray-100 text-gray-800 border-gray-200";
  
  return (
    <div
      className={cn(
        "py-0.5 px-2 rounded-full border text-[10px] sm:text-xs font-medium w-fit mx-auto",
        statusClass
      )}
    >
      {status}
    </div>
  );
};

const ListView = ({ data, selectedFilters }: ListViewProps) => {
  
  const router = useRouter();
  const onRowClick = (id: string) => router.push(`/contract-update/${id}`);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const headerCheckboxRef = useRef<HTMLButtonElement>(null);

  const groupBy = selectedFilters.length > 0;
  const allContracts = data;
  const allSelected = allContracts.length > 0 && selectedIds.length === allContracts.length;
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
    setSelectedIds(
      checked && Array.isArray(data)
        ? data.map((c) => c.id).filter((id): id is string => typeof id === "string")
        : []
    );
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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);

  const renderRow = (contract: insertEmployeeContractSchemaType &{employee_name?:string,department_name?:string}) => (
    <TableRow
      onClick={() => onRowClick(contract.id!)}
      key={contract.id}
      className="hover:bg-emerald-50 text-emerald-900 cursor-pointer"
    >
      <TableCell
        className="px-1 py-2 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={selectedIds.includes(contract.id!)}
          onCheckedChange={(checked) => toggleSelectOne(contract.id!, !!checked)}
          className="rounded-[1px] mx-auto"
        />
      </TableCell>

      <TableCell className="px-2 py-2 truncate text-xs sm:text-sm font-medium w-[100px] sm:w-[120px]">
        {contract.employee_name}
      </TableCell>

      <TableCell className="px-2 py-2 truncate text-xs sm:text-sm w-[100px] sm:w-[100px]">
        {contract.contract_name}
      </TableCell>

      <TableCell className="px-2 py-2 truncate text-xs sm:text-sm w-[100px] sm:w-[120px] hidden sm:table-cell">
        {contract.department_name}
      </TableCell>

      <TableCell className="px-2 py-2 truncate text-xs sm:text-sm w-[100px] sm:w-[120px] hidden md:table-cell">
        {contract.job_position}
      </TableCell>

      <TableCell className="px-2 py-2 text-xs sm:text-sm w-[60px] sm:w-[80px]">
        {contract.start_date}
      </TableCell>

      <TableCell className="px-2 py-2 text-xs sm:text-sm w-[60px] sm:w-[80px]">
        {contract.end_date || "-"}
      </TableCell>

      <TableCell className="px-2 py-2 truncate text-xs sm:text-sm w-[80px] sm:w-[100px] hidden lg:table-cell">
        {contract.contract_type}
      </TableCell>

      <TableCell className="px-2 py-2 text-xs sm:text-sm w-[80px] sm:w-[120px] hidden lg:table-cell">
        {formatCurrency(Number(contract.wage_on_signed))}
      </TableCell>

      <TableCell className="px-2 py-2 text-xs sm:text-sm w-[80px] sm:w-[100px] hidden xl:table-cell">
        {formatCurrency(0)}
      </TableCell>

      <TableCell className="px-2 py-2 truncate text-xs sm:text-sm w-[100px] sm:w-[120px] hidden lg:table-cell">
        {contract.working_schedule}
      </TableCell>

      <TableCell className="px-2 py-2 text-xs sm:text-sm w-[80px] sm:w-[80px]">
        <StatusBadge status={contract.status ?? "New"} />
      </TableCell>
    </TableRow>
  );

  const groupedData = Object.entries(
    data.reduce<
      Record<
        string,
        { groupKey: string; groupFields: Record<string, string>; contracts: insertEmployeeContractSchemaType[] }
      >
    >((acc, contract) => {
      const groupFields: Record<string, string> = {};
      for (const field of selectedFilters) {
        groupFields[field] = (contract[field as keyof insertEmployeeContractSchemaType] as string) ?? "Unknown";
      }
      const groupKey = selectedFilters.map((f) => groupFields[f]).join(" | ");
      if (!acc[groupKey]) {
        acc[groupKey] = {
          groupKey,
          groupFields,
          contracts: [],
        };
      }
      acc[groupKey].contracts.push(contract);
      return acc;
    }, {})
  );

  const tableHeaders = [
  { key: "checkbox", label: "", width: "w-[30px]", className: "text-center" },
  { key: "employee_name", label: "Employee", width: "w-[100px] sm:w-[120px]" },
  { key: "contract_name", label: "Contract", width: "w-[100px] sm:w-[100px]" },
  { key: "department_name", label: "Department", width: "w-[100px] sm:w-[120px]", hide: "hidden sm:table-cell" },
  { key: "job_position", label: "Job Position", width: "w-[100px] sm:w-[120px]", hide: "hidden md:table-cell" },
  { key: "start_date", label: "Start", width: "w-[60px] sm:w-[80px]" },
  { key: "end_date", label: "End", width: "w-[60px] sm:w-[80px]" },
  { key: "contract_type", label: "Type", width: "w-[80px] sm:w-[100px]", hide: "hidden lg:table-cell" },
  { key: "wage_on_signed", label: "Wage", width: "w-[80px] sm:w-[120px]", hide: "hidden lg:table-cell" },
  { key: "yearly", label: "Yearly", width: "w-[80px] sm:w-[100px]", hide: "hidden xl:table-cell" },
  { key: "working_schedule", label: "Schedule", width: "w-[100px] sm:w-[120px]", hide: "hidden lg:table-cell" },
  { key: "status", label: "Status", width: "w-[80px] sm:w-[80px]" },
];

if (data && data.length === 0){
    return (
        <div className="flex text-muted-foreground items-center justify-center pt-[160px]">
          <h1>Create your first contract</h1>
        </div>
      );
  }
   
  return (
    <div className="w-full overflow-x-auto pl-2 pr-2">
      <Table className="min-w-[800px] sm:min-w-full">
        <TableHeader>
          <TableRow className="text-[11px] sm:text-[13px] bg-gray-50 font-semibold">
            {tableHeaders.map((header, idx) => (
              <TableHead
                key={idx}
                className={cn("px-2 py-2", header.width, header.className, header.hide)}
              >
                {header.key === "checkbox" ? (
                  <Checkbox
                    ref={headerCheckboxRef}
                    checked={allSelected}
                    onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                    className="rounded-[1px] mx-auto"
                  />
                ) : (
                  <span className="truncate text-red-900 font-semibold">{header.label}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!groupBy && (data ?? []).map(renderRow)}

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
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-lg">{isExpanded ? "▾" : "▸"}</span>
                        <span className="font-semibold truncate">{groupKey}</span>
                        <span className="text-[10px] sm:text-xs text-gray-600">
                          ({group.contracts.length}{" "}
                          {group.contracts.length > 1 ? "contracts" : "contract"})
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && group.contracts.map(renderRow)}
                </Fragment>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListView;
