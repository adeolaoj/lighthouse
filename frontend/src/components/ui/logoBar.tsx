export default function LogoBar() {
    return (
      <div className="logo-bar">
        <div className="logo-icon" aria-hidden="true">
          {/* Keep your SVG inline OR replace with an <img /> if you prefer */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="18" height="18">
            <defs>
              <linearGradient id="lo-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#907AD6" />
                <stop offset="100%" stopColor="#DABFFF" />
              </linearGradient>
              <linearGradient id="lo-g2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7FDEFF" />
                <stop offset="100%" stopColor="#c0f0ff" />
              </linearGradient>
              <filter id="lo-glow">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <polygon points="62,32 96,10 96,28" fill="rgba(127,222,255,0.5)" />
            <polygon points="38,32 4,10 4,28" fill="rgba(218,191,255,0.45)" />
            <rect x="20" y="82" width="60" height="8" rx="3" fill="url(#lo-g1)" opacity="0.6" />
            <polygon points="35,82 38,44 62,44 65,82" fill="url(#lo-g1)" />
            <rect x="36" y="40" width="28" height="6" rx="2" fill="url(#lo-g1)" />
            <rect x="39" y="26" width="22" height="16" rx="3" fill="url(#lo-g2)" filter="url(#lo-glow)" />
            <polygon points="39,26 50,16 61,26" fill="url(#lo-g2)" filter="url(#lo-glow)" />
            <circle cx="50" cy="14" r="3" fill="#7FDEFF" filter="url(#lo-glow)" />
            <circle cx="50" cy="14" r="1.5" fill="white" opacity="0.95" />
          </svg>
        </div>
  
        <span className="logo-name">lighthouse</span>
      </div>
    )
  }