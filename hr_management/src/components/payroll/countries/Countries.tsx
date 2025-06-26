"use client"
import HeaderBottom from "@/components/home/HeaderBottom"
import { trpc } from "@/trpc/client"
import { useSearchParams } from "next/navigation"
// import { useState } from "react"
import CountryListView from "./CountryListView"

const Countries = () => {
    // const [isOpenView, setIsOpenView] = useState(false)
    const searchParams = useSearchParams()
    let page = Number(searchParams.get("/countries/page"))
    let perPage = Number(searchParams.get("/countries/perPage"))
    if(page < 1) page=1 ;
    if(perPage < 1) perPage=9;
    
    const result = trpc.settings.getAllCountriesPage.useSuspenseQuery({page, perPage})
    if (typeof result[0] === "string") {
        console.error("Failed to fetch countries:", result[0])
        return <div>Error fetching countries</div>
    }
    const { countries, totalPages } = result[0]
    // console.log("countries",countre)
    // const salaryStructureMerged = salaryStructurePage.map((item)=>({
    //   ...item.salaryStructures,
    //   country_name: item.country_name ?? "",
    // }))
  return (
    <div className="flex flex-col w-full">
        <HeaderBottom setSelectedIds={()=> {}} selectedIds={[]} page={page} perPage={perPage} totalPages={totalPages} title="Countries" />
        <CountryListView
            selectedFilters={[]}
            data={countries.filter(
                (c) =>
                    !!c.id && !!c.country_name && !!c.country_code && !!c.currency
            )}
        />
    </div>
  )
}

export default Countries