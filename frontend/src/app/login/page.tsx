'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useToken } from '../providers'

declare global {
  interface Window {
    google?: any
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { setToken } = useToken()

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!clientId) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID')
      return
    }

    const initGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          console.log('Google credential response:', response)
          if (response.credential) {
            setToken(response.credential)
            router.push('/results')
          }
        },
      })

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignIn'),
        { theme: 'outline', size: 'large' }
      )
    }

    if (window.google?.accounts?.id) {
      initGoogle()
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval)
          initGoogle()
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [router, setToken])

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
