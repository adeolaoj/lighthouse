'use client'

import Background from '@/components/ui/background'
import LogoBar from '@/components/ui/logoBar'
import BackLink from '@/components/login/backLink'
import Hero from '@/components/signup/header'
import LoginCard from '@/components/signup/loginCard'
import GlassCard from '@/components/ui/glassCard'

export default function SignupPage() {
    return (
        <div className="lh-root">
        <Background />
  
        <LogoBar />
        <BackLink href="/login" label="Back to sign up" />
  
        <main className="page">
          <Hero />
          {/*<GlassCard>*/}
          < LoginCard />
          {/*</GlassCard>*/}
          <div className="line-accent" />
        </main>
      </div>
    )
  }

