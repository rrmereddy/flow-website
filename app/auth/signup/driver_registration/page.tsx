"use client"

import { db, functions } from "@/lib/firebase"
import { useAuth } from "@/lib/auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { uploadImageAsync } from "@/lib/imageUpload"
import { httpsCallable } from "firebase/functions"
import { logger } from "@/lib/logger"
import Image from "next/image"


export default function DriverRegistrationPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [currentStep, setCurrentStep] = useState(1)
    const [driverLoading, setDriverLoading] = useState(false)
    
    // Document upload state
    const [documents, setDocuments] = useState({
        profilePicture: null as File | null,
        license: null as File | null,
        vehicleRegistration: null as File | null
    })
    
    // Vehicle info state
    const [vehicleInfo, setVehicleInfo] = useState({
        make: '',
        model: '',
        year: '',
        color: '',
        licensePlate: ''
    })
    
    // Stripe setup state
    const [stripeSetup, setStripeSetup] = useState({
        accountId: '',
        onboardingComplete: false
    })

    useEffect(() => {
        const fetchDriverData = async () => {
            if (user) {
                try {
                    const driverDoc = await getDoc(doc(db, "drivers", user.uid))
                    if (driverDoc.exists()) {
                        const driverData = driverDoc.data()
                        // Set current step based on completed sections
                        if (driverData.checklist.driverDocs) {
                            setCurrentStep(2)
                        }
                        if (driverData.checklist.vehicleDocs) {
                            setCurrentStep(3)
                        }
                        if (driverData.checklist.paymentInfo) {
                            setCurrentStep(4)
                        }
                    }
                } catch (error) {
                    console.error("Error fetching driver data:", error)
                }
            }
            setDriverLoading(false)
        }
        fetchDriverData()
    }, [user])

    // Listen for Stripe setup completion from other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'stripeSetupComplete') {
                try {
                    const stripeData = JSON.parse(e.newValue || '{}')
                    if (stripeData.success) {
                        setStripeSetup(prev => ({ 
                            ...prev, 
                            onboardingComplete: false,
                            accountId: stripeData.accountId
                        }))
                        setCurrentStep(4)
                        toast.success("Stripe account setup completed successfully!")
                        
                        // Clear the localStorage item after handling
                        localStorage.removeItem('stripeSetupComplete')
                    } else {
                        setStripeSetup(prev => ({ ...prev, onboardingComplete: false }))
                        toast.error("Stripe setup failed. Please try again.")
                        
                        // Clear the localStorage item after handling
                        localStorage.removeItem('stripeSetupComplete')
                    }
                } catch (error) {
                    console.error('Error parsing Stripe completion data:', error)
                }
            }
        }

        // Check for existing Stripe completion status on page load
        const checkExistingStripeStatus = () => {
            try {
                const stripeData = localStorage.getItem('stripeSetupComplete')
                if (stripeData) {
                    const parsedData = JSON.parse(stripeData)
                    if (parsedData.success) {
                        setStripeSetup(prev => ({ 
                            ...prev, 
                            onboardingComplete: false,
                            accountId: parsedData.accountId
                        }))
                        setCurrentStep(4)
                        toast.success("Stripe account setup completed successfully!")
                        
                        // Clear the localStorage item after handling
                        localStorage.removeItem('stripeSetupComplete')
                    }
                }
            } catch (error) {
                console.error('Error checking existing Stripe status:', error)
            }
        }

        // Check immediately and listen for changes
        checkExistingStripeStatus()
        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])
    
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }
    
    if (!user) {
        toast.error("User not found. Please log in to access this page.")
        router.push("/auth/login")
        return null
    }

    const handleDocumentUpload = (type: keyof typeof documents, file: File) => {
        setDocuments(prev => ({ ...prev, [type]: file }))
    }

    const handleVehicleInfoChange = (field: keyof typeof vehicleInfo, value: string) => {
        setVehicleInfo(prev => ({ ...prev, [field]: value }))
    }

    const saveDocumentsToDB = async () => {
        try {
            setDriverLoading(true)
            
            // Validate that all required documents are present
            if (!documents.profilePicture || !documents.license || !documents.vehicleRegistration) {
                toast.error("Please upload all required documents")
                return
            }
            
            // Upload images and get their download URLs
            const profilePictureURL = await uploadImageAsync(documents.profilePicture, `users/${user.uid}`, 'profilePicture');
            const licenseImageURL = await uploadImageAsync(documents.license, `drivers/${user.uid}/documents`);
            const vehicleRegistrationImageURL = await uploadImageAsync(documents.vehicleRegistration, `drivers/${user.uid}/documents`);
            // upload the profile picture to user doc
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                profilePictureURL: profilePictureURL,
            }, { merge: true });

            // Update the driver's Firestore document
            const driverRef = doc(db, "drivers", user.uid);
            await setDoc(driverRef, {
                licenseImageURL: licenseImageURL,
                vehicleRegistrationImageURL: vehicleRegistrationImageURL,
                "checklist.driverDocs": true,
            }, { merge: true });
            
            toast.success("Documents uploaded successfully!")
            setCurrentStep(2)
        } catch (error) {
            toast.error("Failed to upload documents")
            console.error(error)
        }
        finally {
            setDriverLoading(false)
        }
    }

    const saveVehicleInfoToDB = async () => {
        try {
            setDriverLoading(true)
            const driverRef = doc(db, "drivers", user.uid);
            await setDoc(driverRef, {
                "checklist.vehicleDocs": true,
                vehicle: {
                    make: vehicleInfo.make,
                    model: vehicleInfo.model,
                    year: vehicleInfo.year,
                    color: vehicleInfo.color,
                    licensePlate: vehicleInfo.licensePlate
                }
            }, { merge: true })
            
            toast.success("Vehicle information saved!")
            setCurrentStep(3)
        } catch (error) {
            toast.error("Failed to save vehicle information")
            console.error(error)
        }
        finally {
            setDriverLoading(false)
        }
    }

    const setupStripe = async () => {
		setDriverLoading(true);
		try {
            logger.info("Setting up Stripe...");
			const createStripeAccountLink = httpsCallable(
				functions,
				"createStripeAccountLink",
			);
			logger.info("Creating Stripe account link...");
			const result = await createStripeAccountLink({
				platform: 'web',
                environment: process.env.NEXT_PUBLIC_ENV
			});
			const { url } = result.data as { url: string };
			logger.info("Stripe account link:", url);
			if (url) {
				logger.info("Opening Stripe account link in new tab...");
				window.open(url, '_blank');
				// Update the UI to indicate Stripe setup is in progress
				setStripeSetup(prev => ({ ...prev, onboardingComplete: true }));
			} else {
				toast.error("Could not get a link from Stripe.");
			}
		} catch (error: unknown) {
			console.error("Error creating Stripe account link:", error);
			const errorMessage = (error as Error)?.message || "Could not connect to Stripe.";
			toast.error(errorMessage);
		} finally {
			setDriverLoading(false);
		}
	};

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step <= currentStep 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-600'
                        }`}>
                            {step}
                        </div>
                        {step < 4 && (
                            <div className={`w-16 h-1 mx-2 ${
                                step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )

    const renderDocumentsSection = () => (
        <Card>
            <CardHeader>
                <CardTitle>Step 1: Document Upload</CardTitle>
                <CardDescription>
                    Upload your profile picture, driver&apos;s license, and vehicle registration
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Profile Picture</FieldLabel>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleDocumentUpload('profilePicture', e.target.files[0])}
                        />
                        <FieldDescription>
                            Upload a clear photo of yourself
                        </FieldDescription>
                    </Field>
                    
                    <Field>
                        <FieldLabel>Driver&apos;s License</FieldLabel>
                        <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => e.target.files?.[0] && handleDocumentUpload('license', e.target.files[0])}
                        />
                        <FieldDescription>
                            Upload a clear photo or scan of your driver&apos;s license
                        </FieldDescription>
                    </Field>
                    
                    <Field>
                        <FieldLabel>Vehicle Registration</FieldLabel>
                        <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => e.target.files?.[0] && handleDocumentUpload('vehicleRegistration', e.target.files[0])}
                        />
                        <FieldDescription>
                            Upload your vehicle registration document
                        </FieldDescription>
                    </Field>
                    
                    <div className="flex justify-end mt-6">
                        <Button 
                            onClick={saveDocumentsToDB}
                            disabled={!documents.profilePicture || !documents.license || !documents.vehicleRegistration || driverLoading}
                        >
                            {driverLoading ? "Uploading Documents..." : "Upload Documents"}
                        </Button>
                    </div>
                </FieldGroup>
            </CardContent>
        </Card>
    )

    const renderVehicleInfoSection = () => (
        <Card>
            <CardHeader>
                <CardTitle>Step 2: Vehicle Information</CardTitle>
                <CardDescription>
                    Provide details about your vehicle
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel>Make</FieldLabel>
                            <Input
                                placeholder="Toyota"
                                value={vehicleInfo.make}
                                onChange={(e) => handleVehicleInfoChange('make', e.target.value)}
                            />
                        </Field>
                        
                        <Field>
                            <FieldLabel>Model</FieldLabel>
                            <Input
                                placeholder="Camry"
                                value={vehicleInfo.model}
                                onChange={(e) => handleVehicleInfoChange('model', e.target.value)}
                            />
                        </Field>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel>Year</FieldLabel>
                            <Select value={vehicleInfo.year} onValueChange={(value) => handleVehicleInfoChange('year', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 20 }, (_, i) => {
                                        const year = new Date().getFullYear() - i
                                        return (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </Field>
                        
                        <Field>
                            <FieldLabel>Color</FieldLabel>
                            <Input
                                placeholder="White"
                                value={vehicleInfo.color}
                                onChange={(e) => handleVehicleInfoChange('color', e.target.value)}
                            />
                        </Field>
                    </div>
                    
                    <Field>
                        <FieldLabel>License Plate</FieldLabel>
                        <Input
                            placeholder="ABC123"
                            value={vehicleInfo.licensePlate}
                            onChange={(e) => handleVehicleInfoChange('licensePlate', e.target.value)}
                        />
                    </Field>
                    
                    <div className="flex justify-end mt-6">
                        <Button 
                            onClick={saveVehicleInfoToDB}
                            disabled={!vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.year || !vehicleInfo.color || !vehicleInfo.licensePlate}
                        >
                            {driverLoading ? "Saving Vehicle Info..." : "Save Vehicle Info"}
                        </Button>
                    </div>
                </FieldGroup>
            </CardContent>
        </Card>
    )

    const renderStripeSection = () => (
        <Card>
            <CardHeader>
                <CardTitle>Step 3: Payment Setup</CardTitle>
                <CardDescription>
                    Set up your Stripe account to receive payments
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Stripe Account Setup</FieldLabel>
                        <FieldDescription>
                            We&apos;ll help you set up a Stripe Connect account to receive payments from riders.
                            This process includes identity verification and bank account setup.
                        </FieldDescription>
                    </Field>
                    
                    {stripeSetup.onboardingComplete && (
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                            <h4 className="font-medium text-green-900 mb-2">Setup in Progress</h4>
                            <p className="text-sm text-green-800">
                                Please complete the Stripe setup process in the opened window. Once finished, you&apos;ll be redirected back here.
                            </p>
                        </div>
                    )}
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">What you&apos;ll need:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Government-issued ID</li>
                            <li>• Bank account information</li>
                            <li>• Tax information (SSN or EIN)</li>
                            <li>• Business information (if applicable)</li>
                        </ul>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                        <Button 
                            onClick={setupStripe}
                            disabled={driverLoading || stripeSetup.onboardingComplete}
                        >
                            {driverLoading ? "Setting up Stripe..." : 
                             stripeSetup.onboardingComplete ? "Setup in Progress..." : 
                             "Start Stripe Setup"}
                        </Button>
                    </div>
                </FieldGroup>
            </CardContent>
        </Card>
    )

    const renderCompletionSection = () => (
        <Card>
            <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Registration Submitted!</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Your account is under review. Download the Flow app to track your application status.
                </p>
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                    <Image src="/Flow_QR.png" alt="Flow App QR Code" width={128} height={128} />
                </div>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>Home</Button>
            </CardContent>
        </Card>
    )
    
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Registration</h1>
                    <p className="text-gray-600">Complete your driver profile to start earning</p>
                </div>
                
                {renderStepIndicator()}
                
                <div className="space-y-6">
                    {currentStep === 1 && renderDocumentsSection()}
                    {currentStep === 2 && renderVehicleInfoSection()}
                    {currentStep === 3 && renderStripeSection()}
                    {currentStep === 4 && renderCompletionSection()}
                </div>
            </div>
        </div>
    )
}