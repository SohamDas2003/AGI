import type * as React from "react"

type AppPageShellProps = {
  title?: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export function AppPageShell({ title, description, actions, children }: AppPageShellProps) {
  return (
    <div className="w-full">
      {(title || description || actions) && (
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            {title ? (
              <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">{title}</h1>
            ) : null}
            {description ? <p className="text-sm text-muted-foreground text-pretty mt-1">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  )
}
