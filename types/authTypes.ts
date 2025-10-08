import { FieldValue } from "firebase/firestore"

// Define user types
export type UserRole = "admin" | "driver" | "user"

export type User = {
  uid: string
  emailAddress: string
  firstName: string | null
  lastName: string | null
  role: UserRole
}

export type SignupUser = {
  emailAddress: string
  firstName: string | null
  lastName: string | null
  role: UserRole
  accountStatus: "awaiting verification" | "verified" | "suspended"
  paymentMethods: string[]
  phoneNumber: string
  profilePictureURL: string
  createdAt: FieldValue
  referralCode?: string
}

export type AuthContextType = {
  user: User | null
  loading: boolean
  signup: (email: string, password: string, firstName: string, lastName: string, role: UserRole, referralCode?: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
}