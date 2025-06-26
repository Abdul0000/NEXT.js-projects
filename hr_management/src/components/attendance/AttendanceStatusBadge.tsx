"use client"

import { Button } from "../ui/button";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface ContractStatusBadgeProps {
  status: string;
  contract_id: string;
}

// Define styles per status
const statusStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
  Approved: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
  Refused: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
  canceled: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
};

const statuses = ["Approved","Refused"];

const AttendanceStatusBadge = ({ status, contract_id }: ContractStatusBadgeProps) => {
  const utils = trpc.useUtils();

  const updateStatus = trpc.employeeContracts.updateEmployeeContractStatus.useMutation({
    onSuccess: () => {
      toast.success(`Employee contract updated successfully!`);
      utils.employeeContracts.getOneContract.invalidate({ id:contract_id });
      utils.employeeContracts.getAllContracts.invalidate();
    },
    onError: (error) => {
      console.error("Error updating employee contract", error);
      toast.error("Failed to update contract status.");
    },
  });

  const onStatusChange = (value: string) => {
    updateStatus.mutate({ status: value, id:contract_id });
  };

  return (
    <div className="w-full sm:w-auto flex flex-wrap justify-center sm:justify-end gap-1 px-4 sm:px-0">
      {statuses.map((item) => {
        const lower = item.toLowerCase();
        const isActive = status === lower;
        const commonClasses = `font-semibold rounded-none transition-all`;
        const sizeClasses = `text-xs sm:text-sm px-2 sm:px-6 py-1`;
        const dynamicStyle = isActive
          ? statusStyles[lower] || "bg-gray-100 text-gray-800 border-gray-300"
          : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-200";

        return (
          <Button
            key={item}
            className={`${commonClasses} ${sizeClasses} ${dynamicStyle}`}
            onClick={() => onStatusChange(lower)}
          >
            {item}
          </Button>
        );
      })}
    </div>
  );
};

export default AttendanceStatusBadge;
