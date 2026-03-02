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

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  html, body, #root, #__next {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .lh-root {
    width: 100%;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #0c0a18;
    color: #ede8ff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .lh-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 15% 10%, rgba(129,140,248,0.14) 0%, transparent 55%),
      radial-gradient(ellipse 60% 70% at 85% 85%, rgba(232,121,249,0.12) 0%, transparent 55%),
      radial-gradient(ellipse 50% 50% at 50% 50%, rgba(167,139,250,0.05) 0%, transparent 65%),
      radial-gradient(ellipse 40% 40% at 70% 20%, rgba(244,114,182,0.07) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .lh-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: radial-gradient(circle, rgba(167,139,250,0.07) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
    z-index: 0;
  }

  .lh-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
    z-index: 0;
    animation: lh-drift 14s ease-in-out infinite alternate;
  }
  .lh-orb-1 {
    width: 500px; height: 500px;
    top: -150px; left: -100px;
    background: radial-gradient(circle, rgba(129,140,248,0.2), transparent 70%);
  }
  .lh-orb-2 {
    width: 450px; height: 450px;
    bottom: -120px; right: -80px;
    background: radial-gradient(circle, rgba(232,121,249,0.18), transparent 70%);
    animation-delay: -7s;
  }
  .lh-orb-3 {
    width: 300px; height: 300px;
    top: 30%; left: 55%;
    background: radial-gradient(circle, rgba(244,114,182,0.12), transparent 70%);
    animation-delay: -3.5s;
  }

  @keyframes lh-drift {
    0%   { transform: translate(0, 0) scale(1); }
    100% { transform: translate(40px, 25px) scale(1.08); }
  }

  .lh-logo-bar {
    position: fixed;
    top: 28px; left: 32px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 10;
    animation: lh-fadeIn 0.5s ease both;
  }
  .lh-logo-icon {
    width: 30px; height: 30px;
    background: linear-gradient(135deg, #A78BFA, #E879F9);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .lh-logo-name {
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #ede8ff;
    letter-spacing: 0.02em;
  }

  .lh-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .lh-hero-icon {
    margin-bottom: 28px;
    animation: lh-fadeUp 0.7s 0.05s cubic-bezier(0.16,1,0.3,1) both;
    filter: drop-shadow(0 0 18px rgba(232,121,249,0.35)) drop-shadow(0 0 40px rgba(167,139,250,0.2));
  }

  .lh-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(167,139,250,0.08);
    border: 1px solid rgba(167,139,250,0.18);
    border-radius: 100px;
    padding: 5px 14px 5px 9px;
    font-size: 11px;
    font-weight: 500;
    color: #A78BFA;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 32px;
    animation: lh-fadeUp 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both;
  }
  .lh-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: linear-gradient(135deg, #A78BFA, #E879F9);
    box-shadow: 0 0 8px #A78BFA;
    animation: lh-pulse 2s ease-in-out infinite;
  }

  @keyframes lh-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.75); }
  }

  .lh-heading {
    font-family: 'Syne', sans-serif;
    font-size: clamp(52px, 8vw, 84px);
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -0.03em;
    margin-bottom: 20px;
    background: linear-gradient(110deg, #818CF8 0%, #A78BFA 30%, #E879F9 65%, #F472B6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: lh-fadeUp 0.7s 0.15s cubic-bezier(0.16,1,0.3,1) both;
  }

  .lh-subtitle {
    font-size: 16px;
    color: #7b6fa0;
    font-weight: 300;
    max-width: 360px;
    line-height: 1.65;
    margin-bottom: 48px;
    animation: lh-fadeUp 0.7s 0.22s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* Keep the “Continue with Google” area looking like your design */
  .lh-google-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 40px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(167,139,250,0.22);
    border-radius: 100px;
    backdrop-filter: blur(8px);
    animation: lh-fadeUp 0.7s 0.3s cubic-bezier(0.16,1,0.3,1) both;
    position: relative;
    overflow: hidden;
  }
  .lh-google-slot:hover {
    border-color: rgba(167,139,250,0.5);
    box-shadow: 0 0 50px rgba(167,139,250,0.18), 0 8px 32px rgba(0,0,0,0.3);
    transform: translateY(-2px);
    transition: 0.25s;
  }

  .lh-signup {
    margin-top: 28px;
    font-size: 13px;
    color: #7b6fa0;
    animation: lh-fadeUp 0.7s 0.38s cubic-bezier(0.16,1,0.3,1) both;
  }
  .lh-signup a {
    color: #A78BFA;
    text-decoration: none;
    font-weight: 500;
    margin-left: 4px;
    transition: color 0.2s;
  }
  .lh-signup a:hover { color: #E879F9; }

  .lh-line-accent {
    width: 1px;
    height: 56px;
    background: linear-gradient(to bottom, rgba(167,139,250,0.25), transparent);
    margin-top: 44px;
    animation: lh-fadeIn 1s 0.5s both;
  }

  .lh-help {
    margin-top: 10px;
    font-size: 12px;
    color: rgba(123, 111, 160, 0.9);
    animation: lh-fadeUp 0.7s 0.42s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes lh-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lh-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

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
       theme: 'filled_black',
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

  return (
    <>
      <style>{styles}</style>

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
          <div className="lh-google-slot" aria-label="Continue with Google">
            <div id="googleSignIn" />
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
    </>
  );
}