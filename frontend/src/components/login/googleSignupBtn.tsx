'use client'

import { useAuthActions } from '@convex-dev/auth/react'

export default function GoogleSignupButton() {
  const { signIn } = useAuthActions()

  const handleClick = async () => {
    await signIn('google', { redirectTo: '/results' })
  }

  return (
    <button className="google-btn" type="button" onClick={handleClick}>
      <img className="google-icon" src="/web_neutral_rd_na.svg" alt="Google logo" />
      <span>Sign up with Google</span>
    </button>
  )
}
