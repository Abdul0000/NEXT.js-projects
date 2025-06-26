"use client";

import { trpc } from "@/trpc/client";
import ListView from "./ListView";
import Loading from "../Loading";
import { Suspense, useState } from "react";
import HeaderBottom from "../home/HeaderBottom";
import { ErrorBoundary } from "react-error-boundary";
import ContractKanban from "./ContractKanban";
import GroupedKanban from "./GroupedKanban";
import { useSearchParams } from "next/navigation";
// import { useSuspenseQuery } from "@tanstack/react-query";

const EmployeeContracts = () => {
  const [isOpenView, setIsOpenView] = useState(false);
  const [isSearchValue, setIsSearchValue] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<
    Array<"job_position" | "manager" | "department" | "status">
  >([]);
  
  const searchParams = useSearchParams();
  
  let page = Number(searchParams.get("/contracts/page")) || 1;
  let perPage = Number(searchParams.get("/contracts/perPage")) || 8;

  if (page < 1) page = 1;
  if (perPage < 1) perPage = 8;
  const [{getAllContracts, totalPages}] = trpc.employeeContracts.getAllContracts.useSuspenseQuery({page, perPage});
  const employee_contracts = getAllContracts.map((item)=>({
    ...item.employeeContracts,
    employee_name: item.employee_name,
    department_name: item.department_name,
  }) )

  const filteredContracts = employee_contracts?.filter((contract) =>
    contract.employee_name
      ?.toLowerCase()
      .includes(isSearchValue.toLowerCase())
  );
  const data = filteredContracts?.length ? filteredContracts : employee_contracts;

  const { data: filterData, isLoading } =
    trpc.employeeContracts.filterByGroupContract.useQuery(
      {
        filter_list: selectedFilters,
      },
      {
        enabled: selectedFilters.length > 0,
      }
    );

  if (!data || isLoading) return <Loading />;

  return (
    <>
      <HeaderBottom
        setIsOpenView={setIsOpenView}
        setIsSearchValue={setIsSearchValue}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
        setSelectedIds={() => {}}
        selectedIds={[]}
        isLoading={false}
        title="Employee Contracts"
        perPage={perPage}
        page={page}
        totalPages={totalPages}
      />

      <Suspense
        fallback={<Loading />}
      >
        <ErrorBoundary
          fallback={
            <p className="text-center text-red-500 mt-4">
              Something went wrong.
            </p>
          }
        >
          <div className="w-full flex flex-col">
            {isOpenView ? (
              // KANBAN VIEW
              !filterData && !isLoading ? (
                data ? (
                  <div className="p-4 w-full overflow-auto max-h-[70vh] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((contract) => (
                      <ContractKanban
                        key={contract.id}
                        data={{
                          ...contract,
                          createdAt: contract.createdAt ? new Date(contract.createdAt) : new Date(),
                          updatedAt: contract.updatedAt ? new Date(contract.updatedAt) : new Date(),
                          employee_name: contract.employee_name || "",
                          department_name: contract.department_name || "",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Loading />
                )
              ) : isLoading ? (
                <Loading />
              ) : (
                <div className="flex sm:flex-row overflow-auto sm:max-h-[80vh] max-h-[60vh] flex-col gap-4">
                  <GroupedKanban
                    data={
                      filterData
                        ? filterData.map((group) => ({
                            ...group,
                            employees: group.employees?.map((emp) => ({
                              ...emp,
                              createdAt: emp.createdAt ? new Date(emp.createdAt) : undefined,
                              updatedAt: emp.updatedAt ? new Date(emp.updatedAt) : undefined,
                            })),
                          }))
                        : []
                    }
                  />
                </div>
              )
            ) : (
              // LIST VIEW
              <div className="w-full overflow-auto">
                <ListView
                  data=
                  {data.map((emp) => ({
                    ...emp,
                    department_name: emp.department_name || "",
                    employee_name: emp.employee_name || "",
                    createdAt: emp.createdAt ? new Date(emp.createdAt) : new Date(),
                    updatedAt: emp.updatedAt ? new Date(emp.updatedAt) : new Date(),
                  }))}
                  selectedFilters={selectedFilters}
                />
              </div>
            )}
          </div>
        </ErrorBoundary>
      </Suspense>
    </>
  );
};

export default EmployeeContracts;
