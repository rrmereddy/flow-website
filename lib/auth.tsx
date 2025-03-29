"use client"

import type React from "react"

import { useEffect, useState, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "./firebase"
import { toast } from "sonner"

// Define user types
export type UserRole = "admin" | "driver" | "user"

export type User = {
  uid: string
  email: string | null
  name: string | null
  role: UserRole
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()
            const userRole = userData.role as UserRole
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              role: userRole,
            })

            // Redirect based on role
            if (userRole === "admin") {
              router.push("/admin/dashboard")
            } else if (userRole === "driver") {
              router.push("/driver/dashboard")
            } else {
              router.push("/user/dashboard")
            }
          } else{
            toast.error("User not found")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Update profile with display name
      await updateProfile(firebaseUser, {
        displayName: name,
      })

      // Create user document in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
      })

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin/dashboard")
      } else if (role === "driver") {
        router.push("/driver/dashboard")
      } else {
        router.push("/user/dashboard")
      }
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      // Redirection will happen in the useEffect when user state changes
    } catch (error) {
      console.error("Error logging in:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await signOut(auth)
      router.push("/auth/login")
    } catch (error) {
      console.error("Error logging out:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
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

