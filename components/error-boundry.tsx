"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const { toast } = useToast()
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
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  )
}
