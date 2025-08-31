"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Bell, ArrowLeft, Crown, LogOut, Plus, Pin, Edit, Trash2, Download, Search, Calendar } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface Circular {
  id: string
  heading: string
  body: string
  details: string
  adminNote: string
  dateCreated: string
  isPinned: boolean
}

export default function CircularsPage() {
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null)
  const [circularData, setCircularData] = useState({
    heading: "",
    body: "",
    details: "",
    adminNote: "",
  })

  const router = useRouter()
  const { setUserRole } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Load circulars from localStorage
    const savedCirculars = localStorage.getItem("adminCirculars")
    if (savedCirculars) {
      setCirculars(JSON.parse(savedCirculars))
    }
  }, [])

  const saveCirculars = (updatedCirculars: Circular[]) => {
    localStorage.setItem("adminCirculars", JSON.stringify(updatedCirculars))
    setCirculars(updatedCirculars)
  }

  const handleAddCircular = () => {
    if (!circularData.heading.trim() || !circularData.body.trim()) {
      toast({
        title: "Error ❌",
        description: "Please fill in heading and body",
        variant: "destructive",
      })
      return
    }

    const newCircular: Circular = {
      id: `circular_${Date.now()}`,
      ...circularData,
      dateCreated: new Date().toISOString(),
      isPinned: false,
    }

    const updatedCirculars = [newCircular, ...circulars]
    saveCirculars(updatedCirculars)

    // Notify all users about the new circular
    const circularNotification = {
      type: "circular" as const,
      title: circularData.heading,
      content: circularData.body,
      from: "Admin",
    }

    // Get all user IDs and add notification to each
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("userProfile_")) {
        try {
          const profile = JSON.parse(localStorage.getItem(key) || "{}")
          if (profile && profile.userId) {
            const existingNotifications = JSON.parse(localStorage.getItem(`notifications_${profile.userId}`) || "[]")
            const newNotification = {
              ...circularNotification,
              id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date().toISOString(),
              isRead: false,
            }

            const updatedNotifications = [newNotification, ...existingNotifications].slice(0, 50)
            localStorage.setItem(`notifications_${profile.userId}`, JSON.stringify(updatedNotifications))
          }
        } catch (error) {
          console.error("Error notifying user:", error)
        }
      }
    }

    toast({
      title: "Circular Added! 📢",
      description: "New circular has been created and sent to all faculty members",
    })

    setCircularData({ heading: "", body: "", details: "", adminNote: "" })
    setShowAddDialog(false)
  }

  const handleEditCircular = () => {
    if (!selectedCircular) return

    const updatedCirculars = circulars.map((circular) =>
      circular.id === selectedCircular.id ? { ...circular, ...circularData } : circular,
    )

    saveCirculars(updatedCirculars)

    toast({
      title: "Circular Updated! ✅",
      description: "Circular has been updated successfully",
    })

    setShowEditDialog(false)
    setSelectedCircular(null)
    setCircularData({ heading: "", body: "", details: "", adminNote: "" })
  }

  const handleDeleteCircular = (circularId: string) => {
    const updatedCirculars = circulars.filter((circular) => circular.id !== circularId)
    saveCirculars(updatedCirculars)

    toast({
      title: "Circular Deleted! 🗑️",
      description: "Circular has been removed successfully",
    })
  }

  const handlePinCircular = (circularId: string) => {
    const updatedCirculars = circulars.map((circular) =>
      circular.id === circularId ? { ...circular, isPinned: !circular.isPinned } : circular,
    )

    saveCirculars(updatedCirculars)

    const circular = circulars.find((c) => c.id === circularId)
    toast({
      title: circular?.isPinned ? "Circular Unpinned 📌" : "Circular Pinned 📌",
      description: circular?.isPinned ? "Circular has been unpinned" : "Circular has been pinned to top",
    })
  }

  const handleDownload = (circular: Circular, format: "pdf" | "word") => {
    toast({
      title: `Downloading as ${format.toUpperCase()} 📥`,
      description: `"${circular.heading}" will be downloaded shortly`,
    })
  }

  const openEditDialog = (circular: Circular) => {
    setSelectedCircular(circular)
    setCircularData({
      heading: circular.heading,
      body: circular.body,
      details: circular.details,
      adminNote: circular.adminNote,
    })
    setShowEditDialog(true)
  }

  const handleLogout = () => {
    setUserRole(null)
    toast({
      title: "Admin Logged Out 👑",
      description: "Thank you for using JACSICE Admin Portal",
    })
    router.push("/")
  }

  const filteredCirculars = circulars.filter(
    (circular) =>
      circular.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      circular.body.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedCirculars = [...filteredCirculars].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  })

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
                <p className="text-sm text-green-600">Circulars Management</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-green-700">Navigation 🧭</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push("/admin/dashboard")}
                      className="text-green-700 hover:bg-green-100"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setShowAddDialog(true)}
                      className="text-green-700 hover:bg-green-100"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New Circular</span>
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
                <h1 className="text-2xl font-bold text-gray-800">Circulars Management 📢</h1>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-300">{circulars.length} Circulars</Badge>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gray-50">
            {/* Search and Add Section */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search circulars by heading or content... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Circular
              </Button>
            </div>

            {/* Circulars List */}
            {sortedCirculars.length > 0 ? (
              <div className="space-y-4">
                {sortedCirculars.map((circular) => (
                  <Card key={circular.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className="text-xl">{circular.heading}</CardTitle>
                            {circular.isPinned && (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                <Pin className="h-3 w-3 mr-1" />
                                Pinned
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(circular.dateCreated).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePinCircular(circular.id)}
                            className={circular.isPinned ? "bg-yellow-50 border-yellow-300" : ""}
                          >
                            <Pin className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(circular)}
                            className="hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCircular(circular.id)}
                            className="hover:bg-red-50 text-red-600 border-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Content:</h4>
                        <p className="text-gray-700">{circular.body}</p>
                      </div>

                      {circular.details && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Additional Details:</h4>
                          <p className="text-gray-600">{circular.details}</p>
                        </div>
                      )}

                      {circular.adminNote && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">Admin Note:</h4>
                          <p className="text-green-700">{circular.adminNote}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(circular, "pdf")}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(circular, "word")}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Word
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Circulars Found 📢</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? "No circulars match your search criteria" : "Start by adding your first circular"}
                </p>
                <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Circular
                </Button>
              </div>
            )}
          </main>
        </div>

        {/* Add Circular Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add New Circular</span>
              </DialogTitle>
              <DialogDescription>Create a new circular to send to all faculty members</DialogDescription>
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

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCircular} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Circular
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Circular Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Edit Circular</span>
              </DialogTitle>
              <DialogDescription>Update the circular information</DialogDescription>
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

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCircular} className="bg-green-600 hover:bg-green-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Circular
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  )
}
