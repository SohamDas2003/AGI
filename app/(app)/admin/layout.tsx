import type React from "react"
import { AppSidebar, AppTopNav } from "@/components/app-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const items = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/question-editor", label: "Question Editor" },
  ]
  return (
    <div className="flex h-[100dvh] bg-background">
      <AppSidebar title="Admin" items={items} />
      <div className="flex-1 h-[100dvh] overflow-y-auto">
        <AppTopNav items={items} />
        <main className="px-4 md:px-6">
          <div className="mx-auto max-w-6xl py-6 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
