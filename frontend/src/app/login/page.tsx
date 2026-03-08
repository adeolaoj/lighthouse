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
