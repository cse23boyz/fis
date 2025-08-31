"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { ArrowLeft, LogOut, Award, BookOpen, Calendar, FileText, Presentation, Pin, Edit } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function MyProfilePage() {
  const [profileData, setProfileData] = useState(null)
  const [certifications, setCertifications] = useState({
    conference: [],
    fdps: [],
    journal: [],
    project_guided: [],
    seminar: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const { department, setUserRole, setDepartment } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId")

    if (currentUserId) {
      // Load the user's own profile
      const profile = localStorage.getItem(`userProfile_${currentUserId}`)
      if (profile) {
        const parsedProfile = JSON.parse(profile)
        setProfileData(parsedProfile)

        // Load their certifications with proper data structure
        const userCertifications = {
          conference: JSON.parse(localStorage.getItem(`certifications_${currentUserId}_conference`) || "[]"),
          fdps: JSON.parse(localStorage.getItem(`certifications_${currentUserId}_fdps`) || "[]"),
          journal: JSON.parse(localStorage.getItem(`certifications_${currentUserId}_journal`) || "[]"),
          project_guided: JSON.parse(localStorage.getItem(`certifications_${currentUserId}_project_guided`) || "[]"),
          seminar: JSON.parse(localStorage.getItem(`certifications_${currentUserId}_seminar`) || "[]"),
        }

        // Sort each certification type by pinned first, then by date
        Object.keys(userCertifications).forEach((key) => {
          userCertifications[key] = userCertifications[key].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1
            if (!a.isPinned && b.isPinned) return 1
            return new Date(b.dateCreated || b.date).getTime() - new Date(a.dateCreated || a.date).getTime()
          })
        })

        setCertifications(userCertifications)
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    setUserRole(null)
    setDepartment(null)
    router.push("/")
  }

  const getCertificationIcon = (type) => {
    switch (type) {
      case "conference":
        return <Presentation className="h-5 w-5" />
      case "fdps":
        return <BookOpen className="h-5 w-5" />
      case "journal":
        return <FileText className="h-5 w-5" />
      case "project_guided":
        return <Award className="h-5 w-5" />
      case "seminar":
        return <Calendar className="h-5 w-5" />
      default:
        return <Award className="h-5 w-5" />
    }
  }

  const getCertificationLabel = (type) => {
    switch (type) {
      case "conference":
        return "Conferences Attended"
      case "fdps":
        return "Faculty Development Programs"
      case "journal":
        return "Journal Publications"
      case "project_guided":
        return "Projects Guided"
      case "seminar":
        return "Seminars & Webinars"
      default:
        return type
    }
  }

  const getTotalCertifications = () => {
    return Object.values(certifications).reduce((total, items) => total + items.length, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Please complete your profile setup first</p>
          <Button onClick={() => router.push("/staff/profile")}>Complete Profile</Button>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full staff-theme">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-blue-100 text-blue-800">👨‍🏫</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">My Profile</h3>
                <p className="text-sm text-muted-foreground">{profileData.designation}</p>
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
                    <SidebarMenuButton onClick={() => router.push("/staff/profile")}>
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => router.push("/staff/certifications")}>
                      <Award className="h-4 w-4" />
                      <span>Update Certifications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Certification Summary 📊</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2 p-2">
                  <Card className="p-3 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Total Certifications</p>
                        <p className="text-2xl font-bold text-blue-600">{getTotalCertifications()}</p>
                      </div>
                      <Award className="h-8 w-8 text-blue-500" />
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
                <h1 className="text-2xl font-bold text-gray-800">My Profile & Certifications 🏆</h1>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {profileData.department}
              </Badge>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Profile Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-lg bg-blue-100 text-blue-800">👨‍🏫</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{profileData.fullName}</CardTitle>
                      <CardDescription className="text-lg">{profileData.designation}</CardDescription>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          {profileData.department}
                        </Badge>
                        {profileData.specialization && (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {profileData.specialization}
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          {getTotalCertifications()} Certifications
                        </Badge>
                      </div>
                    </div>
                    <Button onClick={() => router.push("/staff/profile")} className="bg-blue-600 hover:bg-blue-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Email:</strong> {profileData.email}
                    </div>
                    {profileData.phone && (
                      <div>
                        <strong>Phone:</strong> {profileData.phone}
                      </div>
                    )}
                    {profileData.experience && (
                      <div>
                        <strong>Experience:</strong> {profileData.experience}
                      </div>
                    )}
                    {profileData.qualification && (
                      <div>
                        <strong>Qualification:</strong> {profileData.qualification}
                      </div>
                    )}
                  </div>
                  {profileData.bio && (
                    <div className="mt-4">
                      <strong>About:</strong>
                      <p className="text-gray-700 mt-1">{profileData.bio}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Certifications */}
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(certifications).map(([type, items]) => (
                  <Card key={type} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          {getCertificationIcon(type)}
                          <span>
                            {getCertificationLabel(type)} ({items.length})
                          </span>
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push("/staff/certifications")}
                          className="hover:bg-blue-50"
                        >
                          <Award className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {items.length > 0 ? (
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {items.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className="p-4 border rounded-lg bg-white shadow-sm relative hover:shadow-md transition-shadow"
                            >
                              {item.isPinned && (
                                <div className="absolute top-2 right-2">
                                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                                    <Pin className="h-3 w-3 mr-1" />
                                    Pinned
                                  </Badge>
                                </div>
                              )}
                              <div className="pr-16">
                                <h4 className="font-semibold text-base text-gray-800 mb-2">
                                  {item.title || item.name || "Untitled"}
                                </h4>
                                <div className="space-y-1 text-sm text-gray-600">
                                  {item.date && (
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4 text-blue-500" />
                                      <span>{new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  {item.organization && (
                                    <div className="flex items-center space-x-2">
                                      <Award className="h-4 w-4 text-green-500" />
                                      <span>{item.organization}</span>
                                    </div>
                                  )}
                                  {item.duration && (
                                    <div className="flex items-center space-x-2">
                                      <BookOpen className="h-4 w-4 text-purple-500" />
                                      <span>{item.duration}</span>
                                    </div>
                                  )}
                                </div>
                                {item.description && (
                                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                                    <strong>Details:</strong> {item.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-gray-400 mb-3 flex justify-center">{getCertificationIcon(type)}</div>
                          <p className="text-gray-500 text-sm mb-3">
                            No {getCertificationLabel(type).toLowerCase()} recorded
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push("/staff/certifications")}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                          >
                            <Award className="h-4 w-4 mr-1" />
                            Add First Entry
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
