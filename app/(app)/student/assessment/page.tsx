"use client"

import { useEffect, useMemo, useState } from "react"
import { DEMO_QUESTIONS, SKILL_AREAS } from "@/lib/assessment"
import { getLocal, setLocal } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { FileText, ChevronLeft, ChevronRight, Save, Send, CheckCircle } from "lucide-react"

export default function AssessmentPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, number>>(getLocal("ssa_student_answers", {}))

  // persist answers
  useEffect(() => {
    setLocal("ssa_student_answers", answers)
  }, [answers])

  // group questions by skill area
  const grouped = useMemo(() => {
    return SKILL_AREAS.map((area) => ({
      area,
      questions: DEMO_QUESTIONS.filter((q) => q.area === area),
    }))
  }, [])

  const [currentIdx, setCurrentIdx] = useState(0)
  const currentArea = grouped[currentIdx]

  const totalQuestions = DEMO_QUESTIONS.length
  const answeredQuestions = useMemo(() => {
    let count = 0
    for (const q of DEMO_QUESTIONS) {
      const v = (answers as Record<string, unknown>)[q.id]
      if (typeof v === "number" && v >= 1 && v <= 5) count++
    }
    return count
  }, [answers])

  const progress = useMemo(() => {
    const pct = (answeredQuestions / totalQuestions) * 100
    return Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0
  }, [answeredQuestions, totalQuestions])

  function submit() {
    setLocal("ssa_student_answers", answers)
    router.push("/student/results")
  }

  function saveProgress() {
    setLocal("ssa_student_answers", answers)
  }

  function goPrev() {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1)
  }

  function goNext() {
    if (currentIdx < grouped.length - 1) setCurrentIdx((i) => i + 1)
  }

  const isCategoryComplete = (() => {
    const qids = new Set(currentArea?.questions.map((q) => q.id))
    let count = 0
    qids.forEach(() => {})
    for (const q of currentArea?.questions ?? []) {
      if (typeof answers[q.id] === "number") count++
    }
    return count === (currentArea?.questions.length ?? 0)
  })()

  function makeToggleHandler(qid: string, rating: number) {
    return (e: any) => {
      const current = (answers as Record<string, number | undefined>)[qid]
      if (current === rating) {
        e.preventDefault()
        setAnswers((a) => {
          const copy = { ...a }
          delete copy[qid]
          return copy
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-pretty">Self-Assessment</h1>
        </div>
        <Button variant="outline" onClick={() => router.push("/student")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {answeredQuestions} of {totalQuestions} questions
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Category Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {grouped.map((g, idx) => {
          const catAnswered = g.questions.filter((q) => typeof answers[q.id] === "number").length
          const complete = catAnswered === g.questions.length
          const active = idx === currentIdx
          return (
            <Button
              key={g.area}
              variant={active ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setCurrentIdx(idx)}
            >
              {g.area}
              {complete && <CheckCircle className="ml-2 h-3 w-3" />}
            </Button>
          )
        })}
      </div>

      {/* Current Category Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {currentArea?.area}
            <Badge variant={isCategoryComplete ? "default" : "secondary"}>
              {currentArea?.questions.filter((q) => typeof answers[q.id] === "number").length} /{" "}
              {currentArea?.questions.length}
            </Badge>
          </CardTitle>
          <CardDescription>Rate each statement (1 = Strongly Disagree, 5 = Strongly Agree)</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentArea?.questions.map((q, idx) => {
            const value = answers[q.id]
            return (
              <div key={q.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1 min-w-fit">
                    {idx + 1}
                  </Badge>
                  <p className="text-sm leading-relaxed">{q.text}</p>
                </div>

                {/* Keep deselect-on-same-click behavior using onMouseDown guard */}
                <RadioGroup
                  value={typeof value === "number" ? String(value) : ""}
                  onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: Number(v) }))}
                  className="ml-8 flex gap-6"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div
                      key={rating}
                      className="flex items-center space-x-2"
                      onMouseDown={makeToggleHandler(q.id, rating)}
                    >
                      <RadioGroupItem
                        id={`${q.id}-${rating}`}
                        value={String(rating)}
                        onMouseDown={makeToggleHandler(q.id, rating)}
                      />
                      <Label
                        htmlFor={`${q.id}-${rating}`}
                        className="cursor-pointer text-sm"
                        onMouseDown={makeToggleHandler(q.id, rating)}
                      >
                        {rating}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="ml-8 flex justify-between text-xs text-muted-foreground">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Navigation and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={goPrev} disabled={currentIdx === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button variant="default" onClick={goNext} disabled={currentIdx === grouped.length - 1}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={saveProgress}>
            <Save className="mr-2 h-4 w-4" />
            Save Progress
          </Button>
          <Button onClick={submit}>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Using an inline icon from lucide-react would be Clock, but it is optional to keep imports minimal */}
            <div className="text-sm text-muted-foreground">
              <p className="mb-1 font-medium">Assessment Instructions:</p>
              <ul className="space-y-1 text-xs">
                <li>• Answer all questions honestly based on your current abilities</li>
                <li>• You can save your progress and return later</li>
                <li>• Navigate between categories using the tabs above</li>
                <li>• You can deselect an option by clicking it again</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
