"use client"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type AdminFilters = {
  course: string // e.g., "MCA"
  batch: string // e.g., "2023"
  semester: string // "1".."8"
  division: string // "1".."5"
}

type Props = {
  value: AdminFilters
  onChange: (partial: Partial<AdminFilters>) => void
  className?: string
}

const COURSE_OPTIONS = ["MCA", "MMS", "PGDM", "BMS"]
const BATCH_OPTIONS = ["2023", "2024", "2025", "2026", "2027"]
const SEMESTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"]
const DIVISION_OPTIONS = ["1", "2", "3", "4", "5"]

export function AdminFilterBar({ value, onChange, className }: Props) {
  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-foreground">Filters</h3>
        <p className="text-xs text-muted-foreground">
          Narrow down data by course, batch, semester, and division. Choose “All” to clear a filter.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Course */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="course">Course</Label>
          <Select value={value.course || "all"} onValueChange={(v) => onChange({ course: v === "all" ? "" : v })}>
            <SelectTrigger id="course" aria-label="Select course">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {COURSE_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Batch */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="batch">Batch</Label>
          <Select value={value.batch || "all"} onValueChange={(v) => onChange({ batch: v === "all" ? "" : v })}>
            <SelectTrigger id="batch" aria-label="Select batch">
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {BATCH_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Semester */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="semester">Semester</Label>
          <Select value={value.semester || "all"} onValueChange={(v) => onChange({ semester: v === "all" ? "" : v })}>
            <SelectTrigger id="semester" aria-label="Select semester">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {SEMESTER_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Division */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="division">Division</Label>
          <Select value={value.division || "all"} onValueChange={(v) => onChange({ division: v === "all" ? "" : v })}>
            <SelectTrigger id="division" aria-label="Select division">
              <SelectValue placeholder="Select division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {DIVISION_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
