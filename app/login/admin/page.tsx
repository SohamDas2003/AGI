"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function AdminLoginPage() {
  const r = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    r.push("/admin")
  }

  return (
    <main className="mx-auto max-w-md p-6">
  <h1 className="mb-6 text-pretty text-2xl font-semibold">Admin Login</h1>
  <form onSubmit={handleSubmit} className="grid gap-4">
    
    {/* Email Field */}
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    {/* Password Field */}
    <div className="grid gap-2">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    {/* Buttons */}
    <div className="flex items-center justify-between gap-2">
      <Button className="hover:bg-blue-600 cursor-pointer" type="submit">
        Continue
      </Button>
      <Button className="hover:bg-slate-700" asChild variant="ghost">
        <Link href="/login">Back</Link>
      </Button>
    </div>
  </form>
</main>

  )
}
