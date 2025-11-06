"use client"

import { useNotifications } from "@/lib/notifications"
import { motion, AnimatePresence } from "framer-motion"

export function NotificationToast() {
  const { notifications, markAsRead } = useNotifications()

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, x: 400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 400 }}
            transition={{ duration: 0.3 }}
            onClick={() => markAsRead(notification.id)}
            className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all ${
              notification.type === "success"
                ? "bg-accent/10 border-l-accent text-accent"
                : notification.type === "error"
                  ? "bg-destructive/10 border-l-destructive text-destructive"
                  : notification.type === "warning"
                    ? "bg-yellow-500/10 border-l-yellow-500 text-yellow-500"
                    : "bg-primary/10 border-l-primary text-primary"
            }`}
          >
            <p className="font-medium">{notification.title}</p>
            <p className="text-sm opacity-80 mt-1">{notification.message}</p>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}
