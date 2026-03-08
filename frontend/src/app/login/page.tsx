//'use client'

/*
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
*/

'use client'

import Background from '@/components/ui/background'
import LogoBar from '@/components/ui/logoBar'
import BackLink from '@/components/login/backLink'
import Hero from '@/components/login/hero'
import SignupCard from '@/components/login/signupCard'
import GlassCard from '@/components/ui/glassCard'
import { useSearchParams, useRouter } from 'next/navigation'
import { useConvexAuth } from 'convex/react'
import { useEffect } from 'react'

function getOauthErrorMessage(error: string | null): string | null {
  if (!error) return null
  return 'Google sign-in was cancelled or failed. Please try again.'
}

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const isOauthAttempt = searchParams?.get('oauth') === 'google'
  const oauthErrorMessage = getOauthErrorMessage(searchParams?.get('error') ?? null)

  useEffect(() => {
    if (!isLoading && isAuthenticated && isOauthAttempt && !oauthErrorMessage) {
      router.replace('/results')
    }
  }, [isAuthenticated, isLoading, isOauthAttempt, oauthErrorMessage, router])

  return (
    <div className="lh-root">
      <Background />

      <LogoBar />
      <BackLink href="/signup" label="Back to sign in" />

      <main className="page">
        <Hero />
        {oauthErrorMessage ? (
          <p role="alert" className="text-sm text-red-300 mb-3 text-center">
            {oauthErrorMessage}
          </p>
        ) : null}
        {/*<GlassCard>*/}
        <SignupCard />
        {/*</GlassCard>*/}
        <div className="line-accent" />
      </main>
    </div>
  )
}
