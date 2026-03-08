"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react"

declare global {
  interface Window {
    google?: any
  }
}

export function LoginPage() {
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!clientId) {
      console.error("Missing VITE_GOOGLE_CLIENT_ID")
      return
    }

    const initGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          console.log("Google credential response:", response)
        },
      })

      //if (!response.credential) return; need to varify 

      const router = useRouter();
      router.push("/ResultsPage");

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        { theme: "outline", size: "large" }
      )
    }

    if (window.google?.accounts?.id) {
      // Script already loaded
      initGoogle()
    } else {
      // Load the script dynamically and wait for it
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.onload = initGoogle
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6">Sign in to Lighthouse</h1>
        <div id="googleSignIn" className="flex justify-center" />
        <p className="text-xs text-gray-500 mt-4">
          If the button doesn't load, check console for errors.
        </p>
      </div>
    </div>
  )
}