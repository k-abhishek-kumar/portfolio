import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { SECTIONS } from '../data/sections.js'
import { useSectionAccess } from '../hooks/useSectionAccess.jsx'
import slide1 from '../assets/images/slide-1.jpg'
import slide2 from '../assets/images/slide-2.jpg'
import slide3 from '../assets/images/slide-3.jpg'
import slide4 from '../assets/images/slide-4.jpg'
import slide5 from '../assets/images/slide-5.jpg'

const SLIDES = [slide1, slide2, slide3, slide4, slide5]
const SLIDE_INTERVAL_MS = 5000

const WORDS = ['TRADER', 'ENGINEER', 'RIDER']
const WORD_INTERVAL_MS = 1500

function BackgroundSlideshow() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-obsidian">
      {SLIDES.map((src, i) => (
        <img key={src} src={src} alt="" className={`bg-slide ${i === active ? 'is-active' : ''}`} />
      ))}
      <div className="absolute inset-0 left-bleed" />
      <div className="absolute inset-0 top-bleed" />
      <div className="absolute inset-0 bottom-bleed" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(215,25,32,0.10)_0%,rgba(18,19,21,0.45)_55%,rgba(18,19,21,0.85)_100%)]" />
    </div>
  )
}

const HEADLINE_SIZE =
  'font-headline text-[10.5vw] sm:text-6xl xl:text-7xl 2xl:text-[80px] leading-[0.95] tracking-[-0.03em] font-extrabold whitespace-nowrap text-editorial-white'

/** One word at a time on a single line, swapping every 1.5 s. Static (stacked) for reduced motion. */
function RotatingHeadline() {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), WORD_INTERVAL_MS)
    return () => clearInterval(id)
  }, [reduced])

  if (reduced) {
    return (
      <h1 className={`${HEADLINE_SIZE} mb-8 flex flex-col space-y-1`}>
        {WORDS.map((word) => (
          <span key={word}>
            {word}
            <span className="text-ducati-red">.</span>
          </span>
        ))}
      </h1>
    )
  }

  const previous = (index + WORDS.length - 1) % WORDS.length
  return (
    <h1 className={`${HEADLINE_SIZE} mb-8 grid`}>
      <span className="sr-only">Trader. Engineer. Rider.</span>
      {/* All words share one grid cell, so the line never changes size; only the active one shows. */}
      {WORDS.map((word, i) => (
        <span
          key={word}
          aria-hidden="true"
          className={`[grid-area:1/1] transition-[opacity,transform] duration-500 ease-cinematic ${
            i === index
              ? 'opacity-100 translate-y-0'
              : i === previous
                ? 'opacity-0 -translate-y-[0.3em]'
                : 'opacity-0 translate-y-[0.3em]'
          }`}
        >
          {word}
          <span className="text-ducati-red">.</span>
        </span>
      ))}
    </h1>
  )
}

/**
 * One entry in the main menu. The highlighted entry follows the mouse, keyboard focus and
 * ↑/↓ — like a game's start screen — with a red selector arrow and a slanted glow behind it.
 */
