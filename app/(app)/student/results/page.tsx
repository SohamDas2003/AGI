"use client"

import { computeAreaAverages, DEMO_QUESTIONS } from "@/lib/assessment"
import { getLocal } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillBars, SkillRadar } from "@/components/charts/skill-charts"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ResultsPage() {
  const answers = getLocal("ssa_student_answers", {} as Record<string, number>)
  const hasAnswers = DEMO_QUESTIONS.some((q) => {
    const v = answers[q.id]
    return typeof v === "number" && v >= 1 && v <= 5
  })
  const data = hasAnswers ? computeAreaAverages(answers) : []

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-4 text-pretty text-2xl font-semibold">Results</h1>

      {hasAnswers ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Overall Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillRadar data={data} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skill Averages</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillBars data={data} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No results yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You haven’t submitted any answers yet. Complete the self assessment to see your results.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/student/assessment">Start Self Assessment</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
