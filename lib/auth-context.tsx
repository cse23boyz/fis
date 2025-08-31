"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  userRole: "admin" | "staff" | null
  department: string | null
  currentUserId: string | null
  setUserRole: (role: "admin" | "staff" | null) => void
  setDepartment: (dept: string | null) => void
  setCurrentUserId: (idnu: string | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userRole: null,
  department: null,
  currentUserId: null,
  setUserRole: () => {},
  setDepartment: () => {},
  setCurrentUserId: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"admin" | "staff" | null>(null)
  const [department, setDepartment] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setCurrentUserId(user ? user.uid : null)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    // Restore department from user profile if available
    const currentUserId = localStorage.getItem("currentUserId")
    if (currentUserId) {
      const savedProfile = localStorage.getItem(`userProfile_${currentUserId}`)
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile)
          if (profile.department) {
            setDepartment(profile.department)
          }
        } catch (error) {
          console.error("Error restoring department:", error)
        }
      }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userRole,
        department,
        currentUserId,
        setUserRole,
        setDepartment,
        setCurrentUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
