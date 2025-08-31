"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, User, Mail, Phone, Calendar, BookOpen, Save, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  userId: string
  fullName: string
  email: string
  username: string
  phone: string
  department: string
  designation: string
  dateOfJoining: string
  specialization: string
  experience: string
  qualification: string
  address: string
  bio: string
  isSaved: boolean
  isNewUser: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const [profile, setProfile] = useState<UserProfile>({
    userId: "",
    fullName: "",
    email: "",
    username: "",
    phone: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    specialization: "",
    experience: "",
    qualification: "",
    address: "",
    bio: "",
    isSaved: false,
    isNewUser: false,
  })

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId")
    if (!userId) {
      router.push("/auth/first-login")
      return
    }

    setCurrentUserId(userId)

    // Load existing profile data
    const savedProfile = localStorage.getItem(`userProfile_${userId}`)
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      setProfile({
        userId: userId,
        fullName: parsedProfile.fullName || "",
        email: parsedProfile.email || "",
        username: parsedProfile.username || "",
        phone: parsedProfile.phone || "",
        department: parsedProfile.department || "",
        designation: parsedProfile.designation || "",
        dateOfJoining: parsedProfile.dateOfJoining || "",
        specialization: parsedProfile.specialization || "",
        experience: parsedProfile.experience || "",
        qualification: parsedProfile.qualification || "",
        address: parsedProfile.address || "",
        bio: parsedProfile.bio || "",
        isSaved: parsedProfile.isSaved || false,
        isNewUser: parsedProfile.isNewUser || false,
      })
    } else {
      // Set the user ID for new profiles
      setProfile((prev) => ({ ...prev, userId: userId }))
    }
  }, [router])

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!currentUserId) {
        toast({
          title: "Error",
          description: "User session not found. Please login again.",
          variant: "destructive",
        })
        router.push("/auth/first-login")
        return
      }

      // Validate required fields
      if (!profile.fullName || !profile.email || !profile.department || !profile.designation) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields (Name, Email, Department, Designation).",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Save profile with completion flag
      const updatedProfile = {
        ...profile,
        isSaved: true,
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem(`userProfile_${currentUserId}`, JSON.stringify(updatedProfile))

      toast({
        title: "Profile Updated! 🎉",
        description: "Your profile has been saved successfully.",
      })

      // Redirect to dashboard after successful save
      setTimeout(() => {
        router.push("/staff/dashboard")
      }, 1500)
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/department-selection")
  }

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center relative">
            <Button variant="ghost" size="sm" onClick={handleBack} className="absolute left-4 top-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl">👨‍🏫</AvatarFallback>
              </Avatar>
            </div>

            <CardTitle className="text-3xl font-bold text-gray-800">
              {profile.isSaved ? "Update Your Profile 📝" : "Complete Your Profile 📝"}
            </CardTitle>
            <CardDescription>
              {profile.isSaved
                ? "Update your professional information"
                : "Please fill in your details to complete your faculty profile"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={profile.fullName || ""}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={profile.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={profile.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input id="department" value={profile.department || ""} disabled className="bg-gray-100" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Select
                    value={profile.designation || ""}
                    onValueChange={(value) => handleInputChange("designation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                      <SelectItem value="Senior Lecturer">Senior Lecturer</SelectItem>
                      <SelectItem value="Guest Faculty">Guest Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfJoining">Date of Joining</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dateOfJoining"
                      type="date"
                      value={profile.dateOfJoining || ""}
                      onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Area of Specialization</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="specialization"
                      placeholder="e.g., Machine Learning, Data Structures, etc."
                      value={profile.specialization || ""}
                      onChange={(e) => handleInputChange("specialization", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    placeholder="e.g., 5 years"
                    value={profile.experience || ""}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Highest Qualification</Label>
                  <Input
                    id="qualification"
                    placeholder="e.g., Ph.D, M.Tech, M.E, etc."
                    value={profile.qualification || ""}
                    onChange={(e) => handleInputChange("qualification", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="address"
                      placeholder="Enter your address"
                      value={profile.address || ""}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="pl-10"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / About</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your research interests, achievements..."
                    value={profile.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving Profile...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    {profile.isSaved ? "Update Profile 💾" : "Save Profile 🎉"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
