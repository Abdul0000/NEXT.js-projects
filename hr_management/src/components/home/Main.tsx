"use client";

import { Suspense, useState } from "react";
import { trpc } from "@/trpc/client";
import { useSearchParams } from "next/navigation";
import HeaderBottom from "./HeaderBottom";
import Kanban from "./Kanban";
import GroupedKanban from "./GroupedKanban";
import ListView from "./ListView";
import Loading from "../Loading";
import { ErrorBoundary } from "react-error-boundary";

const Main = () => {
  const searchParams = useSearchParams();
  const [isOpenView, setIsOpenView] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<
    ("job_position" | "manager" | "department" | "status")[]
  >([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  // Parse pagination params from URL or default
  let page = Number(searchParams.get("/employees/page")) || 1;
  let perPage = Number(searchParams.get("/employees/perPage")) || 8;

  if (page < 1) page = 1;
  if (perPage < 1) perPage = 8;
 
  // Fetch employees data using TRPC query with suspense
  const [{ employees, totalPages }] = trpc.getEmployees.getAllEmployees.useSuspenseQuery({
    page,
    perPage,
  });

  const mergeData = employees.map((item) => ({
    ...item.newEmployees,
    department_name: item.department_name,
  }));

  // Filter by search input client-side
  const filteredSearch = mergeData?.filter((emp) =>
    emp.employee_name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Data to display
  const data = filteredSearch ?? mergeData;

  // Filtering by groups (server query)
  const { data: filteredData, isLoading } = trpc.getEmployees.filterByGroup.useQuery(
    { filter_list: selectedFilters ?? [] },
    { enabled: selectedFilters.length > 0 }
  );
  const filterData = filteredData ?? null;
  const filter = filteredData ? "filter" : "";

  return (
    <>
      <HeaderBottom
        setIsOpenView={setIsOpenView}
        setIsSearchValue={setSearchValue}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
        setSelectedIds={setSelectedIds}
        selectedIds={selectedIds}
        isLoading={isLoading}
        title="Employees"
        perPage={perPage}
        page={page}
        totalPages={totalPages}
      />

      <Suspense fallback={<Loading />}>
        <ErrorBoundary fallback={<p className="text-center text-red-500 mt-4">Error loading employees.</p>}>
          <div className="flex flex-col gap-y-4 lg:flex-row overflow-hidden">
            <div className="w-full flex flex-col">
              {isOpenView ? (
                !filterData && !isLoading ? (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto sm:max-h-[80vh] max-h-[60vh]">
                    {data?.map((emp) => (
                      <Kanban
                        key={emp.id}
                        id={emp.id}
                        employee_name={emp.employee_name}
                        job_title={emp.job_title ?? ""}
                        work_email={emp.work_email ?? ""}
                        work_mobile={emp.work_mobile}
                        image_url={emp.image_url ?? "/no_image.JPG"}
                      />
                    ))}
                  </div>
                ) : isLoading ? (
                  <Loading />
                ) : (
                  <div className="flex overflow-auto sm:flex-row sm:max-h-[80vh] max-h-[60vh] flex-col gap-4">
                    <GroupedKanban
                      data={filterData?.map((group) => ({
                        group: group.group,
                        employees: group.employees,
                      }))}
                    />
                  </div>
                )
              ) : (
                <div className=" overflow-auto">
                  <ListView
                    filter={filter}
                    setSelectedIds={setSelectedIds}
                    selectedIds={selectedIds}
                    data={
                      filterData
                        ? filterData.map((group) => ({
                            group: group.group,
                            employees: group.employees,
                          }))
                        : data?.map((emp) => ({
                            ...emp,
                            department_name: emp.department_name!,
                          }))
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </ErrorBoundary>
      </Suspense>
    </>
  );
};

export default Main;
