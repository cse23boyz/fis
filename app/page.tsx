"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, Award } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = async () => {
    setIsLoading(true)

    // Always go to first-layer login page when Get Started is clicked
    setTimeout(() => {
      router.push("/auth/first-login")
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <GraduationCap className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">JACSICE Faculty Portal 🎓</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to the Faculty Management System for JACSICE Nazareth. Manage your academic profile, certifications,
            and connect with colleagues.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>Faculty Management 👥</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with faculty across departments and manage your professional network
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Certification Tracking 📚</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Update and manage your conferences, FDPs, journals, and research projects
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Award className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle>Admin Dashboard 🏆</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Administrative tools for managing faculty and broadcasting important circulars
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Get Started Button */}
        <div className="text-center animate-bounce-in">
          <Button
            onClick={handleGetStarted}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : (
              <>Get Started 🚀</>
            )}
          </Button>
          <p className="text-sm text-gray-500 mt-4">Click to access the faculty portal</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>© 2024 JACSICE Nazareth - Faculty Management System</p>
        </div>
      </div>
    </div>
  )
}
