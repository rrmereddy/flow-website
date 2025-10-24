"use client"

import type React from "react"

import { useEffect, useState, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, collection, getDocs, where, query, writeBatch } from "firebase/firestore"
import { auth, db } from "./firebase"
import { toast } from "sonner"
import { logger } from "./logger"
import { AuthContextType, User, UserRole, SignupUser } from "@/types/authTypes"


const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()
            const userRole = userData.role as UserRole
            
            // Update accountStatus to "verified" for all users if it's currently "awaiting verification"
            if (userRole === "user" && userData.accountStatus === "awaiting verification" && firebaseUser.emailVerified) {
              await updateDoc(doc(db, "users", firebaseUser.uid), {
                accountStatus: "verified",
                emailVerifiedAt: serverTimestamp()
              })
              logger.log("User email verified - updated account status")
            }
            if (userRole === "driver" && userData.accountStatus === "awaiting verification" && firebaseUser.emailVerified) {
                const userRef = doc(db, "users", firebaseUser.uid)
                const driverRef = doc(db, "drivers", firebaseUser.uid)
                const batch = writeBatch(db)
                // Keep users and drivers in sync
                batch.update(userRef, { accountStatus: "verified", emailVerifiedAt: serverTimestamp() })
                batch.set(
                  driverRef,
                  { checklist: { emailVerified: true }, accountStatus: "verified", emailVerifiedAt: serverTimestamp() },
                  { merge: true },
                )
                await batch.commit()
                logger.log("Driver email verified — updated user/drivers status and checklist")
            }
            
            setUser({
              uid: firebaseUser.uid,
              emailAddress: firebaseUser.email || "",
              firstName: userData.firstName || null,
              lastName: userData.lastName || null,
              role: userRole,
            })
          } else {
            toast.error("User not found")
          }
        } catch (error) {
          logger.error("Error fetching user data:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])  // Removed router dependency

  const signup = async (email: string, password: string, firstName: string, lastName: string, role: UserRole, referralCode?: string) => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      logger.log("Firebase user:", firebaseUser)
      try {
        if (role === "user" || role === "admin" || role === "driver") {
          const userData: SignupUser = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            emailAddress: email.toLowerCase().trim(),
            accountStatus: "awaiting verification",
            paymentMethods: [],
            phoneNumber: "",
            profilePictureURL: "",
            createdAt: serverTimestamp(),
            role: role,
          };
          logger.log("User data:", userData)
          // Add referral code if provided and user is a regular user
          if (referralCode && referralCode.trim() && role === "user") {
            const processedReferralCode = referralCode.trim().toLowerCase();
            if (await validateReferralCode(processedReferralCode)) {
              userData.referralCode = processedReferralCode;
            } else {
              toast.error("Invalid referral code")
              throw new Error("Invalid referral code")
            }
          }
          logger.log("User data with referral code:", userData)
          await setDoc(doc(db, "users", firebaseUser.uid), userData);
        } else {
          toast.error("Invalid role selected")
          throw new Error("Invalid role selected")
        }

        // save driver data
        if (role === "driver") {
          // Create driver doc with default/empty values for docs and vehicle
          await setDoc(doc(db, "drivers", firebaseUser.uid), {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            emailAddress: email.toLowerCase().trim(),
            accountStatus: "awaiting verification",
            paymentMethods: [],
            phoneNumber: "",
            profilePictureURL: "",
            createdAt: serverTimestamp(),
            driverStatus: "offline",
            lastOnlineAt: serverTimestamp(),
            lastLocation: { latitude: 0, longitude: 0 },
            checklist: {
                accountInfo: true,
                emailVerified: false,
                driverDocs: false,
                vehicleDocs: false,
                paymentInfo: false,
            },
            vehicle: {} // Vehicle data will be added from VehicleInfoPage
        });
        }
        logger.log("Sending email verification")

        // change return URL based on role
        let emailVerificationUrl = `${window.location.origin}/auth/login`
        // driver registration page
        if (role === "driver") {
          emailVerificationUrl = `${window.location.origin}/auth/signup/driver_registration`
        }
        await sendEmailVerification(firebaseUser, {
          url: emailVerificationUrl,
        })
        toast.success("Verification email sent. Please check your inbox.")
        router.push("/auth/login")
      } catch (innerError) {
        try {
          await deleteUser(firebaseUser)
        } catch (cleanupError) {
          logger.error("Failed to rollback created auth user:", cleanupError)
        }
        throw innerError
      }
    } catch (error) {
      logger.error("Error signing up:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      logger.log(userCredential.user)
      
      // Check email verification BEFORE accessing Firestore
      if (!userCredential.user.emailVerified) {
        await signOut(auth)
        await sendEmailVerification(userCredential.user)
        throw new Error("auth/email-not-verified")
      }

      // Get user data and handle routing here
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const userRole = userData.role as UserRole

        // Route based on role
        if (userRole === "admin") {
          router.push("/admin/dashboard")
        } else if (userRole === "driver") {
          // check whether the driver has completed the registration process
          const driverDoc = await getDoc(doc(db, "drivers", userCredential.user.uid))
          if (driverDoc.exists()) {
            const driverData = driverDoc.data()
            // the driver has completed the registration process
            if (driverData.checklist.accountInfo && driverData.checklist.emailVerified && driverData.checklist.driverDocs && driverData.checklist.vehicleDocs && driverData.checklist.paymentInfo) {
              router.push("/auth/waitlist")
              toast.success("Login successful", {
                description: "Welcome back to Flow!",
              })
            } else {
              // the driver has not completed the registration process
              router.push("/auth/signup/driver_registration")
              toast.info("Please complete the driver registration process to continue")
            }
          } else {
            // the driver document does not exist
            router.push("/auth/signup")
            toast.error("Driver not found", {
              description: "Please sign up as a driver to continue",
            })
          }
        } else {
          // use when the app is launched
          //router.push("/user/dashboard")
          router.push("/auth/waitlist")
          toast.success("Login successful", {
            description: "Welcome back to Flow!",
          })
        }

      } else {
        throw new Error("User not found")
        //throw new Error("User data not found")
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await signOut(auth)
      router.push("/")
    } catch (error) {
      logger.error("Error logging out:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success("Password reset email sent. Please check your inbox.")
    } catch (error) {
      logger.error("Error sending password reset email:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

async function validateReferralCode(referralCode: string) {
  logger.log("[Auth.tsx]Validating referral code:", referralCode)
  const referralQuery = query(collection(db, "referal_codes"), where("name", "==", referralCode.toLowerCase()))
  const referralQuerySnapshot = await getDocs(referralQuery)
  logger.log("Referral query snapshot:", referralQuerySnapshot)
  return referralQuerySnapshot.docs.length > 0
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Custom hook to protect routes based on role
export function useRoleProtection(allowedRoles: UserRole[]) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (!loading && user && !allowedRoles.includes(user.role)) {
      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else if (user.role === "driver") {
        router.push("/driver/dashboard")
      } else {
        router.push("/user/dashboard")
      }
    }
  }, [user, loading, router, allowedRoles])

  return { user, loading }
}

export function useUser() {
  const { user } = useAuth()
  return { user }
}

