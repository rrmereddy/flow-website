"use client"

import Link from "next/link"
import { Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export default function NotFound() {
  const { user } = useAuth()
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="space-y-6">
          <Link href="/" className="flex items-center justify-center gap-2 text-lg font-semibold">
            <Car className="h-6 w-6" />
            <span>Flow</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p> 
          </div>
          <Link href="/auth/login">
            <Button>Return to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6">
        <Link href="/" className="flex items-center justify-center gap-2 text-lg font-semibold">
          <Car className="h-6 w-6" />
          <span>Flow</span>
        </Link>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        </div>
        <Link href={user?.role === "admin" ? "/admin/dashboard" : user?.role === "driver" ? "/driver/dashboard" : "/user/dashboard"}>
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

