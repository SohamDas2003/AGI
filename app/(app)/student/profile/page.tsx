"use client"

import { getLocal } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const profile = getLocal("ssa_student_profile", {
    name: "Student",
    email: "",
    batch: "",
    roll: "",
  })

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-pretty text-2xl font-semibold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Name</span>
            <span>{profile.name || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{profile.email || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Batch</span>
            <span>{profile.batch || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Roll No.</span>
            <span>{profile.roll || "—"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
