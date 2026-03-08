'use client'

import { useAuthActions } from '@convex-dev/auth/react'

export default function GoogleLoginButton() {
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
      <img className="google-icon" src="/web_neutral_rd_na.svg" alt="Google logo" />
      <span>Sign in with Google</span>
    </button>
  )
}
