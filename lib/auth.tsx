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
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, collection, getDocs, where, query } from "firebase/firestore"
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
      if (firebaseUser && firebaseUser.emailVerified) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()
            const userRole = userData.role as UserRole
            
            // Update accountStatus to "verified" for all users if it's currently "awaiting verification"
            if (userRole === "user" && userData.accountStatus === "awaiting verification") {
              await updateDoc(doc(db, "users", firebaseUser.uid), {
                accountStatus: "verified",
                emailVerifiedAt: serverTimestamp()
              })
              logger.log("User email verified - updated account status")
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
        logger.log("Sending email verification")
        await sendEmailVerification(firebaseUser, {
          url: `${window.location.origin}/auth/login`,
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
          // Use when the app is launched
          //router.push("/driver/dashboard")
          router.push("/auth/waitlist")
        } else {
          // use when the app is launched
          //router.push("/user/dashboard")
          router.push("/auth/waitlist")
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

