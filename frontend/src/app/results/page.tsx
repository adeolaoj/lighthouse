/*
'use client'

import { useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from "@convex/_generated/api";

export default function ResultsPage() {
  const me = useQuery(api.users.getMe);
  const syncMe = useMutation(api.users.syncMe)

  useEffect(() => {
    if (me?.identity && !me?.profile) {
      syncMe()
    }
  }, [me, syncMe])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Research Opportunities</h1>
      <p className="mt-2 text-gray-500">Opportunities will appear here.</p>
    </div>
  )
}
  */

"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function ResultsPage() {
  const me = useQuery(api.users.getMe);
  const syncMe = useMutation(api.users.syncMe);

  useEffect(() => {
    if (me?.identity && !me?.profile) {
      syncMe();
    }
  }, [me, syncMe]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Research Opportunities</h1>

      <div className="mt-6 rounded border p-4">
        <p className="font-semibold">Debug: getMe()</p>
        <pre className="mt-2 text-xs whitespace-pre-wrap">
          {JSON.stringify(me, null, 2)}
        </pre>
      </div>

      <p className="mt-6 text-gray-500">Opportunities will appear here.</p>
    </div>
  );
}
