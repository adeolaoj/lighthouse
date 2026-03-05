export default function Hero() {
    return (
      <section className="hero">
        <div className="lh-icon" aria-hidden="true">
          {/* your big hero lighthouse SVG from HTML (kept inline) */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="60" height="60">
            <defs>
              <linearGradient id="hi-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7FDEFF" />
                <stop offset="50%" stopColor="#907AD6" />
                <stop offset="100%" stopColor="#4F518C" />
              </linearGradient>
              <linearGradient id="hi-g2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DABFFF" />
                <stop offset="100%" stopColor="#7FDEFF" />
              </linearGradient>
              <linearGradient id="hi-bR" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DABFFF" stopOpacity="0.55" />
                <stop offset="100%" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hi-bL" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#7FDEFF" stopOpacity="0.5" />
                <stop offset="100%" stopOpacity="0" />
              </linearGradient>
              <filter id="hi-g">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="hi-sg">
                <feGaussianBlur stdDeviation="4.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
  
            <g opacity="0.75">
              <polygon points="62,32 98,8 98,30" fill="url(#hi-bR)" />
              <polygon points="38,32 2,8 2,30" fill="url(#hi-bL)" />
            </g>
  
            <rect x="20" y="82" width="60" height="9" rx="3" fill="url(#hi-g1)" opacity="0.5" />
            <polygon points="35,82 38,44 62,44 65,82" fill="url(#hi-g1)" />
            <rect x="35" y="40" width="30" height="7" rx="2" fill="url(#hi-g1)" />
            <rect x="38" y="25" width="24" height="17" rx="4" fill="url(#hi-g2)" filter="url(#hi-sg)" />
            <polygon points="38,25 50,14 62,25" fill="url(#hi-g2)" filter="url(#hi-g)" />
            <circle cx="50" cy="13" r="4" fill="#DABFFF" filter="url(#hi-g)" />
            <circle cx="50" cy="13" r="2" fill="white" opacity="0.95" />
            <rect x="33" y="39" width="34" height="2.5" rx="1.25" fill="rgba(127,222,255,0.55)" />
          </svg>
        </div>
  
        <div className="badge">
          <div className="badge-dot" />
          Research Portal
        </div>
  
        <h1 className="create-title">Get started</h1>
        <p className="hero-sub">
          Create your account and start discovering research opportunities that match your academic profile
        </p>
      </section>
    )
  }