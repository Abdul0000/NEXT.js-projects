"use client";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  GroupIcon,
  Rows4Icon,
  SquareIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, Dispatch, SetStateAction } from "react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface HeaderBottomProps {
  setIsOpenView?: (isOpen: boolean) => void;
  title: string;
  setSelectedFilters?: Dispatch<
    SetStateAction<("department" | "manager" | "job_position" | "status")[]>
  >;
  isLoading?: boolean;
  selectedFilters?: ("department" | "manager" | "job_position" | "status")[];
  setIsSearchValue?: (value: string) => void;
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds: string[];
  perPage: number;
  page: number;
  totalPages: number;
}

const HeaderBottom = ({
  setIsOpenView,
  title,
  setSelectedFilters,
  selectedFilters,
  isLoading,
  setIsSearchValue,
  setSelectedIds,
  selectedIds,
  perPage,
  page,
  totalPages
}: HeaderBottomProps) => {
  const onOpenListView = () => setIsOpenView(false);
  const onOpenKanbanView = () => setIsOpenView(true);
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const deleteRecords = trpc.getEmployees.deleteEmployeeRecords.useMutation({
    onSuccess: () => {
      toast.success("Records deleted successfully");
      utils.getEmployees.getAllEmployees.invalidate();
      setSelectedIds([]);
    },
  });

  const onDeleteHandle = () => {
    deleteRecords.mutate({ selected_ids: selectedIds });
  };

  const toggleFilter = (value: string) => {
    if (setSelectedFilters) {
      setSelectedFilters((prev) =>
        prev.includes(value as "department" | "manager" | "job_position" | "status")
          ? prev.filter((v) => v !== value)
          : [...prev, value as "department" | "manager" | "job_position" | "status"]
      );
    }
  };

  const dynamicPath = 
              title === "Employees"
              ? "/employees"
              : title === "Departments"
              ? "/departments"
              : title === "Attendance"
              ? "/attendance"
              : title === "Salary structure type"
              ? "/salary-structure-type"
              : title === "Salary structure"
              ? "/salary-structure"
              : title === "Salary rules"
              ? "/salary-rules"
              : title === "Countries"
              ? "/countries"
              : title === "Working Shedules"
              ? "/working-shedules"
              : "/contracts"

              
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-2 px-2 md:px-4 py-2 border-b bg-white">
      {/* Left: New Button + Title */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={
            title === "Employees"
              ? "/new-employee"
              : title === "Employee Contracts"
              ? "/new-contract"
              : title === "Attendance"
              ? "/new-attendance"
              : title === "Salary rules"
              ? "/new-rule"
              : title === "Salary structure type"
              ? "/new-structure-type"
              : title === "Salary structure"
              ? "/new-structure"
              : title === "Countries"
              ? "/new-country"
              : title === "Working Shedules"
              ? "/new-working-shedule"
              : "/new_department"
          }
        >
          <Button className="h-[30px] w-[60px] md:h-[36px] md:w-[80px]" variant={"blue"}>
            New
          </Button>
        </Link>
        <p className="text-sm md:text-lg font-semibold">{title}</p>
      </div>

      {/* Center: Search + Filters */}
      <div className="w-full sm:w-auto flex items-center justify-center mt-2 sm:mt-0">
        {selectedIds && selectedIds.length > 0 ? (
          <div className="flex gap-x-2">
            <Button disabled={true} variant={"outline"}>
              {selectedIds.length}
              <span className="pl-2">Selected</span>
            </Button>
            <Button disabled={deleteRecords.isPending} onClick={onDeleteHandle} variant={"destructive"}>
              Delete Records
            </Button>
          </div>
        ) : (
          <div className="flex w-full max-w-lg">
            <Input
              placeholder="Search..."
              onChange={(e) => setIsSearchValue?.(e.target.value)}
              className="h-9 border hover:border-blue-800 bg-transparent py-2 items-center w-[22rem] rounded-r-none"
            />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  className="border border-blue-800 bg-transparent rounded-none border-l-0 rounded-r-sm px-2 h-9"
                >
                  {open ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-4 z-50">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <GroupIcon size={18} />
                    <p className="font-semibold text-sm">Group By</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {["department", "job_position", "manager", "status"].map((filterKey) => {
                      const isSelected = selectedFilters?.includes(
                        filterKey as "department" | "manager" | "job_position" | "status"
                      );
                      const label = filterKey
                        .replace("_", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());
                      return (
                        <div
                          key={filterKey}
                          className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-all ${
                            isSelected ? "bg-emerald-100" : "hover:bg-gray-100"
                          }`}
                          onClick={() => !isLoading && toggleFilter(filterKey)}
                        >
                          {isSelected && <CheckIcon size={16} className="text-emerald-700" />}
                          <span className="text-sm">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Right: View Toggle + Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
        {/* View Toggle */}
        <div className="flex items-center gap-1 justify-center">
          <Button
            onClick={onOpenKanbanView}
            size={"sm"}
            className={`bg-gray-200 text-black rounded-none rounded-l-sm hover:bg-gray-300 ${title === "Attendance" && "hidden"}`}
            aria-label="Kanban View"
          >
            <SquareIcon />
          </Button>
          <Button
            onClick={onOpenListView}
            size={"sm"}
            className={`bg-gray-200 text-black rounded-none rounded-r-sm hover:bg-gray-300 ${title === "Attendance" && "rounded-l-sm"}`}
            aria-label="List View"
          >
            <Rows4Icon />
          </Button>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1">
          <p className="hidden lg:block pr-2 text-sm">
            Page {page} of {totalPages}
          </p>

          <Link href={`?${dynamicPath}/page=${Math.max(page - 1, 1)}&perPage=${perPage}`}>
            <Button
              variant={"secondary"}
              size={"sm"}
              disabled={page <= 1}
              aria-label="Previous Page"
            >
              <ChevronLeftIcon />
            </Button>
          </Link>

          <Link href={`?${dynamicPath}/page=${Math.min(page + 1, totalPages)}&perPage=${perPage}`}>
            <Button
              variant={"secondary"}
              size={"sm"}
              disabled={page >= totalPages}
              aria-label="Next Page"
            >
              <ChevronRightIcon />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
