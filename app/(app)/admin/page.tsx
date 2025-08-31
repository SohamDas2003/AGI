"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Row = {
  name: string
  email: string
  course: string
  batch: string
  semester: string
  division: string
  score: number
  date: string
}

const MOCK: Row[] = [
  {
    name: "Aisha Khan",
    email: "aisha@example.com",
    course: "BSc",
    batch: "2025",
    semester: "5",
    division: "A",
    score: 4.1,
    date: "2025-08-01",
  },
  {
    name: "Rohit Verma",
    email: "rohit@example.com",
    course: "BSc",
    batch: "2025",
    semester: "5",
    division: "B",
    score: 3.6,
    date: "2025-08-02",
  },
  {
    name: "Maya Patel",
    email: "maya@example.com",
    course: "BCA",
    batch: "2024",
    semester: "6",
    division: "A",
    score: 4.5,
    date: "2025-08-03",
  },
]

const COURSES = ["All", "MCA", "MMS", "PGDM", "BMS"]
const BATCHES = ["All", "2023", "2024", "2025"]
const SEMS = ["All", "1", "2", "3", "4", "5", "6", "7", "8"]
const DIVS = ["All", "1", "2", "3", "4", "5"]

export default function AdminDashboardPage() {
  const [course, setCourse] = useState("All")
  const [batch, setBatch] = useState("All")
  const [semester, setSemester] = useState("All")
  const [division, setDivision] = useState("All")
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    return MOCK.filter((r) => {
      return (
        (course === "All" || r.course === course) &&
        (batch === "All" || r.batch === batch) &&
        (semester === "All" || r.semester === semester) &&
        (division === "All" || r.division === division) &&
        (!q || r.name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase()))
      )
    })
  }, [course, batch, semester, division, q])

  function exportCSV() {
    const headers = Object.keys(MOCK[0]) as (keyof Row)[]
    const rows = [headers.join(",")].concat(filtered.map((r) => headers.map((h) => r[h]).join(",")))
    const blob = new Blob([rows.join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "assessments.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportPDF() {
    window.print()
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-4 text-pretty text-2xl font-semibold">Admin Dashboard</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-5">
          <div className="grid gap-2">
            <Label>Course</Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Batch</Label>
            <Select value={batch} onValueChange={setBatch}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BATCHES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Semester</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEMS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Division</Label>
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIVS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 md:col-span-1">
            <Label>Search</Label>
            <Input placeholder="name or email..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Assessments</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={exportCSV}>
              Export CSV
            </Button>
            <Button size="sm" variant="outline" onClick={exportPDF}>
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground">
              <div>Name</div>
              <div>Email</div>
              <div>Course</div>
              <div>Batch</div>
              <div>Sem</div>
              <div>Div</div>
              <div>Score</div>
            </div>
            {filtered.map((r) => (
              <div key={r.email} className="grid grid-cols-7 gap-2 rounded border p-2 text-sm">
                <div>{r.name}</div>
                <div className="truncate">{r.email}</div>
                <div>{r.course}</div>
                <div>{r.batch}</div>
                <div>{r.semester}</div>
                <div>{r.division}</div>
                <div>{r.score.toFixed(2)}</div>
              </div>
            ))}
            {!filtered.length && <p className="py-4 text-sm text-muted-foreground">No results found.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
