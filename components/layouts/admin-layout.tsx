"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Car, CreditCard, LogOut, Menu, MessageSquare, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: BarChart3,
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
      active: pathname === "/admin/users",
    },
    {
      href: "/admin/drivers",
      label: "Drivers",
      icon: Car,
      active: pathname === "/admin/drivers",
    },
    {
      href: "/admin/rides",
      label: "Rides",
      icon: Car,
      active: pathname === "/admin/rides",
    },
    {
      href: "/admin/payments",
      label: "Payments",
      icon: CreditCard,
      active: pathname === "/admin/payments",
    },
    {
      href: "/admin/messages",
      label: "Messages",
      icon: MessageSquare,
      active: pathname === "/admin/messages",
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:max-w-xs">
            <SheetHeader>
              <Link href="/" className="flex items-center gap-2 font-semibold md:flex">
                <Car className="h-6 w-6" />
                <SheetTitle>RideShare Admin</SheetTitle>
              </Link>
            </SheetHeader>
            <div className="flex h-full flex-col">
              <nav className="flex-1 overflow-auto py-2">
                <div className="grid gap-1 px-2">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                        route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-muted p-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {user?.firstName?.charAt(0) || "A"}
                    </div>
                  </div>
                  <div className="grid gap-0.5 text-sm">
                    <div className="font-medium">{user?.firstName + " " + user?.lastName || "Admin User"}</div>
                    <div className="text-xs text-muted-foreground">{user?.email || "admin@example.com"}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto" onClick={() => logout()}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Log out</span>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 md:ml-0 ml-auto">
          <Link href="/" className="flex items-center gap-2 font-semibold md:flex">
            <Car className="h-6 w-6" />
            <span className="hidden md:inline">RideShare Admin</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => logout()} className="hidden md:flex">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
          <div className="hidden items-center gap-2 md:flex">
            <div className="rounded-full bg-muted p-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user?.firstName?.charAt(0) || "A"}
              </div>
            </div>
            <div className="grid gap-0.5 text-sm">
              <div className="font-medium">{user?.firstName || "Admin User"}</div>
              <div className="text-xs text-muted-foreground">{user?.email || "admin@example.com"}</div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-1 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

