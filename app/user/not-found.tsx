"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRoleProtection } from "@/lib/auth"

export default function NotFound() {
  // Protect this route for user only
  const { loading } = useRoleProtection(["user"])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center p-4 text-center h-[calc(100vh-4rem)]">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          </div>
          <Link href="/user/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 