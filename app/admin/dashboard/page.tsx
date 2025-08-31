"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Users, LogOut, MessageSquare, Send, Crown, Bell, Eye, User, Mail, BookOpen, Award, Search } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"

// Remove the mockFaculty array completely and update the component

export default function AdminDashboard() {
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null)
  const [messageText, setMessageText] = useState("")
  const [circularData, setCircularData] = useState({
    heading: "",
    body: "",
    details: "",
    adminNote: "",
  })
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [showCircularDialog, setShowCircularDialog] = useState(false)
  const [faculty, setFaculty] = useState([])
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredFaculty, setFilteredFaculty] = useState([])

  const router = useRouter()
  const { setUserRole } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Load only registered faculty members who have updated their profiles
    const registeredFaculty = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("userProfile_")) {
        try {
          const profile = JSON.parse(localStorage.getItem(key) || "{}")
          if (profile && profile.isSaved && profile.fullName) {
            registeredFaculty.push({
              id: profile.userId || profile.id,
              name: profile.fullName,
              department: profile.department,
              designation: profile.designation,
              email: profile.email,
              avatar: "/placeholder.svg?height=40&width=40",
              specialization: profile.specialization,
              experience: profile.experience,
              status: "Active",
              phone: profile.phone,
              qualification: profile.qualification,
              bio: profile.bio,
            })
          }
        } catch (error) {
          console.error("Error parsing faculty profile:", error)
        }
      }
    }
    setFaculty(registeredFaculty)
  }, [])

  useEffect(() => {
    // Filter faculty based on search term
    if (searchTerm.trim()) {
      const filtered = faculty.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredFaculty(filtered)
    } else {
      setFilteredFaculty(faculty)
    }
  }, [searchTerm, faculty])

  const handleLogout = () => {
    setUserRole(null)
    toast({
      title: "Admin Logged Out 👑",
      description: "Thank you for using JACSICE Admin Portal",
    })
    router.push("/")
  }

  const handleSendMessage = () => {
    if (!selectedFaculty || !messageText.trim()) {
      toast({
        title: "Error ❌",
        description: "Please select faculty and enter a message",
        variant: "destructive",
      })
      return
    }

    // Store message for specific user
    const messageNotification = {
      type: "message" as const,
      title: "New Message from Admin",
      content: messageText,
      from: "Admin",
      targetUserId: selectedFaculty.id,
    }

    // Save notification for the specific user
    const existingNotifications = JSON.parse(localStorage.getItem(`notifications_${selectedFaculty.id}`) || "[]")
    const newNotification = {
      ...messageNotification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    }

    const updatedNotifications = [newNotification, ...existingNotifications].slice(0, 50)
    localStorage.setItem(`notifications_${selectedFaculty.id}`, JSON.stringify(updatedNotifications))

    toast({
      title: "Message Sent! 📨",
      description: `Message sent to ${selectedFaculty.name}`,
    })

    setMessageText("")
    setShowMessageDialog(false)
    setSelectedFaculty(null)
  }

  const handleSendCircular = () => {
    if (!circularData.heading.trim() || !circularData.body.trim()) {
      toast({
        title: "Error ❌",
        description: "Please fill in heading and body",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Circular Sent! 📢",
      description: "Circular has been sent to all faculty members",
    })

    setCircularData({
      heading: "",
      body: "",
      details: "",
      adminNote: "",
    })
    setShowCircularDialog(false)
  }

  const openMessageDialog = (facultyMember: any) => {
    setSelectedFaculty(facultyMember)
    setShowMessageDialog(true)
  }

  const handleViewUser = (user: any) => {
    // Load actual certifications for this user
    const userCertifications = {
      conferences: JSON.parse(localStorage.getItem(`certifications_${user.id}_conference`) || "[]"),
      fdps: JSON.parse(localStorage.getItem(`certifications_${user.id}_fdps`) || "[]"),
      journals: JSON.parse(localStorage.getItem(`certifications_${user.id}_journal`) || "[]"),
      projects: JSON.parse(localStorage.getItem(`certifications_${user.id}_project_guided`) || "[]"),
      seminars: JSON.parse(localStorage.getItem(`certifications_${user.id}_seminar`) || "[]"),
    }

    setSelectedUser({
      ...user,
      certifications: userCertifications,
    })
    setShowUserProfile(true)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full admin-theme">
        {/* Sidebar */}
        <Sidebar className="border-r bg-green-50">
          <SidebarHeader className="p-4 bg-green-100">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-full">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Admin Portal</h3>
                <p className="text-sm text-green-600">JACSICE Management</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-green-700">Admin Functions 👑</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-green-700 hover:bg-green-100">
                      <Users className="h-4 w-4" />
                      <span>View Faculty</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-green-700 hover:bg-green-100">
                      <Users className="h-4 w-4" />
                      <span>Invite New Faculty</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push("/admin/circulars")}
                      className="text-green-700 hover:bg-green-100"
                    >
                      <Bell className="h-4 w-4" />
                      <span>Manage Circulars</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
            >
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
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard 👑</h1>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-300">Administrator</Badge>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gray-50">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {/* <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Faculty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{faculty.length}</div>
                  <p className="text-green-100">Registered Members</p>
                </CardContent>
              </Card> */}

              {/* <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4</div>
                  <p className="text-blue-100">CSE, IT, ECE, MECH</p>
                </CardContent>
              </Card> */}

              {/* <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Messages Sent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-purple-100">This Month</p>
                </CardContent>
              </Card> */}

              {/* <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Circulars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">5</div>
                  <p className="text-orange-100">Active</p>
                </CardContent>
              </Card> */}
            </div>

            {/* Search Section */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search faculty by name, department, or email... 🔍"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Faculty List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-6 w-6" />
                      <span>Registered Faculty Members 👥</span>
                    </CardTitle>
                    <CardDescription>
                      Faculty members who have registered and updated their profiles ({filteredFaculty.length} found)
                    </CardDescription>
                  </div>
                  <Button onClick={() => router.push("/admin/circulars")} className="bg-green-600 hover:bg-green-700">
                    <Bell className="h-4 w-4 mr-2" />
                    Manage Circulars
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {filteredFaculty.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFaculty.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-blue-100 text-blue-800">👨‍🏫</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-gray-600">
                              {member.designation} • {member.department}
                            </p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openMessageDialog(member)}
                            className="hover:bg-blue-50"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewUser(member)}
                            className="hover:bg-gray-50 bg-transparent"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      {searchTerm ? "No Faculty Found 🔍" : "No Registered Faculty 👥"}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm
                        ? "No faculty members match your search criteria"
                        : "Faculty members will appear here once they register and update their profiles"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>

        {/* Message Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Send Message to Faculty</span>
              </DialogTitle>
              <DialogDescription>{selectedFaculty && `Sending message to ${selectedFaculty.name}`}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Message 📝</label>
                <Textarea
                  placeholder="Type your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 This message will appear in the faculty member's dashboard with a note "Only to you from admin"
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Circular Dialog */}
        <Dialog open={showCircularDialog} onOpenChange={setShowCircularDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Add New Circular</span>
              </DialogTitle>
              <DialogDescription>Create a circular that will be sent to all faculty members</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Heading *</label>
                <Input
                  placeholder="Enter circular heading"
                  value={circularData.heading}
                  onChange={(e) => setCircularData({ ...circularData, heading: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Body *</label>
                <Textarea
                  placeholder="Enter circular body content"
                  value={circularData.body}
                  onChange={(e) => setCircularData({ ...circularData, body: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Details</label>
                <Textarea
                  placeholder="Enter additional details (optional)"
                  value={circularData.details}
                  onChange={(e) => setCircularData({ ...circularData, details: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Note</label>
                <Input
                  placeholder="Add a note from admin (optional)"
                  value={circularData.adminNote}
                  onChange={(e) => setCircularData({ ...circularData, adminNote: e.target.value })}
                />
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">
                  📢 This circular will be sent to all faculty members immediately upon clicking "Send Circular"
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCircularDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendCircular} className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Circular
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* User Profile Dialog */}
        <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Faculty Profile - {selectedUser?.name}</span>
              </DialogTitle>
              <DialogDescription>Complete profile information</DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg bg-blue-100 text-blue-800">👨‍🏫</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedUser.name}</h2>
                    <p className="text-lg text-blue-600">{selectedUser.designation}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {selectedUser.department}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Profile Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Mail className="h-5 w-5" />
                        <span>Contact Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Email</Label>
                        <p className="text-blue-600">{selectedUser.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Phone</Label>
                        <p>+91 9876543210</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Employee ID</Label>
                        <p>EMP{selectedUser.id.toString().padStart(3, "0")}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <BookOpen className="h-5 w-5" />
                        <span>Professional Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Specialization</Label>
                        <p>{selectedUser.specialization}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Experience</Label>
                        <p>{selectedUser.experience}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Qualification</Label>
                        <p>Ph.D in Computer Science</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Award className="h-5 w-5" />
                        <span>Certifications Overview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedUser.certifications &&
                        Object.entries(selectedUser.certifications).map(([type, items]) => (
                          <div key={type}>
                            <Label className="text-sm font-medium text-gray-600 capitalize">{type}</Label>
                            <p>{items.length} recorded</p>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Bio Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      Dr. {selectedUser.name} is a dedicated faculty member with expertise in{" "}
                      {selectedUser.specialization}. With {selectedUser.experience} of experience in academia and
                      research, they have contributed significantly to the field through various publications and
                      research projects. They are passionate about teaching and mentoring students in cutting-edge
                      technologies and research methodologies.
                    </p>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => openMessageDialog(selectedUser)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={() => setShowUserProfile(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  )
}
