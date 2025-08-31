import type React from "react"
import { AppSidebar, AppTopNav } from "@/components/app-sidebar"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const items = [
    { href: "/student", label: "Home" },
    { href: "/student/assessment", label: "Self Assessment" },
    { href: "/student/results", label: "Results" },
    { href: "/student/profile", label: "Profile" },
  ]
  return (
    <div className="flex h-[100dvh] bg-background">
      <AppSidebar title="Student" items={items} />
      <div className="flex-1 h-[100dvh] overflow-y-auto">
        <AppTopNav items={items} />
        <main className="px-4 md:px-6">
          <div className="mx-auto max-w-6xl py-6 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
