"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Computer, Cpu, Zap, Cog, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

const departments = [
  {
    id: "CSE",
    name: "Computer Science & Engineering",
    icon: Computer,
    color: "bg-blue-500 hover:bg-blue-600",
    description: "Software Development, AI, Data Science",
    emoji: "💻",
  },
  {
    id: "IT",
    name: "Information Technology",
    icon: Cpu,
    color: "bg-green-500 hover:bg-green-600",
    description: "Networks, Cybersecurity, Cloud Computing",
    emoji: "🌐",
  },
  {
    id: "ECE",
    name: "Electronics & Communication",
    icon: Zap,
    color: "bg-purple-500 hover:bg-purple-600",
    description: "VLSI, Embedded Systems, Communication",
    emoji: "⚡",
  },
  {
    id: "MECH",
    name: "Mechanical Engineering",
    icon: Cog,
    color: "bg-orange-500 hover:bg-orange-600",
    description: "Design, Manufacturing, Automation",
    emoji: "⚙️",
  },
]

export default function DepartmentSelectionPage() {
  const [selectedDept, setSelectedDept] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setDepartment } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const currentUserId = localStorage.getItem("currentUserId")
    if (!currentUserId) {
      router.push("/auth/first-login")
      return
    }

    // Check if this is an existing user who should go directly to dashboard
    const savedProfile = localStorage.getItem(`userProfile_${currentUserId}`)
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      if (profile.isSaved && profile.fullName && profile.department) {
        // User already has completed profile, redirect to dashboard
        setDepartment(profile.department)
        toast({
          title: "Profile Already Complete! ✅",
          description: "Redirecting to your dashboard...",
        })
        setTimeout(() => {
          router.push("/staff/dashboard")
        }, 1000)
        return
      }
    }
  }, [router, setDepartment, toast])

  const handleDepartmentSelect = (deptId: string) => {
    setSelectedDept(deptId)
    setIsLoading(true)
    setDepartment(deptId)

    const currentUserId = localStorage.getItem("currentUserId")

    // Update user profile with department selection
    if (currentUserId) {
      const existingProfile = localStorage.getItem(`userProfile_${currentUserId}`)
      if (existingProfile) {
        const profile = JSON.parse(existingProfile)
        profile.department = deptId
        localStorage.setItem(`userProfile_${currentUserId}`, JSON.stringify(profile))
      }
    }

    toast({
      title: `Welcome to ${deptId}! 🎉`,
      description: "Please complete your profile setup...",
    })

    setTimeout(() => {
      router.push("/staff/profile")
    }, 1500)
  }

  const handleBack = () => {
    router.push("/auth/staff-login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBack} className="mb-6 hover:bg-white/50">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Staff Login
        </Button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Select Your Department 🏛️</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your department to access the faculty dashboard and connect with your colleagues
          </p>
        </div>

        {/* Department Cards */}
        <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
          {departments.map((dept) => {
            const IconComponent = dept.icon
            const isSelected = selectedDept === dept.id
            const isLoading_dept = isLoading && isSelected

            return (
              <Card
                key={dept.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  isSelected ? "ring-4 ring-blue-500 shadow-xl" : ""
                } ${isLoading_dept ? "opacity-75" : ""}`}
                onClick={() => !isLoading && handleDepartmentSelect(dept.id)}
              >
                <CardHeader className="text-center pb-2">
                  <div
                    className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${dept.color} text-white`}
                  >
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {dept.name} {dept.emoji}
                  </CardTitle>
                  <CardDescription className="text-gray-600">{dept.description}</CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <Button className={`w-full ${dept.color} text-white mobile-friendly`} disabled={isLoading}>
                    {isLoading_dept ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Joining {dept.id}...
                      </div>
                    ) : (
                      `Join ${dept.id} Department`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>🎓 JACSICE Nazareth - Faculty Management System</p>
        </div>
      </div>
    </div>
  )
}
