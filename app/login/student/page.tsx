"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { setLocal } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function StudentLoginPage() {
  const r = useRouter()
  const [name, setName] = useState("")
  const [batch, setBatch] = useState("")
  const [roll, setRoll] = useState("")
  const [email, setEmail] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocal("ssa_student_profile", { name, batch, roll, email })
    r.push("/student")
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-pretty text-2xl font-semibold">Student Login</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="batch">Batch</Label>
          <Input id="batch" value={batch} onChange={(e) => setBatch(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="roll">Roll Number</Label>
          <Input id="roll" value={roll} onChange={(e) => setRoll(e.target.value)} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button className="hover:bg-blue-600 cursor-pointer" type="submit">Continue</Button>
          <Button className="hover:bg-slate-700" asChild variant="ghost">
            <Link href="/login">Back</Link>
          </Button>
        </div>
      </form>
    </main>
  )
}