function MenuItem({ section, index, highlighted, onHighlight }) {
  const { locked, ask, dialog } = useSectionAccess(section)

  const className = `group relative flex w-full items-center py-2 pl-9 pr-10 text-left outline-none focus-visible:outline-none animate-menu-in cursor-pointer transition-colors duration-300 ${
    highlighted ? 'text-editorial-white' : 'text-editorial-white/40'
  }`
  const style = { animationDelay: `${300 + index * 70}ms` }

  const content = (
    <>
      {/* Slanted highlight band */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 bg-gradient-to-r from-ducati-red/30 via-ducati-red/10 to-transparent [clip-path:polygon(0_0,100%_0,90%_100%,0_100%)] transition-opacity duration-300 ${
          highlighted ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span
        aria-hidden="true"
        className={`absolute left-0 inset-y-1 w-[3px] bg-ducati-red shadow-[0_0_12px_rgba(215,25,32,0.9)] transition-[opacity,transform] duration-300 ease-cinematic origin-center ${
          highlighted ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
        }`}
      />
      {/* Selector arrow */}
      <span
        aria-hidden="true"
        className={`absolute left-4 h-3 w-2.5 bg-ducati-red [clip-path:polygon(0_0,100%_50%,0_100%)] transition-[opacity,transform] duration-300 ease-cinematic ${
          highlighted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
        }`}
      />
      <span
        className={`font-body text-sm md:text-base tracking-[0.08em] leading-none transition-transform duration-300 ease-cinematic ${
          highlighted ? 'font-medium translate-x-2' : 'font-normal translate-x-0'
        }`}
      >
        {section.label}
      </span>
      {section.locked && (
        <span
          className={`material-symbols-outlined ml-3 text-[18px] transition-colors duration-300 ${
            highlighted ? 'text-ducati-red' : 'text-editorial-white/40'
          }`}
          aria-hidden="true"
        >
          {locked ? 'lock' : 'lock_open'}
        </span>
      )}
    </>
  )

  const handlers = {
    'data-menu-item': '',
    onMouseEnter: () => onHighlight(section.id),
    onFocus: () => onHighlight(section.id),
    style,
    className,
  }

  if (locked) {
    return (
      <>
        <button type="button" {...handlers} onClick={ask} aria-haspopup="dialog" aria-label={`${section.label} (locked)`}>
          {content}
        </button>
        {dialog}
      </>
    )
  }
  if (section.to) {
    return (
      <Link to={section.to} {...handlers}>
        {content}
      </Link>
    )
  }
  return (
    <button type="button" {...handlers} onClick={() => onHighlight(section.id)}>
      {content}
    </button>
  )
}

export default function Home() {
  // Arriving from another page's top nav can pre-select a section; otherwise default to garage.
  const requested = useLocation().state?.section
  const initialId = SECTIONS.some((s) => s.id === requested) ? requested : 'garage'
  const [highlightedId, setHighlightedId] = useState(initialId)
  const menuRef = useRef(null)

  // ↑ / ↓ move through the menu (wrapping), like a controller d-pad. Enter activates natively.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      if (document.querySelector('dialog[open]') || event.target.closest?.('input, textarea, select')) return
      const items = [...(menuRef.current?.querySelectorAll('[data-menu-item]') ?? [])]
      if (!items.length) return
      event.preventDefault()
      // Move from the focused entry, or from the highlighted one if the mouse is driving.
      const focused = items.indexOf(document.activeElement)
      const from = focused !== -1 ? focused : SECTIONS.findIndex((s) => s.id === highlightedId)
      const step = event.key === 'ArrowDown' ? 1 : -1
      items[(from + step + items.length) % items.length]?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [highlightedId])

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-obsidian overflow-x-hidden">
      <BackgroundSlideshow />

      <SiteHeader sublabel="INDEX / 2024">
        <span>45.4642° N, 9.1900° E</span>
        <span className="text-editorial-subtle">/</span>
        <span className="hover:text-editorial-white transition-colors cursor-default">BORGO PANIGALE</span>
        <span className="text-editorial-subtle">/</span>
        <span className="text-editorial-white">VOL. 01</span>
      </SiteHeader>

      <main className="relative flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-8 md:px-16 z-20 py-8 lg:py-4">
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center select-none py-4">
          <div className="flex items-center gap-2.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-ducati-red inline-block shadow-[0_0_8px_rgba(215,25,32,0.8)]" />
            <span className="font-mono text-[11px] tracking-[0.25em] text-editorial-muted uppercase">
              PORTFOLIO // SELECTED WORK
            </span>
          </div>

          <RotatingHeadline />

          <p className="font-body text-base md:text-lg text-editorial-muted font-light max-w-md leading-relaxed mb-10">
            Building things. Trading ideas. Living beyond the ordinary.
          </p>

          <nav ref={menuRef} className="flex flex-col gap-1 w-full max-w-[22rem] isolate" aria-label="Sections">
            {SECTIONS.map((section, index) => (
              <MenuItem
                key={section.id}
                section={section}
                index={index}
                highlighted={section.id === highlightedId}
                onHighlight={setHighlightedId}
              />
            ))}
          </nav>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
