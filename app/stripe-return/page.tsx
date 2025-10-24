"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth"
import { logger } from "@/lib/logger"
import { httpsCallable } from "firebase/functions"
import { functions } from "@/lib/firebase"

export default function StripeReturnPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

    useEffect(() => {
        const handleStripeReturn = async () => {
            try {
                // Check URL parameters to determine the result
                const urlParams = new URLSearchParams(window.location.search)
                logger.info("URL parameters:", urlParams)
                const accountId = urlParams.get('account')
                
                if (accountId && user) {
                    // Verify the Stripe account status before marking as complete
                    try {
                        const verifyStripeAccount = httpsCallable(functions, 'verifyStripeAccountStatus')
                        const result = await verifyStripeAccount({ accountId })
                        
                        if ((result.data as { success: boolean }).success) {
                            // Account is properly set up - update Firestore and mark as complete
                            const driverRef = doc(db, "drivers", user.uid)
                            await updateDoc(driverRef, {
                                "checklist.paymentInfo": true,
                                stripeAccountId: accountId
                            })
                            
                            // Store completion status in localStorage to communicate with the original tab
                            localStorage.setItem('stripeSetupComplete', JSON.stringify({
                                success: true,
                                accountId: accountId,
                                timestamp: Date.now()
                            }))
                            
                            setStatus('success')
                            toast.success("Stripe account setup completed successfully!")
                            
                            // Close this tab and return to the original tab
                            setTimeout(() => {
                                window.close()
                                // If window.close() doesn't work (some browsers block it), redirect to the original page
                                window.location.href = '/auth/signup/driver_registration'
                            }, 2000)
                        } else {
                            // Account exists but is not properly set up
                            localStorage.setItem('stripeSetupComplete', JSON.stringify({
                                success: false,
                                error: 'Stripe account setup incomplete - please complete all required steps',
                                timestamp: Date.now()
                            }))
                            
                            setStatus('error')
                            toast.error("Stripe account setup is incomplete. Please complete all required steps.")
                        }
                    } catch (verifyError) {
                        console.error('Error verifying Stripe account:', verifyError)
                        localStorage.setItem('stripeSetupComplete', JSON.stringify({
                            success: false,
                            error: 'Failed to verify Stripe account status',
                            timestamp: Date.now()
                        }))
                        
                        setStatus('error')
                        toast.error("There was an issue verifying your Stripe setup")
                    }
                } else {
                    // No account ID in URL params - user didn't complete the setup
                    localStorage.setItem('stripeSetupComplete', JSON.stringify({
                        success: false,
                        error: 'No account ID found - setup may be incomplete',
                        timestamp: Date.now()
                    }))
                    
                    setStatus('error')
                    toast.error("Stripe setup appears to be incomplete. Please try again.")
                }
            } catch (error: unknown) {
                console.error('Error handling Stripe return:', error)
                localStorage.setItem('stripeSetupComplete', JSON.stringify({
                    success: false,
                    error: (error as Error)?.message || 'Unknown error',
                    timestamp: Date.now()
                }))
                setStatus('error')
                toast.error("There was an issue with your Stripe setup")
            }
        }

        handleStripeReturn()
    }, [user])

    const handleContinue = () => {
        router.push('/auth/signup/driver_registration')
    }

    const handleGoToDashboard = () => {
        router.push('/driver/dashboard')
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p>Processing your Stripe setup...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">
                        {status === 'success' ? 'Setup Complete!' : 'Setup Incomplete'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {status === 'success' 
                            ? 'Your Stripe account has been successfully set up. You can now receive payments from riders.'
                            : 'There was an issue completing your Stripe setup. Please try again.'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status === 'success' ? (
                        <div className="flex flex-col space-y-2">
                            <Button onClick={handleGoToDashboard} className="w-full">
                                Go to Driver Dashboard
                            </Button>
                            <Button variant="outline" onClick={handleContinue} className="w-full">
                                Continue Registration
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleContinue} className="w-full">
                            Try Again
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
