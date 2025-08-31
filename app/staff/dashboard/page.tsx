"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Award,
  Bell,
  Settings,
  LogOut,
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Target,
  Star,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  userId: string
  fullName: string
  email: string
  department: string
  designation: string
  bio: string
  isSaved: boolean
}

interface Certification {
  id: string
  title: string
  type: "conference" | "fdp" | "journal" | "research"
  organization: string
  date: string
  isPinned: boolean
}

export default function StaffDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [unreadCirculars, setUnreadCirculars] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId")
    if (!currentUserId) {
      router.push("/auth/first-login")
      return
    }

    // Load user profile
    const savedProfile = localStorage.getItem(`userProfile_${currentUserId}`)
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      if (!parsedProfile.isSaved || !parsedProfile.fullName || !parsedProfile.department) {
        router.push("/department-selection")
        return
      }
      setProfile(parsedProfile)
    } else {
      router.push("/department-selection")
      return
    }

    // Load certifications
    const savedCertifications = localStorage.getItem(`certifications_${currentUserId}`)
    if (savedCertifications) {
      setCertifications(JSON.parse(savedCertifications))
    }

    // Check for unread circulars
    const circularViewStatus = localStorage.getItem(`circulars_viewed_${currentUserId}`)
    if (!circularViewStatus) {
      setUnreadCirculars(3) // Sample count
    }

    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUserId")
    toast({
      title: "Logged Out Successfully! 👋",
      description: "See you next time!",
    })
    router.push("/")
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleCircularsClick = () => {
    const currentUserId = localStorage.getItem("currentUserId")
    // Mark circulars as viewed
    localStorage.setItem(`circulars_viewed_${currentUserId}`, "true")
    setUnreadCirculars(0)
    router.push("/staff/circulars")
  }

  const getCertificationStats = () => {
    const stats = {
      total: certifications.length,
      conferences: certifications.filter((c) => c.type === "conference").length,
      fdps: certifications.filter((c) => c.type === "fdp").length,
      journals: certifications.filter((c) => c.type === "journal").length,
      research: certifications.filter((c) => c.type === "research").length,
      pinned: certifications.filter((c) => c.isPinned).length,
    }
    return stats
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-6">
          <CardContent className="text-center">
            <p>Profile not found. Please complete your profile setup.</p>
            <Button onClick={() => router.push("/department-selection")} className="mt-4">
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = getCertificationStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-800 text-lg">👨‍🏫</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile.fullName}! 🎉</h1>
                <p className="text-gray-600">
                  {profile.designation} • {profile.department}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Certifications</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conferences</p>
                  <p className="text-3xl font-bold text-green-600">{stats.conferences}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">FDPs</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.fdps}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Publications</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.journals + stats.research}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation Menu */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigation("/staff/my-profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigation("/staff/profile")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigation("/staff/certifications")}
                >
                  <Award className="mr-2 h-4 w-4" />
                  Manage Certifications
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigation("/staff/certifications/view")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  View All Certifications
                </Button>

                <Button variant="ghost" className="w-full justify-start relative" onClick={handleCircularsClick}>
                  <Bell className="mr-2 h-4 w-4" />
                  Admin Communications
                  {unreadCirculars > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {unreadCirculars}
                    </Badge>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.total > 0 ? (
                  <div className="space-y-4">
                    {certifications.slice(0, 3).map((cert) => (
                      <div key={cert.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {cert.type === "conference" && <Users className="h-5 w-5 text-green-600" />}
                          {cert.type === "fdp" && <BookOpen className="h-5 w-5 text-purple-600" />}
                          {cert.type === "journal" && <FileText className="h-5 w-5 text-blue-600" />}
                          {cert.type === "research" && <TrendingUp className="h-5 w-5 text-orange-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{cert.title}</p>
                          <p className="text-sm text-gray-500">
                            {cert.organization} • {cert.date}
                          </p>
                        </div>
                        {cert.isPinned && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleNavigation("/staff/certifications/view")}
                    >
                      View All Certifications
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No certifications yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start by adding your first certification or achievement.
                    </p>
                    <Button className="mt-4" onClick={() => handleNavigation("/staff/certifications")}>
                      Add Certification
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Goals & Targets */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Professional Goals
                </CardTitle>
                <CardDescription>Track your academic and professional development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Conference Presentations</p>
                      <p className="text-sm text-blue-700">Target: 2 per year</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{stats.conferences}</p>
                      <p className="text-sm text-blue-600">This year</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-900">FDP Participation</p>
                      <p className="text-sm text-purple-700">Target: 3 per year</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">{stats.fdps}</p>
                      <p className="text-sm text-purple-600">This year</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Publications</p>
                      <p className="text-sm text-green-700">Target: 1 per semester</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{stats.journals + stats.research}</p>
                      <p className="text-sm text-green-600">This year</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Professional Goals
                </CardTitle>
                <CardDescription>Track your academic and professional development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Conference Presentations</p>
                      <p className="text-sm text-blue-700">Target: 2 per year</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{stats.conferences}</p>
                      <p className="text-sm text-blue-600">This year</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-900">FDP Participation</p>
                      <p className="text-sm text-purple-700">Target: 3 per year</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">{stats.fdps}</p>
                      <p className="text-sm text-purple-600">This year</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Publications</p>
                      <p className="text-sm text-green-700">Target: 1 per semester</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{stats.journals + stats.research}</p>
                      <p className="text-sm text-green-600">This year</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  )
}
