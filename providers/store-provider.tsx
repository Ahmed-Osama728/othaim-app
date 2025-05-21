"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { syncWithRemoteAPI } from "@/lib/api"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  // Sync with remote API when online
  useEffect(() => {
    setIsMounted(true)

    if (typeof navigator !== "undefined" && navigator.onLine) {
      syncWithRemoteAPI()
    }

    const handleOnline = () => {
      console.log("App is online, syncing with remote API...")
      syncWithRemoteAPI()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline)

      return () => {
        window.removeEventListener("online", handleOnline)
      }
    }
  }, [])

  if (!isMounted) {
    return null
  }

  return <>{children}</>
}
