"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Lock, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const checkUserExists = (email: string) => {
    // Get all localStorage keys that start with 'userProfile_'
    const allKeys = Object.keys(localStorage)
    const userProfileKeys = allKeys.filter((key) => key.startsWith("userProfile_"))

    // Check if any profile matches the email/username
    for (const key of userProfileKeys) {
      try {
        const profile = JSON.parse(localStorage.getItem(key) || "{}")
        if (profile.email === email || profile.fullName === email) {
          return { exists: true, userId: key.replace("userProfile_", ""), profile }
        }
      } catch (error) {
        console.error("Error parsing profile:", error)
      }
    }

    return { exists: false, userId: null, profile: null }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check if user exists
      const userCheck = checkUserExists(formData.email)

      if (!userCheck.exists) {
        setError("User not found. Please register first or check your email/username.")
        setIsLoading(false)
        return
      }

      // Set current user
      localStorage.setItem("currentUserId", userCheck.userId)

      // Check if profile is complete
      if (
        userCheck.profile &&
        userCheck.profile.isSaved &&
        userCheck.profile.fullName &&
        userCheck.profile.department
      ) {
        // Complete profile - go to dashboard
        toast({
          title: "Login Successful! 🎉",
          description: `Welcome back, ${userCheck.profile.fullName}!`,
        })

        setTimeout(() => {
          router.push("/staff/dashboard")
        }, 1000)
      } else {
        // Incomplete profile - go to department selection
        toast({
          title: "Complete Your Setup! 📝",
          description: "Please complete your profile to continue.",
        })

        setTimeout(() => {
          router.push("/department-selection")
        }, 1000)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  const handleRegister = () => {
    router.push("/auth/role-selection")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <Button variant="ghost" size="sm" onClick={handleBack} className="absolute left-4 top-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back! 👋</CardTitle>
            <CardDescription>Sign in to your JACSICE Faculty account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email or Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Enter your email or username"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In 🚀"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  onClick={handleRegister}
                  className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-800"
                >
                  Register here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
