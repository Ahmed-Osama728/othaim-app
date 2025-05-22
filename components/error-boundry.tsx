"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isResetting, setIsResetting] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string>("")

  useEffect(() => {
    const errorMessage = error.message || "An unexpected error occurred"
    setErrorDetails(errorMessage)

    toast({
      title: "Something went wrong",
      description: errorMessage,
      variant: "destructive",
    })
  }, [error, toast])

  const handleReset = async () => {
    setIsResetting(true)

    try {
      reset()
      router.refresh()

      toast({
        title: "Retrying...",
        description: "Attempting to reload the data",
      })
    } catch (e) {
      console.error("Error during reset:", e)

      toast({
        title: "Reset failed",
        description: "Please try refreshing the page manually",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 text-center">
      <div className="space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-4 rounded-full">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold">Something went wrong!</h2>
        <p className="text-muted-foreground">We apologize for the inconvenience. The following error occurred:</p>
        <div className="bg-muted p-4 rounded-md text-left overflow-auto max-h-32">
          <code className="text-sm">{errorDetails}</code>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleReset} disabled={isResetting} className="flex items-center gap-2">
            {isResetting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Try again
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
            Refresh page
          </Button>
        </div>
      </div>
    </div>
  )
}
