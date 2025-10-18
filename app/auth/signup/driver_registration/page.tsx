"use client"

import { auth, db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { doc, getDoc } from "firebase/firestore"
import { toast } from "sonner"



export default function DriverRegistrationPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [driverData, setDriverData] = useState<any>(null)
    const [driverLoading, setDriverLoading] = useState(true)

    useEffect(() => {
        const fetchDriverData = async () => {
            console.log('user', user)
            if (user) {
                try {
                    const driverDoc = await getDoc(doc(db, "drivers", user.uid))
                    if (driverDoc.exists()) {
                        const driverData = driverDoc.data()
                        console.log('Driver data:', driverData)
                        setDriverData(driverData)
                    } else {
                        console.log("Driver document not found")
                    }
                } catch (error) {
                    console.error("Error fetching driver data:", error)
                }
            } else {
                console.log("User not found")
            }
            setDriverLoading(false)
        }
        fetchDriverData()
    }, [user]) // Added user dependency
    
    if (loading || driverLoading) {
        return <div>Loading...</div>
    }
    
    if (!user) {
        toast.error("User not found. Please log in to access this page.")
        router.push("/auth/login")
    }
    
    return (
        <div>
            <h1>{user?.emailAddress}</h1>
            <h2>{driverData?.firstName} {driverData?.lastName}</h2>
        </div>
    )
}
    