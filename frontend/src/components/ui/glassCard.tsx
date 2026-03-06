import React from 'react'

type GlassCardProps = {
  children: React.ReactNode
  className?: string
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return <section className={`glass-card ${className}`}>{children}</section>
}