"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LogOut } from "lucide-react"

type Item = { href: string; label: string }

export function AppSidebar({ title, items }: { title: string; items: Item[] }) {
  const pathname = usePathname()
  return (
    <aside
      className="hidden md:flex md:sticky md:top-0 w-64 shrink-0 border-r bg-card p-4 h-[100dvh] flex-col"
      aria-label={`${title} navigation`}
    >
      <h2 className="mb-4 text-sm font-medium text-muted-foreground">{title}</h2>
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {items.map((it) => {
          const active = pathname === it.href
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "rounded px-3 py-2 text-sm",
                active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
              )}
            >
              {it.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4">
        <Link
          href="/"
          aria-label="Log out and go to homepage"
          className={cn(
            "group inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
            "bg-muted/50 text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  )
}

export function AppTopNav({ items }: { items: Item[] }) {
  const pathname = usePathname()
  return (
    <nav className="md:hidden sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 overflow-x-auto px-3 py-2">
        {items.map((it) => {
          const active = pathname === it.href
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "whitespace-nowrap rounded px-3 py-1.5 text-sm",
                active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
              )}
            >
              {it.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
