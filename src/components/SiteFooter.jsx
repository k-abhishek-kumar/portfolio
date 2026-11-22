import { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * Understated footer. The "atmosphere" toggle only changes its own state for now
 * (no audio asset yet).
 */
export default function SiteFooter({ className = 'relative' }) {
  const [atmosphere, setAtmosphere] = useState(false)

  return (
    <footer
      className={`${className} z-30 w-full px-8 md:px-16 pb-8 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-editorial-muted gap-4 pointer-events-auto`}
    >
      <div className="flex items-center gap-6 font-mono text-[10px] tracking-[0.2em]">
        <span className="text-editorial-subtle hover:text-editorial-muted transition-colors">
          © TITAN CORE // ALL RIGHTS RESERVED
        </span>
        <span className="hidden md:inline text-editorial-subtle">/</span>
        <span className="hidden md:inline text-editorial-subtle">RESTRAINT &amp; FORM</span>
      </div>
      <div className="flex items-center gap-6 font-mono text-[10px] tracking-[0.2em]">
        <button
          type="button"
          onClick={() => setAtmosphere((on) => !on)}
          aria-pressed={atmosphere}
          className="group flex items-center gap-2 text-editorial-muted hover:text-editorial-white transition-colors"
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full transition-colors ${
              atmosphere
                ? 'bg-ducati-red animate-pulse'
                : 'bg-editorial-subtle group-hover:bg-ducati-red'
            }`}
          />
          <span>{atmosphere ? 'ATMOSPHERE: 44.1 kHz' : 'ATMOSPHERE: MUTE'}</span>
        </button>
        <span className="text-editorial-subtle">/</span>
        <Link className="text-editorial-muted hover:text-editorial-white transition-colors" to="/connect">
          INQUIRE →
        </Link>
      </div>
    </footer>
  )
}
