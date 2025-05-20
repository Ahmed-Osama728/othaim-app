"use client"

import type React from "react"

import { useEffect } from "react"
import { syncWithRemoteAPI } from "@/lib/api"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Sync with remote API when online
  useEffect(() => {
    // Initial sync when component mounts
    if (typeof navigator !== "undefined" && navigator.onLine) {
      syncWithRemoteAPI()
    }

    // Set up event listeners for online/offline status
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

  return <>{children}</>
}
