'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import Image from 'next/image'

export default function GoogleSignupButton() {
  const { signIn, signOut } = useAuthActions()

  const handleClick = async () => {
    try {
      await signOut()
    } catch {
      // Ignore sign-out errors and continue with OAuth.
    }
    await signIn('google', { redirectTo: '/results' })
  }

  return (
    <button className="google-btn" type="button" onClick={handleClick}>
      <Image src="/web_neutral_rd_na.svg" alt="Google logo" width={20} height={20} className="google-icon" />
      <span>Sign up with Google</span>
    </button>
  )
}
