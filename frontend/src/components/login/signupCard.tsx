'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import GoogleSignupButton from '@/components/login/googleSignupBtn'
import Button from '@/components/ui/btn'
import { useRouter } from 'next/navigation'

type Strength = 0 | 1 | 2 | 3 | 4

function computeStrength(pw: string): Strength {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score as Strength
}

export default function SignupCard() {
  const [pw1, setPw1] = useState('')
  const [pw2, setPw2] = useState('')
  const [showPw1, setShowPw1] = useState(false)
  const [showPw2, setShowPw2] = useState(false)

  const strength = useMemo(() => computeStrength(pw1), [pw1])
  const strengthClass = strength <= 1 ? 'weak' : strength <= 2 ? 'medium' : 'strong'

  const router = useRouter()

  const handleClick = () => {
    router.push('/results')

  }

  return (
    <section className="glass-card">
      {/* Name row */}
      <div className="field-row">
        <div className="field">
          <label className="field-label">First Name</label>
          <div className="field-wrap">
            <input className="field-input" type="text" placeholder="Jane" autoComplete="given-name" />
          </div>
        </div>

        <div className="field">
          <label className="field-label">Last Name</label>
          <div className="field-wrap">
            <input className="field-input" type="text" placeholder="Smith" autoComplete="family-name" />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="field">
        <label className="field-label">Email</label>
        <div className="field-wrap">
          <input className="field-input" type="email" placeholder="you@email.edu" autoComplete="email" />
        </div>
      </div>

      {/* Password */}
      <div className="field">
        <label className="field-label">Password</label>
        <div className="field-wrap">
          <input
            className="field-input has-toggle"
            type={showPw1 ? 'text' : 'password'}
            placeholder="Min. 8 characters"
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

        <div className="pw-strength" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`pw-bar ${strength > i ? strengthClass : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Confirm Password */}
      <div className="field">
        <label className="field-label">Confirm Password</label>
        <div className="field-wrap">

          <input
            className="field-input has-toggle"
            type={showPw2 ? 'text' : 'password'}
            placeholder="Repeat your password"
            autoComplete="new-password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />

          <button className="pw-toggle" type="button" onClick={() => setShowPw2((v) => !v)} aria-label={showPw2 ? 'Hide password' : 'Show password'}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {showPw2 ? (
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

    <Button onClick={handleClick} > Sign up </Button>

        <div className="divider">
            <div className="line" />
                    OR
            <div className="line" />
        </div>

      <GoogleSignupButton />

      <p className="signin-text">
        Already have an account? <Link href="/signup">Sign in here</Link>
      </p>
    </section>
  )
}