import { create } from "zustand"

export interface Notification {
  id: string
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
  timestamp: number
  read: boolean
  actionUrl?: string
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  clearNotification: (id: string) => void
  getUnreadCount: () => number
}

export const useNotifications = create<NotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9)
    set((state) => ({
      notifications: [
        {
          id,
          timestamp: Date.now(),
          read: false,
          ...notification,
        },
        ...state.notifications,
      ],
    }))

    console.log("[v0] Notification added:", notification.title)

    // Auto-remove after 5 seconds for success messages
    if (notification.type === "success") {
      setTimeout(() => {
        get().clearNotification(id)
      }, 5000)
    }
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }))
  },

  clearNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length
  },
}))
