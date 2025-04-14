"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth, type UserRole } from "@/lib/auth"
import { ShineBorder } from "@/components/magicui/shine-border";
import { motion } from "framer-motion";
import Image from "next/image";
import ErrorToast from "@/components/error-toast";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<UserRole>("user")
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const { signup } = useAuth()

  useEffect(() => {
    // Set the role from URL query parameter if available
    const roleParam = searchParams.get("role")
    if (roleParam && (roleParam === "user" || roleParam === "driver")) {
      setRole(roleParam as UserRole)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      ErrorToast("passwords/do-not-match")
      return
    }

    setIsLoading(true)
    try {
      await signup(email, password, firstName, lastName, role)
      // Redirection will happen in the signup function
    } catch (error) {
      ErrorToast(error);
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col justify-center items-center p-4 md:p-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="flex items-center gap-2 py-5 text-3xl font-bold">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Image src="/logo.png" width={30} height={30} alt="Logo Picture" />
              </motion.div>
              <motion.span
                  className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Flow
              </motion.span>
            </Link>
          </motion.div>

          <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg relative overflow-hidden">
            {/* Position ShineBorder within the card container */}
            <ShineBorder
                shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                borderWidth={2}
                duration={10}
            />

            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Sign Up</h1>
              <p className="text-muted-foreground">Create an account to get started</p>
            </div>

            <Tabs
                defaultValue="user"
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
                className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">Rider</TabsTrigger>
                <TabsTrigger value="driver">Driver</TabsTrigger>
              </TabsList>
              <TabsContent value="user">
                <p className="text-sm text-muted-foreground mb-4">
                  Sign up as a rider to book rides and travel
                </p>
              </TabsContent>
              <TabsContent value="driver">
                <p className="text-sm text-muted-foreground mb-4">
                <span className="block mt-1 font-medium text-amber-600">
                  Note: You&apos;ll need to complete additional verification steps after registration
                </span>
                </p>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
  )
}