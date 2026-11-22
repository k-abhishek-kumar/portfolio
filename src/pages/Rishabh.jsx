import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteNav from '../components/SiteNav.jsx'
import { isUnlocked, lock } from '../lib/access.js'

export default function Rishabh() {
  const navigate = useNavigate()
  const allowed = isUnlocked()

  useEffect(() => {
    if (allowed) document.title = 'RishAbh — TITAN'
  }, [allowed])

  // Anyone arriving without having unlocked goes back to the landing page.
  if (!allowed) return <Navigate to="/" replace />

  return (
    <div className="relative min-h-screen flex flex-col bg-obsidian text-editorial-white">
      <SiteHeader alwaysShowChildren>
        <SiteNav activeId="rishabh" />
      </SiteHeader>

      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-8 pb-24 text-center">
        <span className="material-symbols-outlined text-ducati-red text-[28px]" aria-hidden="true">
          lock_open
        </span>
        <h1 className="font-headline text-5xl sm:text-6xl font-extrabold uppercase tracking-[-0.03em]">RishAbh</h1>
        <p className="font-mono text-[11px] tracking-[0.25em] text-editorial-muted uppercase">
          Private space // unlocked
        </p>
        <p className="font-body text-editorial-muted max-w-md leading-relaxed">
          Nothing here yet — this page is ready for whatever you want to keep private.
        </p>
        <button
          type="button"
          onClick={() => {
            lock()
            navigate('/', { replace: true })
          }}
          className="mt-2 px-5 py-3 border border-white/15 hover:border-ducati-red font-mono text-[11px] tracking-[0.2em] text-editorial-muted hover:text-editorial-white uppercase transition-colors"
        >
          Lock &amp; exit
        </button>
      </main>
    </div>
  )
}
