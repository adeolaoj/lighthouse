'use client'

import { ConvexProviderWithAuth, ConvexReactClient} from 'convex/react'
import { useCallback, useMemo, useState, createContext, useContext } from 'react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const TokenContext = createContext<{
  token: string | null
  setToken: (t: string | null) => void
}>({ token: null, setToken: () => {} })

export function useToken() {
  return useContext(TokenContext)
}

function useGoogleAuth() {
  const { token } = useToken()
  const fetchAccessToken = useCallback(async () => token, [token])
  return useMemo(() => ({
    isLoading: false,
    isAuthenticated: !!token,
    fetchAccessToken,
  }), [token, fetchAccessToken])
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider>
        {children}
      </ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  )
}