'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToken } from 'src/app/providers'

declare global {
  interface Window {
    google?: any
  }
}

export default function GoogleSignupButton() {
  const router = useRouter()
  const { setToken } = useToken()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!clientId) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID')
      return
    }

    // Wait for the GSI script to exist (prevents teammate “works on my machine” issues)
    const timer = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(timer)

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              setToken(response.credential)
              router.push('/results')
            } else {
              console.error('No credential returned from Google')
            }
          },
        })

        setReady(true)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [router, setToken])

  const handleGoogle = () => {
    if (!window.google?.accounts?.id) {
      console.error('Google script not loaded yet')
      return
    }

    window.google.accounts.id.prompt()
  }

  return (
    <button className="google-btn" type="button" onClick={handleGoogle} disabled={!ready}>
      <img className="google-icon" src="/web_neutral_rd_na.svg" alt="Google logo" />
      <span>{ready ? 'Sign up with Google' : 'Loading…'}</span>
    </button>
  )
}





    
      
    