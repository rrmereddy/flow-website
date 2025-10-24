"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function StripeRefreshPage() {
    const router = useRouter()

    useEffect(() => {
        toast.error("Your Stripe setup link has expired. Please try again.")
    }, [])

    const handleRetry = () => {
        router.push('/auth/signup/driver_registration')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Link Expired</CardTitle>
                    <CardDescription className="text-center">
                        Your Stripe setup link has expired. This can happen if you've been away from the setup process for too long.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleRetry} className="w-full">
                        Start Setup Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
