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

    if (!window.google?.accounts?.id) {
      console.error("Google Identity Services script not loaded")
      return
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential?: string }) => {
        console.log("Google credential response:", response)
      },
    })

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignIn"),
      { theme: "outline", size: "large" }
    )
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6">Sign in to Lighthouse</h1>

        <div id="googleSignIn" className="flex justify-center" />

        <p className="text-xs text-gray-500 mt-4">
          If the button doesn’t load, check console for errors.
        </p>
      </div>
    </div>
  )
}
