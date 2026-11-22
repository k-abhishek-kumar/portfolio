import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SECTIONS } from '../data/sections.js'
import { useSectionAccess } from '../hooks/useSectionAccess.jsx'

function NavEntry({ section, active }) {
  const { locked, ask, dialog } = useSectionAccess(section)

  const className = `group flex items-center gap-2 py-1 font-mono text-[11px] tracking-[0.16em] uppercase whitespace-nowrap transition-colors duration-300 ${
    active ? 'text-editorial-white' : 'text-editorial-muted hover:text-editorial-white'
  }`

  const content = (
    <>
      <span
        aria-hidden="true"
        className={
          active
            ? 'w-1.5 h-1.5 rounded-full bg-ducati-red shadow-[0_0_6px_rgba(215,25,32,0.9)]'
            : 'w-1 h-1 rounded-full bg-transparent group-hover:bg-ducati-red transition-colors duration-300'
        }
      />
      {section.label}
      {section.locked && (
        <span
          className="material-symbols-outlined text-[13px] -ml-0.5 text-editorial-muted group-hover:text-ducati-red transition-colors"
          aria-hidden="true"
        >
          {locked ? 'lock' : 'lock_open'}
        </span>
      )}
    </>
  )

  if (locked) {
    return (
      <>
        <button type="button" onClick={ask} aria-haspopup="dialog" aria-label={`${section.label} (locked)`} className={className}>
          {content}
        </button>
        {dialog}
      </>
    )
  }

  return (
    <Link
      to={section.to ?? '/'}
      state={section.to ? undefined : { section: section.id }}
      aria-current={active ? 'page' : undefined}
      className={className}
    >
      {content}
    </Link>
  )
}

/**
 * Horizontal section navigation for the top bar — the same sections as the landing page menu.
 * `activeId` marks the current section. Sections without their own page link back to the
 * landing page, which opens with that section selected. Locked sections ask for a password.
 */
export default function SiteNav({ activeId }) {
  const navRef = useRef(null)

  // On narrow screens the bar scrolls sideways — keep the current section in view.
  useEffect(() => {
    const center = () => {
      const nav = navRef.current
      const current = nav?.querySelector('[aria-current="page"]')
      if (!nav || !current) return
      nav.scrollLeft = current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2
    }
    center()
    window.addEventListener('resize', center)
    return () => window.removeEventListener('resize', center)
  }, [activeId])

  return (
    <nav
      ref={navRef}
      aria-label="Sections"
      className="relative flex items-center gap-6 sm:gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {SECTIONS.map((section) => (
        <NavEntry key={section.id} section={section} active={section.id === activeId} />
      ))}
    </nav>
  )
}
