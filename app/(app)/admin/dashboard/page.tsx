"use client"
import { AdminFilterBar, type AdminFilters } from "@/components/admin/filter-bar"
import React from "react"

export default function AdminDashboardIndexPage() {
  const [filters, setFilters] = React.useState<AdminFilters>({
    course: "",
    batch: "",
    semester: "",
    division: "",
  })
  const handleFiltersChange = (partial: Partial<AdminFilters>) => setFilters((f) => ({ ...f, ...partial }))

  // const filteredSubmissions = React.useMemo(() => {
  //   return submissions.filter((row) => {
  //     const matchesCourse = !filters.course || row.course === filters.course
  //     const matchesBatch = !filters.batch || String(row.batch) === String(filters.batch)
  //     const matchesSem = !filters.semester || String(row.semester) === String(filters.semester)
  //     const matchesDiv = !filters.division || String(row.division) === String(filters.division)
  //     return matchesCourse && matchesBatch && matchesSem && matchesDiv
  //   })
  // }, [submissions, filters])

  return (
    <div className="space-y-4">
      {/* header, KPIs, etc */}
      <AdminFilterBar value={filters} onChange={handleFiltersChange} />
      {/* <DashboardCharts data={filteredSubmissions} /> */}
      {/* <SubmissionsTable rows={filteredSubmissions} /> */}
    </div>
  )
}
