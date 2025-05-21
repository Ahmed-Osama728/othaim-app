"use client"

import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"
import { syncWithRemoteAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)

    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You're back online",
        description: "Syncing your data with our servers...",
        variant: "default",
      })
      syncWithRemoteAPI()
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You're offline",
        description: "Don't worry, you can still browse products and use your cart.",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  // Don't render anything during SSR or until mounted
  if (!isMounted) return null

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">You're offline</span>
      </div>
    </div>
  )
}
