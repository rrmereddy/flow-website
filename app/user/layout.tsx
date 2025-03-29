"use client"

import type React from "react"

import { useRoleProtection } from "@/lib/auth"
import { UserDriverLayout } from "@/components/layouts/user-driver-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  // Protect this route for users and drivers (drivers can also access user routes)
  const { loading } = useRoleProtection(["user", "driver"])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return <UserDriverLayout>{children}</UserDriverLayout>
}