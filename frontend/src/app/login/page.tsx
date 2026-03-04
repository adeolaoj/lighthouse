'use client'

/*
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useToken } from '../providers'
declare global {
  interface Window {
    google?: any
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { setToken } = useToken()

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!clientId) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID')
      return
    }

    const initGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          console.log('Google credential response:', response)
          if (response.credential) {
            setToken(response.credential)
            router.push('/results')
          }
        },
      })

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignIn'),
        { theme: 'outline', size: 'large' }
      )
    }

    if (window.google?.accounts?.id) {
      initGoogle()
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval)
          initGoogle()
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [router, setToken])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6">Sign in to Lighthouse</h1>
        <div id="googleSignIn" className="flex justify-center" />
        <p className="text-xs text-gray-500 mt-4">
          If the button doesn't load, check console for errors.
        </p>
      </div>
    </div>
  )
}
*/

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToken } from '../providers';

declare global {
  interface Window {
    google?: any;
  }
}

// ─── Icons from your attached design ─────────────────────────────────────────

const LogoLighthouseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="20" height="20" aria-hidden="true">
    <defs>
      <linearGradient id="logo-tG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="50%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>
      <linearGradient id="logo-lG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E879F9" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
      <linearGradient id="logo-bGR" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E879F9" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="logo-bGL" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
      </linearGradient>
      <filter id="logo-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="logo-softGlow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g opacity="0.7">
      <polygon points="62,32 96,10 96,28" fill="url(#logo-bGR)" />
      <polygon points="62,36 100,18 100,52" fill="url(#logo-bGR)" opacity="0.4" />
      <polygon points="38,36 0,18 0,52" fill="url(#logo-bGL)" opacity="0.4" />
      <polygon points="38,32 4,10 4,28" fill="url(#logo-bGL)" />
    </g>
    <rect x="20" y="82" width="60" height="8" rx="3" fill="url(#logo-tG)" opacity="0.6" />
    <polygon points="35,82 38,44 62,44 65,82" fill="url(#logo-tG)" />
    <rect x="38" y="62" width="24" height="5" rx="1.5" fill="rgba(255,255,255,0.12)" />
    <rect x="39" y="72" width="22" height="5" rx="1.5" fill="rgba(255,255,255,0.1)" />
    <rect x="36" y="40" width="28" height="6" rx="2" fill="url(#logo-tG)" />
    <rect x="39" y="26" width="22" height="16" rx="3" fill="url(#logo-lG)" filter="url(#logo-softGlow)" />
    <rect x="41" y="28" width="8" height="12" rx="2" fill="rgba(255,255,255,0.25)" />
    <polygon points="39,26 50,16 61,26" fill="url(#logo-lG)" filter="url(#logo-glow)" />
    <circle cx="50" cy="14" r="3" fill="#F472B6" filter="url(#logo-glow)" />
    <circle cx="50" cy="14" r="1.5" fill="white" opacity="0.8" />
    <rect x="34" y="39" width="32" height="2" rx="1" fill="rgba(167,139,250,0.5)" />
  </svg>
);

const HeroLighthouseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="72" height="72" aria-hidden="true">
    <defs>
      <linearGradient id="hero-tG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="50%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>
      <linearGradient id="hero-lG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E879F9" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
      <linearGradient id="hero-bGR" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E879F9" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="hero-bGL" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
      </linearGradient>
      <filter id="hero-glow">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="hero-softGlow">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g opacity="0.75">
      <polygon points="62,32 96,10 96,28" fill="url(#hero-bGR)" />
      <polygon points="62,36 100,18 100,52" fill="url(#hero-bGR)" opacity="0.4" />
      <polygon points="38,36 0,18 0,52" fill="url(#hero-bGL)" opacity="0.4" />
      <polygon points="38,32 4,10 4,28" fill="url(#hero-bGL)" />
    </g>
    <rect x="20" y="82" width="60" height="8" rx="3" fill="url(#hero-tG)" opacity="0.6" />
    <polygon points="35,82 38,44 62,44 65,82" fill="url(#hero-tG)" />
    <rect x="38" y="62" width="24" height="5" rx="1.5" fill="rgba(255,255,255,0.12)" />
    <rect x="39" y="72" width="22" height="5" rx="1.5" fill="rgba(255,255,255,0.1)" />
    <rect x="36" y="40" width="28" height="6" rx="2" fill="url(#hero-tG)" />
    <rect x="39" y="26" width="22" height="16" rx="3" fill="url(#hero-lG)" filter="url(#hero-softGlow)" />
    <rect x="41" y="28" width="8" height="12" rx="2" fill="rgba(255,255,255,0.25)" />
    <polygon points="39,26 50,16 61,26" fill="url(#hero-lG)" filter="url(#hero-glow)" />
    <circle cx="50" cy="14" r="3" fill="#F472B6" filter="url(#hero-glow)" />
    <circle cx="50" cy="14" r="1.5" fill="white" opacity="0.9" />
    <rect x="34" y="39" width="32" height="2" rx="1" fill="rgba(167,139,250,0.5)" />
  </svg>
);


// ─── Combined Next.js Login Page ─────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useToken();

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID');
      return;
    }

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          console.log('Google credential response:', response);
          if (response.credential) {
            setToken(response.credential);
            router.push('/results'); // ✅ go to results page
          }
        },
      });

      const el = document.getElementById('googleSignIn');
      if (!el) return;

      // clear in case of hot reload / re-render
      el.innerHTML = '';

      // Render the official Google button inside our styled slot
      window.google.accounts.id.renderButton(el, {
       //theme: 'filled_black',
       size: 'large',
       type: 'standard',
       shape: 'pill',
       text: 'signin_with',
       width: 320,
      
      });
    };

    // If the GSI script is already present, init. Otherwise poll until it is.
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [router, setToken]);

  const handleGoogleLogin = () => {
    window.google.accounts.id.prompt()
  }

  return (
    <div className="lh-root">
        {/* Ambient orbs */}
        <div className="lh-orb lh-orb-1" aria-hidden="true" />
        <div className="lh-orb lh-orb-2" aria-hidden="true" />
        <div className="lh-orb lh-orb-3" aria-hidden="true" />

        {/* Top-left logo */}
        <div className="lh-logo-bar">
          <div className="lh-logo-icon">
            <LogoLighthouseIcon />
          </div>
          <span className="lh-logo-name">lighthouse</span>
        </div>

        {/* Main content */}
        <main className="lh-content">
          <div className="lh-hero-icon">
            <HeroLighthouseIcon />
          </div>

          <div className="lh-badge" role="note">
            <div className="lh-badge-dot" aria-hidden="true" />
            Research Portal
          </div>

          <h1 className="lh-heading">Welcome.</h1>

          <p className="lh-subtitle">
            Sign in to explore research opportunities matched to your academic profile.
          </p>











          {/* This keeps your design, but renders the real Google button inside it */}
          
          {/*<div className="lh-google-slot" aria-label="Continue with Google">
            <div id="googleSignIn" />
          </div>8*/}


          <div>
            <button className="google-btn" onClick={handleGoogleLogin}>
              <img src="/web_neutral_rd_na.svg" alt="Google"/>
              Sign in with Google
            </button>
          </div>




















          <p className="lh-help">
            If the button doesn&apos;t load, check console for errors.
          </p>

          <p className="lh-signup">
            Don&apos;t have an account?
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // keep your existing behavior here if you want
              }}
            >
              Create one →
            </a>
          </p>

          <div className="lh-line-accent" aria-hidden="true" />
        </main>
      </div>
  );
}