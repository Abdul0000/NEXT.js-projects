
const EmployeeContractTabs = () => {
  return (
    <div className="pt-8 pb-20 h-full w-full flex flex-col">
        <div className="flex flex-col lg:flex-row w-[260px] lg:w-full">
            <p className="border border-gray-300 border-b-0 lg:border-r-0 text-sm p-2 pr-4 pl-4 cursor-pointer">
                Salary Information
            </p>
            <p className="border border-gray-300 border-b-0 text-sm p-2 pr-4 pl-4 cursor-pointer">
                Details
            </p>
        </div>
        <div className="p-2  border h-full">
            <p>Salary</p>
        </div>
    </div>
  )
}

export default EmployeeContractTabs