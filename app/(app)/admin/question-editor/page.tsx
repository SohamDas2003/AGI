"use client"

import { useEffect, useMemo, useState } from "react"
import { DEMO_QUESTIONS, SKILL_AREAS, type Question } from "@/lib/assessment"
import { getLocal, setLocal } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { FileText, ChevronLeft, CheckCircle } from "lucide-react"

type Meta = {
  course: string
  batch: string
  semester: string
  division: string
}

type Editable = Question & { meta: Meta }

const DEFAULT_META: Meta = { course: "BSc", batch: "2025", semester: "5", division: "A" }

export default function QuestionEditorPage() {
  const [items, setItems] = useState<Editable[]>(
    () =>
      getLocal("ssa_questions", DEMO_QUESTIONS).map((q) => ({
        ...q,
        meta: { ...DEFAULT_META },
      })) as Editable[],
  )
  const [filter, setFilter] = useState<Meta>({ course: "All", batch: "All", semester: "All", division: "All" } as Meta)
  const router = useRouter()
  const [currentIdx, setCurrentIdx] = useState(0)
  const currentArea = SKILL_AREAS[currentIdx]

  useEffect(() => {
    setLocal("ssa_questions", items)
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((q) => {
      return (
        (filter.course === "All" || q.meta.course === filter.course) &&
        (filter.batch === "All" || q.meta.batch === filter.batch) &&
        (filter.semester === "All" || q.meta.semester === filter.semester) &&
        (filter.division === "All" || q.meta.division === filter.division)
      )
    })
  }, [items, filter])

  const currentQuestions = useMemo(() => {
    return filtered.filter((q) => q.area === currentArea)
  }, [filtered, currentArea])

  function addNew() {
    const id = `q-${Date.now()}`
    setItems((s) => [
      ...s,
      {
        id,
        area: currentArea, // previously SKILL_AREAS[0]
        text: "New question...",
        options: [
          { label: "Strongly Disagree", value: 1 },
          { label: "Disagree", value: 2 },
          { label: "Neutral", value: 3 },
          { label: "Agree", value: 4 },
          { label: "Strongly Agree", value: 5 },
        ],
        meta: { ...DEFAULT_META },
      },
    ])
  }

  function update<K extends keyof Editable>(id: string, key: K, value: Editable[K]) {
    setItems((s) => s.map((q) => (q.id === id ? { ...q, [key]: value } : q)))
  }

  function remove(id: string) {
    setItems((s) => s.filter((q) => q.id !== id))
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-pretty text-2xl font-semibold">Question Editor</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button onClick={addNew}>Add Question</Button>
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {SKILL_AREAS.map((area, idx) => {
          const count = filtered.filter((q) => q.area === area).length
          const active = idx === currentIdx
          const hasAny = count > 0
          return (
            <Button
              key={area}
              variant={active ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setCurrentIdx(idx)}
            >
              {area}
              {hasAny && <CheckCircle className="ml-2 h-3 w-3" />}
              <Badge variant="secondary" className="ml-2">
                {count}
              </Badge>
            </Button>
          )
        })}
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          {/* Course */}
          <div className="grid gap-2">
            <Label className="capitalize">course</Label>
            <Select value={filter.course} onValueChange={(v) => setFilter((f) => ({ ...f, course: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["All", "MCA", "MMS", "PGDM", "BMS"].map((v) => (
                  <SelectItem key={`course-${v}`} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Batch */}
          <div className="grid gap-2">
            <Label className="capitalize">batch</Label>
            <Select value={filter.batch} onValueChange={(v) => setFilter((f) => ({ ...f, batch: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["All", "2023", "2024", "2025"].map((v) => (
                  <SelectItem key={`batch-${v}`} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester */}
          <div className="grid gap-2">
            <Label className="capitalize">semester</Label>
            <Select value={filter.semester} onValueChange={(v) => setFilter((f) => ({ ...f, semester: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["All", "1", "2", "3", "4", "5", "6", "7", "8"].map((v) => (
                  <SelectItem key={`semester-${v}`} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Division */}
          <div className="grid gap-2">
            <Label className="capitalize">division</Label>
            <Select value={filter.division} onValueChange={(v) => setFilter((f) => ({ ...f, division: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["All", "1", "2", "3", "4", "5"].map((v) => (
                  <SelectItem key={`division-${v}`} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4 bg-muted/30">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-1 font-medium">Editor Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Use the tabs above to switch skill areas</li>
              <li>• Filters refine the list by course, batch, semester, and division</li>
              <li>• Edit question text and option labels/values (1–5 scale)</li>
              <li>• Remove questions with Delete; changes save automatically</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {currentArea}
            <Badge variant="secondary">{currentQuestions.length} item(s)</Badge>
          </CardTitle>
          <CardDescription>Edit questions for the selected skill area</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {currentQuestions.map((q) => (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="text-base">{q.id}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Skill Area</Label>
                  <Select value={q.area} onValueChange={(v) => update(q.id, "area", v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_AREAS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Question</Label>
                  <Textarea value={q.text} onChange={(e) => update(q.id, "text", e.target.value as any)} />
                </div>
                <div className="grid gap-2 md:grid-cols-4">
                  {q.options.map((opt, i) => (
                    <div key={i} className="grid gap-2">
                      <Label>Option {i + 1} Label</Label>
                      <Input
                        value={opt.label}
                        onChange={(e) => {
                          const next = q.options.slice()
                          next[i] = { ...opt, label: e.target.value }
                          update(q.id, "options", next as any)
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid gap-2 md:grid-cols-4">
                  {q.options.map((opt, i) => (
                    <div key={i} className="grid gap-2">
                      <Label>Option {i + 1} Value (1-5)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        value={opt.value}
                        onChange={(e) => {
                          const next = q.options.slice()
                          next[i] = { ...opt, value: Number(e.target.value) }
                          update(q.id, "options", next as any)
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid gap-2 md:grid-cols-4">
                  {(["course", "batch", "semester", "division"] as const).map((k) => (
                    <div key={k} className="grid gap-2">
                      <Label className="capitalize">{k}</Label>
                      <Input
                        value={q.meta[k]}
                        onChange={(e) => update(q.id, "meta", { ...q.meta, [k]: e.target.value } as any)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button variant="destructive" onClick={() => remove(q.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!currentQuestions.length && (
            <p className="text-sm text-muted-foreground">No questions in this area match your filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
