"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ArrowLeft, User, LogOut, Award, Bell, Calendar, FileText, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface Circular {
  id: string
  title: string
  content: string
  date: string
  priority: "high" | "medium" | "low"
  category: string
}

export default function CircularsPage() {
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const { department, setUserRole, setDepartment } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId")
    if (!currentUserId) {
      router.push("/auth/first-login")
      return
    }

    // Load user profile
    const savedProfile = localStorage.getItem(`userProfile_${currentUserId}`)
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setUserProfile(parsed)
    }

    // Load circulars from admin
    const savedCirculars = localStorage.getItem("adminCirculars")
    if (savedCirculars) {
      const parsedCirculars = JSON.parse(savedCirculars)
      setCirculars(parsedCirculars)
    } else {
      // Sample circulars if none exist
      const sampleCirculars: Circular[] = [
        {
          id: "1",
          title: "Faculty Development Program - AI & ML",
          content:
            "We are pleased to announce a comprehensive Faculty Development Program on Artificial Intelligence and Machine Learning. The program will be conducted from March 15-20, 2024. All faculty members are encouraged to participate.",
          date: "2024-03-01",
          priority: "high",
          category: "Academic",
        },
        // {
        //   id: "2",
        //   title: "Research Paper Submission Guidelines",
        //   content:
        //     "Updated guidelines for research paper submissions have been released. Please ensure all submissions follow the new format and include the required documentation. Deadline for submissions is April 30, 2024.",
        //   date: "2024-02-28",
        //   priority: "medium",
        //   category: "Research",
        // },
        // {
        //   id: "3",
        //   title: "Annual Faculty Meeting - 2024",
        //   content:
        //     "The annual faculty meeting is scheduled for April 5, 2024, at 10:00 AM in the main auditorium. Attendance is mandatory for all faculty members. Agenda will be shared separately.",
        //   date: "2024-02-25",
        //   priority: "high",
        //   category: "Administrative",
        // },
      ]
      setCirculars(sampleCirculars)
    }

    // Mark circulars as viewed
    localStorage.setItem(`circulars_viewed_${currentUserId}`, "true")
  }, [router])

  const handleLogout = () => {
    setUserRole(null)
    setDepartment(null)
    localStorage.removeItem("currentUserId")
    toast({
      title: "Logged Out Successfully! 👋",
      description: "Thank you for using JACSICE Faculty Portal",
    })
    router.push("/")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4" />
      case "medium":
        return <Bell className="h-4 w-4" />
      case "low":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full staff-theme">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-800">👨‍🏫</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {userProfile?.fullName ? `${userProfile.fullName.split(" ")[0]}` : "Faculty"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {userProfile?.designation || department + " Department"}
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation 🧭</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => router.push("/staff/dashboard")}>
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => router.push("/staff/my-profile")}>
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => router.push("/staff/certifications")}>
                      <Award className="h-4 w-4" />
                      <span>Certifications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Circular Stats 📊</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2 p-2">
                  <Card className="p-3 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Total Circulars</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{circulars.length}</Badge>
                    </div>
                  </Card>

                  <Card className="p-3 bg-red-50 border-red-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">High Priority</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800">
                        {circulars.filter((c) => c.priority === "high").length}
                      </Badge>
                    </div>
                  </Card>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <Button variant="outline" onClick={handleLogout} className="w-full bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Logout 👋
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-gray-800">Admin Communications 📢</h1>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {circulars.length} Circulars
              </Badge>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              {circulars.length > 0 ? (
                <div className="space-y-6">
                  {circulars.map((circular) => (
                    <Card key={circular.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{circular.title}</CardTitle>
                            <div className="flex items-center space-x-3">
                              <Badge className={getPriorityColor(circular.priority)}>
                                {getPriorityIcon(circular.priority)}
                                <span className="ml-1 capitalize">{circular.priority} Priority</span>
                              </Badge>
                              <Badge variant="outline">{circular.category}</Badge>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(circular.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">{circular.content}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Circulars Available</h3>
                  <p className="text-gray-500 mb-4">There are currently no circulars from the administration.</p>
                  <Button onClick={() => router.push("/staff/dashboard")} className="bg-blue-600 hover:bg-blue-700">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
