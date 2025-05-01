"use client"
import { X } from "lucide-react"
import type { Notification } from "./notification-provider"
import { cva } from "class-variance-authority"

interface NotificationToastProps {
  notification: Notification
  onClose: () => void
}

const toastVariants = cva(
  "relative flex items-center justify-between p-4 rounded-lg shadow-md transition-all transform translate-x-0",
  {
    variants: {
      type: {
        info: "bg-blue-50 text-blue-800 border-l-4 border-blue-500",
        success: "bg-green-50 text-green-800 border-l-4 border-green-500",
        warning: "bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500",
        error: "bg-red-50 text-red-800 border-l-4 border-red-500",
      },
    },
    defaultVariants: {
      type: "info",
    },
  },
)

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  return (
    <div className={toastVariants({ type: notification.type })} style={{ minWidth: "300px", maxWidth: "450px" }}>
      <div className="flex-1 pr-3">
        <h4 className="font-semibold mb-1">{notification.title}</h4>
        <p className="text-sm">{notification.message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
