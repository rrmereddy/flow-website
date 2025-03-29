"use client"

import type React from "react"

import { useRoleProtection } from "@/lib/auth"
import { AdminLayout } from "@/components/layouts/admin-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  // Protect this route for admin only
  const { loading } = useRoleProtection(["admin"])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return <AdminLayout>{children}</AdminLayout>
}

