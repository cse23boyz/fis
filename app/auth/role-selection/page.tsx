"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, UserPlus, Mail, User, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function RoleSelectionPage() {
  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setUserRole } = useAuth()
  const { toast } = useToast()

  // Check if user already exists
  const checkUserExists = (email: string) => {
    const keys = Object.keys(localStorage)
    const userProfileKeys = keys.filter((key) => key.startsWith("userProfile_"))

    for (const key of userProfileKeys) {
      try {
        const profile = JSON.parse(localStorage.getItem(key) || "{}")
        if (profile.email === email) {
          return true
        }
      } catch (e) {
        continue
      }
    }
    return false
  }

  const handleStaffRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!registrationData.fullName.trim() || !registrationData.email.trim()) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registrationData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    // Check if user already exists
    if (checkUserExists(registrationData.email)) {
      setError("User with this email already exists. Please login instead.")
      setIsLoading(false)
      return
    }

    // Simulate registration
    setTimeout(() => {
      // Generate unique user ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Store pending registration data
      localStorage.setItem(
        `pendingRegistration_${userId}`,
        JSON.stringify({
          ...registrationData,
          userId,
          registrationDate: new Date().toISOString(),
        }),
      )

      // Set current user
      localStorage.setItem("currentUserId", userId)

      // Set role
      setUserRole("staff")

      toast({
        title: "Registration Successful! 🎉",
        description: "Welcome to JACSICE! Please select your department.",
      })

      // Redirect to department selection
      router.push("/department-selection")
      setIsLoading(false)
    }, 1000)
  }

  const handleAdminLogin = () => {
    router.push("/auth/admin-login")
  }

  const handleExistingUserLogin = () => {
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Join JACSICE</CardTitle>
              <CardDescription className="text-gray-600">Register as a new faculty member</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>New Faculty Registration</strong>
                <br />
                Complete your registration to access the faculty portal.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleStaffRegistration} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={registrationData.fullName}
                    onChange={(e) => setRegistrationData({ ...registrationData, fullName: e.target.value })}
                    className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@jacsice.edu"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                    className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </div>
                ) : (
                  "Register as Faculty"
                )}
              </Button>
            </form>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleExistingUserLogin}
                className="w-full h-12 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                Already Registered? Login Here
              </Button>

              <Button
                variant="outline"
                onClick={handleAdminLogin}
                className="w-full h-12 border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
              >
                Admin Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
