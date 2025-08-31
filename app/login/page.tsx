import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-semibold text-balance">Login</h1>
        <p className="text-muted-foreground">Choose your portal to continue.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 justify-center">
          <Button asChild className="w-full hover:bg-blue-600 cursor-pointer">
            <Link href="/login/student">Student Portal</Link>
          </Button>
          <Button variant="secondary" asChild className="w-full hover:bg-red-600">
            <Link href="/login/admin">Admin Portal</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">These are placeholder links for now.</p>
      </div>
    </main>
  )
}
