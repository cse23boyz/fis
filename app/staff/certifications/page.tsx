"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { ArrowLeft, User, LogOut, Award, Plus, Save, Star, Calendar, Building, FileText } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface Certification {
  id: string
  title: string
  type: "conference" | "fdp" | "journal" | "research"
  organization: string
  date: string
  duration: string
  description: string
  isPinned: boolean
  createdAt: string
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const { department, setUserRole, setDepartment } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    type: "" as "conference" | "fdp" | "journal" | "research" | "",
    organization: "",
    date: "",
    duration: "",
    description: "",
  })

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

    // Load certifications
    const savedCertifications = localStorage.getItem(`certifications_${currentUserId}`)
    if (savedCertifications) {
      setCertifications(JSON.parse(savedCertifications))
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.title || !formData.type || !formData.organization || !formData.date) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const newCertification: Certification = {
        id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: formData.title,
        type: formData.type as "conference" | "fdp" | "journal" | "research",
        organization: formData.organization,
        date: formData.date,
        duration: formData.duration,
        description: formData.description,
        isPinned: false,
        createdAt: new Date().toISOString(),
      }

      const updatedCertifications = [...certifications, newCertification]
      setCertifications(updatedCertifications)

      const currentUserId = localStorage.getItem("currentUserId")
      localStorage.setItem(`certifications_${currentUserId}`, JSON.stringify(updatedCertifications))

      toast({
        title: "Certification Added! 🎉",
        description: "Your certification has been saved successfully.",
      })

      // Reset form
      setFormData({
        title: "",
        type: "",
        organization: "",
        date: "",
        duration: "",
        description: "",
      })
      setShowForm(false)
    } catch (error) {
      console.error("Error saving certification:", error)
      toast({
        title: "Error",
        description: "Failed to save certification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePin = (certId: string) => {
    const updatedCertifications = certifications.map((cert) =>
      cert.id === certId ? { ...cert, isPinned: !cert.isPinned } : cert,
    )
    setCertifications(updatedCertifications)

    const currentUserId = localStorage.getItem("currentUserId")
    localStorage.setItem(`certifications_${currentUserId}`, JSON.stringify(updatedCertifications))

    toast({
      title: updatedCertifications.find((c) => c.id === certId)?.isPinned ? "Pinned! 📌" : "Unpinned! 📌",
      description: "Certification status updated.",
    })
  }

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "conference":
        return "bg-green-100 text-green-800"
      case "fdp":
        return "bg-purple-100 text-purple-800"
      case "journal":
        return "bg-blue-100 text-blue-800"
      case "research":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "conference":
        return <User className="h-4 w-4" />
      case "fdp":
        return <Award className="h-4 w-4" />
      case "journal":
        return <FileText className="h-4 w-4" />
      case "research":
        return <Building className="h-4 w-4" />
      default:
        return <Award className="h-4 w-4" />
    }
  }

  // Sort certifications: pinned first, then by date
  const sortedCertifications = [...certifications].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

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
                    <SidebarMenuButton onClick={() => router.push("/staff/certifications/view")}>
                      <Award className="h-4 w-4" />
                      <span>View All Certifications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Certification Stats 📊</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2 p-2">
                  <Card className="p-3 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Total</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{certifications.length}</Badge>
                    </div>
                  </Card>

                  <Card className="p-3 bg-yellow-50 border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Pinned</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {certifications.filter((c) => c.isPinned).length}
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
                <h1 className="text-2xl font-bold text-gray-800">Manage Certifications 🏆</h1>
              </div>
              <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Add Certification Form */}
              {showForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Certification</CardTitle>
                    <CardDescription>Fill in the details of your certification or achievement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            placeholder="e.g., Machine Learning Workshop"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="type">Type *</Label>
                          <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="conference">Conference</SelectItem>
                              <SelectItem value="fdp">FDP (Faculty Development Program)</SelectItem>
                              <SelectItem value="journal">Journal Publication</SelectItem>
                              <SelectItem value="research">Research Project</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization *</Label>
                          <Input
                            id="organization"
                            placeholder="e.g., IEEE, ACM, University Name"
                            value={formData.organization}
                            onChange={(e) => handleInputChange("organization", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date">Date *</Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            placeholder="e.g., 3 days, 1 week, 6 months"
                            value={formData.duration}
                            onChange={(e) => handleInputChange("duration", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your certification, what you learned, achievements, etc."
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </div>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Certification
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Certifications List */}
              {sortedCertifications.length > 0 ? (
                <div className="space-y-4">
                  {sortedCertifications.map((cert) => (
                    <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CardTitle className="text-lg">{cert.title}</CardTitle>
                              {cert.isPinned && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Pinned
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className={getTypeColor(cert.type)}>
                                {getTypeIcon(cert.type)}
                                <span className="ml-1 capitalize">{cert.type}</span>
                              </Badge>
                              <div className="flex items-center text-sm text-gray-500">
                                <Building className="h-4 w-4 mr-1" />
                                {cert.organization}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(cert.date).toLocaleDateString()}
                              </div>
                              {cert.duration && <Badge variant="outline">{cert.duration}</Badge>}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePin(cert.id)}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            <Star className={`h-4 w-4 ${cert.isPinned ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                      </CardHeader>
                      {cert.description && (
                        <CardContent>
                          <CardDescription className="text-base">{cert.description}</CardDescription>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Certifications Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start building your professional portfolio by adding your first certification.
                  </p>
                  <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Certification
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
