'use client'

import { useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../../backend/convex/_generated/api'

export default function ResultsPage() {
  const syncMe = useMutation(api.users.syncMe)

  useEffect(() => {
    syncMe()
  }, [syncMe])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Research Opportunities</h1>
      <p className="mt-2 text-gray-500">Opportunities will appear here.</p>
    </div>
  )
}
