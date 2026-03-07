'use client'

import { ConvexProviderWithAuth, ConvexReactClient, ConvexProvider} from 'convex/react'
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
  const [token, setToken] = useState<string | null>(null)
  return (
     <TokenContext.Provider value={{ token, setToken }}>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </TokenContext.Provider>

    // TODO: CHANGE BACK ONCE GOOGLE AUTH IS WORKING!!!!!!!
    // <TokenContext.Provider value={{ token, setToken }}>
    //   <ConvexProviderWithAuth client={convex} useAuth={useGoogleAuth}>
    //     {children}
    //   </ConvexProviderWithAuth>
    // </TokenContext.Provider>
  )
}
