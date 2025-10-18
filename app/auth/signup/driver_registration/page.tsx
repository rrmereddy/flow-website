"use client"

import { auth, db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
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
import { Separator } from "@/components/ui/separator"
import { uploadImageAsync } from "@/lib/imageUpload"



export default function DriverRegistrationPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [currentStep, setCurrentStep] = useState(1)
    const [driverData, setDriverData] = useState<any>(null)
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
                        setDriverData(driverData)
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
            // TODO: Implement actual file upload to Firebase Storage
            // Upload images and get their download URLs
            const profilePictureURL = await uploadImageAsync(documents?.profilePicture || (null as unknown as File), `users/${user.uid}`, 'profilePicture');
            const licenseImageURL = await uploadImageAsync(documents?.license || (null as unknown as File), `drivers/${user.uid}/documents`);
            const vehicleRegistrationImageURL = await uploadImageAsync(documents?.vehicleRegistration || (null as unknown as File), `drivers/${user.uid}/documents`);
            // upload the profile picture to user doc
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                profilePictureURL: profilePictureURL,
            });

            // Update the driver's Firestore document
            const driverRef = doc(db, "drivers", user.uid);
            await updateDoc(driverRef, {
                licenseImageURL: licenseImageURL,
                vehicleRegistrationImageURL: vehicleRegistrationImageURL,
                "checklist.driverDocs": true,
            });
            
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
            await updateDoc(driverRef, {
                "checklist.vehicleDocs": true,
                vehicle: {
                    make: vehicleInfo.make,
                    model: vehicleInfo.model,
                    year: vehicleInfo.year,
                    color: vehicleInfo.color,
                    licensePlate: vehicleInfo.licensePlate
                }
            })
            
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
        try {
            // TODO: Implement actual Stripe Connect onboarding
            await setDoc(doc(db, "drivers", user.uid), {
                stripeSetupComplete: true,
                stripeAccountId: 'placeholder_account_id'
            }, { merge: true })
            
            toast.success("Stripe setup completed!")
            setCurrentStep(4)
        } catch (error) {
            toast.error("Failed to setup Stripe")
            console.error(error)
        }
    }

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
                    Upload your profile picture, driver's license, and vehicle registration
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
                        <FieldLabel>Driver's License</FieldLabel>
                        <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => e.target.files?.[0] && handleDocumentUpload('license', e.target.files[0])}
                        />
                        <FieldDescription>
                            Upload a clear photo or scan of your driver's license
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
                            We'll help you set up a Stripe Connect account to receive payments from riders.
                            This process includes identity verification and bank account setup.
                        </FieldDescription>
                    </Field>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">What you'll need:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Government-issued ID</li>
                            <li>• Bank account information</li>
                            <li>• Tax information (SSN or EIN)</li>
                            <li>• Business information (if applicable)</li>
                        </ul>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                        <Button onClick={setupStripe}>
                            {driverLoading ? "Setting up Stripe..." : "Start Stripe Setup"}
                        </Button>
                    </div>
                </FieldGroup>
            </CardContent>
        </Card>
    )

    const renderCompletionSection = () => (
        <Card>
            <CardHeader>
                <CardTitle>Registration Complete!</CardTitle>
                <CardDescription>
                    Your driver registration has been completed successfully
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Flow!</h3>
                    <p className="text-gray-600 mb-6">
                        Your driver account is now active. You can start accepting rides and earning money.
                    </p>
                    <Button onClick={() => router.push('/driver/dashboard')}>
                        Go to Driver Dashboard
                    </Button>
                </div>
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