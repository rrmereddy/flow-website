"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Car } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { forgotPassword } = useAuth()
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
    
        try {
        await forgotPassword(email)
        toast.success("Password reset email sent", {
            description: "Please check your inbox for instructions to reset your password.",
        })
        } catch (error) {
        toast.error("Failed to send password reset email", {
            description: "Please check your email and try again.",
        })
        console.error("Forgot password error:", error)
        } finally {
        setIsLoading(false)
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1 flex-col justify-center items-center p-4 md:p-8">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-8">
                    <Car className="h-6 w-6" />
                    <span>Flow</span>
                </Link>
                <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold">Forgot Password</h1>
                        <p className="text-muted-foreground">Enter your email to reset your password</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required
                            />
                        </div>
                        <Button className="flex w-full mx-auto" type="submit" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Reset Email"}
                        </Button>
                    </form>     
                </div>
            </div>
        </div>
    )
}
