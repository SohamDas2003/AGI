"use client"

import Link from "next/link"
import { getLocal } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function StudentHomePage() {
  const profile = getLocal("ssa_student_profile", {
    name: "Student",
    email: "",
    batch: "",
    roll: "",
  })
  const answers = getLocal("ssa_student_answers", {} as Record<string, number>)
  const lastDate = Object.keys(answers).length ? new Date().toLocaleDateString() : "—"
  const progress = Object.keys(answers).length ? "In Progress / Completed" : "Not started"
  const answeredCount = Object.keys(answers).length

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Welcome banner */}
      <div className="rounded-lg border bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
        <h1 className="text-balance text-2xl font-semibold">Welcome back, {profile.name}!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Continue your assessment journey, track progress, and review results.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Last Assessment</CardTitle>
          </CardHeader>
          <CardContent className="text-lg">{lastDate}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent className="text-lg">{progress}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Questions Answered</CardTitle>
          </CardHeader>
          <CardContent className="text-lg">{answeredCount} / 10</CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Start New Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/student/assessment" className="block">
              <Button className="w-full">Begin Assessment</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">View Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/student/results" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                View Results
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
