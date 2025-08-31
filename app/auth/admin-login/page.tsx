"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Crown, ArrowLeft, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const { setUserRole } = useAuth()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (credentials.username === "adminsonly" && credentials.password === "adminsonly") {
        setUserRole("admin")
        toast({
          title: "Admin Access Granted! 👑",
          description: "Welcome to the admin dashboard",
        })
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1000)
      } else {
        setError("Invalid admin credentials")
        toast({
          title: "Access Denied ❌",
          description: "Invalid admin credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Admin login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/auth/first-login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-red-200">
          <CardHeader className="text-center pb-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-lg relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="absolute left-4 top-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Portal 👑</CardTitle>
            <CardDescription className="text-red-100">Administrative access to JACSICE Faculty System</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            {error && (
              <Alert variant="destructive" className="animate-fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username" className="text-sm font-medium">
                  Admin Username 🔑
                </Label>
                <Input
                  id="admin-username"
                  name="username"
                  placeholder="Enter admin username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  className="mobile-friendly focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm font-medium">
                  Admin Password 🔐
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="pr-10 mobile-friendly focus:ring-red-500 focus:border-red-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 mobile-friendly"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying Access...
                  </div>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Access Admin Portal
                  </>
                )}
              </Button>
            </form>

            {/* <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 text-center">
                💡 <strong>Admin Credentials:</strong>
                <br />
                Username: <code className="bg-red-100 px-1 rounded">adminsonly</code>
                <br />
                Password: <code className="bg-red-100 px-1 rounded">adminsonly</code>
              </p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
