'use client'

import Link from 'next/link'
import GoogleSignupButton from '@/components/signup/googleLoginButton'
import Button from '@/components/ui/btn'
import { useRouter } from 'next/navigation'
import { useAuthActions } from '@convex-dev/auth/react'
import { useState } from 'react'



export default function LoginCard() {
  const [pw1, setPw1] = useState('')
  const [showPw1, setShowPw1] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuthActions()

  const router = useRouter()

  const handleClick = async () => {
    setError('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !pw1) {
      setError('Please fill in all fields.')
      return
    }

    setIsLoading(true)

    try {
      await signIn('password', { email: trimmedEmail, password: pw1, flow: 'signIn' })
      router.push('/results')
    } catch {
      setError('Sign in failed. Please check your email and password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="glass-card">
      {/* Email */}
      <div className="field">
        <label className="field-label">Email</label>
        <div className="field-wrap">
          <input
            className="field-input"
            type="email"
            placeholder="you@email.edu"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Password */}
      <div className="field">
        <label className="field-label">Password</label>
        <div className="field-wrap">
          <input
            className="field-input has-toggle"
            type={showPw1 ? 'text' : 'password'}
            placeholder="Enter password"
            autoComplete="new-password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
          />

          <button className="pw-toggle" type="button" onClick={() => setShowPw1((v) => !v)} aria-label={showPw1 ? 'Hide password' : 'Show password'}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {showPw1 ? (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              ) : (
                <>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button onClick={handleClick} disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign in'}</Button>

        <div className="divider">
            <div className="line" />
                    OR
            <div className="line" />
        </div>

      <GoogleSignupButton />

      <p className="signin-text">
        Don&apos;t have an account? <Link href="/login">Create one</Link>
      </p>
    </section>
  )
}