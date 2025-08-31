"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: "circular" | "message"
  title: string
  content: string
  from: string
  timestamp: string
  isRead: boolean
  targetUserId?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => void
  markAsRead: (notificationId: string) => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  clearNotifications: () => {},
})

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId")
    if (currentUserId) {
      const savedNotifications = localStorage.getItem(`notifications_${currentUserId}`)
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications))
      }
    }
  }, [])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => {
    const currentUserId = localStorage.getItem("currentUserId")

    // Check if this notification is for current user (for messages) or for all users (for circulars)
    if (notification.type === "message" && notification.targetUserId !== currentUserId) {
      return
    }

    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    }

    const updatedNotifications = [newNotification, ...notifications].slice(0, 50) // Keep only last 50
    setNotifications(updatedNotifications)

    if (currentUserId) {
      localStorage.setItem(`notifications_${currentUserId}`, JSON.stringify(updatedNotifications))
    }

    // Show toast notification
    toast({
      title: notification.type === "circular" ? "New Circular 📢" : "New Message 📨",
      description: notification.title,
    })
  }

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif,
    )
    setNotifications(updatedNotifications)

    const currentUserId = localStorage.getItem("currentUserId")
    if (currentUserId) {
      localStorage.setItem(`notifications_${currentUserId}`, JSON.stringify(updatedNotifications))
    }
  }

  const clearNotifications = () => {
    setNotifications([])
    const currentUserId = localStorage.getItem("currentUserId")
    if (currentUserId) {
      localStorage.removeItem(`notifications_${currentUserId}`)
    }
  }

  const unreadCount = notifications.filter((notif) => !notif.isRead).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
