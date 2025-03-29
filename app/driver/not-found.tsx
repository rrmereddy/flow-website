"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRoleProtection } from "@/lib/auth"

export default function NotFound() {
  // Protect this route for driver only
  const { loading } = useRoleProtection(["driver"])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center p-4 text-center h-[calc(100vh-4rem)]">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">Driver Page Not Found</h2>
            <p className="text-muted-foreground">The driver page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          </div>
          <Link href="/driver/dashboard">
            <Button>Return to Driver Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
