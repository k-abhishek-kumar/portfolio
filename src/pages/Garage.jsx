import { useCallback, useEffect, useRef, useState } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteNav from '../components/SiteNav.jsx'
import { useViewport } from '../hooks/useViewport.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { vehicles } from '../data/garage.js'
import heroImage from '../assets/images/garage-hero.jpg'

const ASPECT = 16 / 9 // aspect ratio of the hero image
const DESKTOP_MIN = 1024 // px — side panel above this width, bottom sheet below
const PANEL_FRACTION = 0.42
const PANEL_MAX = 640

// Phones: no wide shot — one bike at a time, swipe to browse, "Show more" opens the dossier.
const PHONE_MAX = 768 // px — below this width the phone layout is used
const PHONE_HEADER = 104 // px reserved at the top for the logo + nav
const PHONE_CONTROLS = 152 // px reserved at the bottom for the arrows, dots and "Show more"
const SWIPE_MIN = 48 // px of horizontal travel that counts as a swipe

// Bounding box of all vehicles on the hero image (% of image) — what the wide shot frames.
const OVERVIEW_RECT = { x: 4, y: 36, w: 91, h: 50 }
const MIN_OVERVIEW_SCALE = 0.6 // never shrink the wide shot below this (very narrow screens)

/**
 * The "world" is the hero image at cover size, so percentage-based hotspots always line
 * up with the image. The camera is a single transform (translate + scale + tiny roll) on
 * that world — GPU-friendly and interruptible. Both the wide shot and each vehicle close-up
 * are just "frame this rectangle", so the wide shot always shows every vehicle.
 */
function computeCamera(vehicle, vw, vh, reducedMotion, details = false) {
  const W = Math.max(vw, vh * ASPECT)
  const H = W / ASPECT

  const phone = vw < PHONE_MAX
  const desktop = vw >= DESKTOP_MIN
  const panelW = desktop ? Math.min(vw * PANEL_FRACTION, PANEL_MAX) : 0

  // Space the camera may use, where the subject should land, and how tightly to frame it.
  let frame
  let targetX
  let targetY
  if (phone) {
    // Always one bike, filling the width between the header and the controls (or the sheet).
    const bottom = details ? vh * 0.56 : PHONE_CONTROLS
    const availH = Math.max(120, vh - PHONE_HEADER - bottom)
    frame = { availW: vw, availH, fillW: 0.94, fillH: 0.9, minScale: 0 }
    targetX = vw / 2
    targetY = PHONE_HEADER + availH / 2
  } else {
    frame = vehicle
      ? {
          availW: vw - panelW,
          availH: desktop ? vh : vh * 0.44, // bottom sheet takes the rest on tablets
          fillW: 0.94,
          fillH: 0.86,
          minScale: 0,
        }
      : { availW: vw, availH: vh, fillW: 0.94, fillH: 0.7, minScale: MIN_OVERVIEW_SCALE }
    // Centred in the free space (vehicle: beside the panel; wide shot: slightly below centre).
    targetX = frame.availW / 2
    targetY = vehicle ? (desktop ? vh / 2 : frame.availH / 2 + 36) : vh * 0.54
  }

  const { x, y, w, h } = vehicle ? vehicle.hotspot : OVERVIEW_RECT
  const rectW = (w / 100) * W
  const rectH = (h / 100) * H
  const scale = Math.max(
    frame.minScale,
    Math.min(3.2, (frame.fillW * frame.availW) / rectW, (frame.fillH * frame.availH) / rectH),
  )

  // Vehicle centre relative to the world centre, in px.
  const cx = ((x + w / 2) / 100 - 0.5) * W
  const cy = ((y + h / 2) / 100 - 0.5) * H

  return {
    W,
    H,
    scale,
    tx: targetX - vw / 2 - scale * cx,
    ty: targetY - vh / 2 - scale * cy,
    tilt: reducedMotion || !vehicle ? 0 : vehicle.tilt,
  }
}

const CORNERS = [
  'top-0 left-0 border-t-2 border-l-2',
  'top-0 right-0 border-t-2 border-r-2',
  'bottom-0 left-0 border-b-2 border-l-2',
  'bottom-0 right-0 border-b-2 border-r-2',
]

function Hotspot({ vehicle, hidden, buttonRef, onSelect }) {
  const { x, y, w, h } = vehicle.hotspot
  return (
    <button
      ref={buttonRef}
      type="button"
      tabIndex={hidden ? -1 : 0}
      aria-label={`Inspect ${vehicle.name}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(vehicle.id)
      }}
      className={`group absolute outline-none cursor-pointer transition-opacity duration-500 ${
        hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
    >
      <span className="absolute inset-0 bg-ducati-red/0 group-hover:bg-ducati-red/[0.05] group-focus-visible:bg-ducati-red/[0.05] transition-colors duration-300" />
      {CORNERS.map((c) => (
        <span
          key={c}
          className={`absolute w-6 h-6 border-ducati-red opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 ${c}`}
        />
      ))}
    </button>
  )
}

function Dossier({ vehicle, index, total, phone, onBack, onCycle }) {
  return (
    <div className="animate-panel-in px-6 sm:px-8 lg:px-12 pt-6 lg:pt-28 pb-10 flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center gap-2 px-3 py-2 border border-white/15 hover:border-ducati-red text-editorial-muted hover:text-editorial-white font-mono text-[11px] tracking-[0.18em] uppercase transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-ducati-red" aria-hidden="true">
            {phone ? 'keyboard_arrow_down' : 'fullscreen_exit'}
          </span>
          {phone ? 'Hide details' : 'Wide view'}
        </button>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.18em] text-editorial-muted">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => onCycle(-1)}
              aria-label="Previous vehicle"
              className="w-9 h-9 border border-white/15 hover:border-ducati-red flex items-center justify-center text-editorial-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={() => onCycle(1)}
              aria-label="Next vehicle"
              className="w-9 h-9 border border-white/15 hover:border-ducati-red flex items-center justify-center text-editorial-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-headline text-3xl sm:text-4xl xl:text-5xl font-extrabold uppercase leading-[1] tracking-[-0.02em] text-editorial-white">
          {vehicle.name}
        </h2>
        <p className="font-mono text-[11px] tracking-[0.16em] text-ducati-red uppercase">{vehicle.colorway}</p>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        {vehicle.stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-low/80 border border-white/5 p-4 flex flex-col gap-2">
            <dt className="font-mono text-[9px] tracking-[0.18em] text-editorial-muted uppercase">{stat.label}</dt>
            <dd className="flex flex-col gap-1">
              <span
                className={`font-headline text-xl font-bold leading-tight ${stat.accent ? 'text-primary' : 'text-editorial-white'}`}
              >
                {stat.main}
              </span>
              <span className="font-body text-xs text-editorial-muted leading-snug">{stat.sub}</span>
            </dd>
          </div>
        ))}
      </dl>

      <section className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-editorial-muted uppercase">
          <span className="material-symbols-outlined text-[16px] text-primary" aria-hidden="true">psychology</span>
          Operational role
        </h3>
        <p className="font-body text-body-md text-editorial-white/90 leading-relaxed">{vehicle.role}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-primary uppercase">
          <span className="w-1.5 h-1.5 bg-ducati-red" />
          Mechanical dossier
        </h3>
        <ul className="flex flex-col gap-3 font-body text-body-sm text-editorial-muted">
          {vehicle.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5" aria-hidden="true">
                check_circle
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="pt-4 border-t border-white/10 font-mono text-[10px] tracking-[0.16em] text-editorial-subtle uppercase">
        {vehicle.footnote}
      </p>
    </div>
  )
}

export default function Garage() {
  // `focusId` is the current vehicle; `open` means the dossier is showing. On desktop/tablet
  // "closed" is the wide view; on phones it is the one-bike-at-a-time browsing view.
  const [focusId, setFocusId] = useState(vehicles[0].id)
  const [open, setOpen] = useState(false)
  const [displayId, setDisplayId] = useState(null) // keeps the dossier mounted while it fades out
  const [session, setSession] = useState(0) // bumps on every open so the dossier re-animates
  const { width: vw, height: vh } = useViewport()
  const reducedMotion = useReducedMotion()
  const isPhone = vw < PHONE_MAX

  const hotspotRefs = useRef({})
  const panelRef = useRef(null)
  const showMoreRef = useRef(null)
  const wasOpen = useRef(false)
  const swipe = useRef({ x: 0, y: 0, active: false, swiped: false })

  const focused = vehicles.find((v) => v.id === focusId) ?? vehicles[0]
  const selected = open ? focused : null
  const displayed = vehicles.find((v) => v.id === displayId) ?? null
  const selectedIndex = selected ? vehicles.indexOf(selected) : -1
  const displayedIndex = displayed ? vehicles.indexOf(displayed) : -1
  const camera = isPhone
    ? computeCamera(focused, vw, vh, reducedMotion, open)
    : computeCamera(selected, vw, vh, reducedMotion)

  const select = useCallback((id) => {
    if (id) {
      setFocusId(id)
      setOpen(true)
      setDisplayId(id)
      setSession((s) => s + 1)
    } else {
      setOpen(false)
    }
  }, [])

  const cycle = useCallback(
    (direction) => {
      const current = vehicles.findIndex((v) => v.id === focusId)
      const next = vehicles[(current + direction + vehicles.length) % vehicles.length].id
      setFocusId(next)
      if (open) {
        setDisplayId(next)
        setSession((s) => s + 1)
      }
    },
    [focusId, open],
  )

  useEffect(() => {
    document.title = 'Garage — TITAN'
  }, [])

  // Keyboard: Esc = close the dossier, ←/→ = previous / next vehicle.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!open && !isPhone) return
      if (e.key === 'Escape') {
        if (open) select(null)
      } else if (e.key === 'ArrowRight') cycle(1)
      else if (e.key === 'ArrowLeft') cycle(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, isPhone, select, cycle])

  // Focus management: into the dossier when it opens, back to its trigger when it closes.
  useEffect(() => {
    if (open) panelRef.current?.focus({ preventScroll: true })
    else if (wasOpen.current) {
      const trigger = isPhone ? showMoreRef.current : hotspotRefs.current[focusId]
      trigger?.focus({ preventScroll: true })
    }
    wasOpen.current = open
    // Deliberately keyed on `open` only: it should react to the dossier opening/closing, nothing else.
  }, [open])

  // Phone swipe: a mostly-horizontal drag on the stage moves to the next / previous bike.
  const onPointerDown = (e) => {
    if (!isPhone) return
    swipe.current = { x: e.clientX, y: e.clientY, active: true, swiped: false }
  }
  const onPointerUp = (e) => {
    const s = swipe.current
    if (!isPhone || !s.active) return
    s.active = false
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.5) {
      s.swiped = true
      cycle(dx < 0 ? 1 : -1)
    }
  }
  const onStageClick = () => {
    if (swipe.current.swiped) {
      swipe.current.swiped = false // the click that ends a swipe shouldn't close the dossier
      return
    }
    if (open) select(null)
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-void text-editorial-white">
      {/* Stage: wide shot by default (desktop), cinematic zoom on selection; one bike + swipe on phones */}
      <div
        className="absolute inset-0 animate-dolly"
        style={isPhone ? { touchAction: 'pan-y' } : undefined}
        onClick={onStageClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipe.current.active = false
        }}
      >
        <div
          className="absolute will-change-transform transition-transform duration-[1600ms] ease-cinematic"
          style={{
            transitionDuration: isPhone ? '900ms' : undefined,
            left: '50%',
            top: '50%',
            width: camera.W,
            height: camera.H,
            marginLeft: -camera.W / 2,
            marginTop: -camera.H / 2,
            transform: `translate3d(${camera.tx}px, ${camera.ty}px, 0) scale(${camera.scale}) rotate(${camera.tilt}deg)`,
          }}
        >
          <img
            src={heroImage}
            alt="Royal Enfield Classic 350, Honda Dream Yuga and a 2026 Ducati Panigale V2 parked side by side in an industrial warehouse"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none garage-image"
          />
          {!isPhone && vehicles.map((vehicle) => (
            <Hotspot
              key={vehicle.id}
              vehicle={vehicle}
              hidden={Boolean(selected)}
              onSelect={select}
              buttonRef={(el) => {
                hotspotRefs.current[vehicle.id] = el
              }}
            />
          ))}
        </div>
      </div>

      {/* Depth: vignette, header legibility, and a shade behind the dossier */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,5,5,0.78)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none bg-gradient-to-b from-void/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-void/90 to-transparent" />
      <div
        className={`absolute inset-0 pointer-events-none bg-gradient-to-t lg:bg-gradient-to-l from-void/95 via-void/50 to-transparent lg:via-void/60 lg:from-void/95 transition-opacity duration-1000 ${
          selected ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <SiteHeader className="absolute top-0 left-0" alwaysShowChildren>
        <SiteNav activeId="garage" />
      </SiteHeader>

      {!isPhone && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-24 pointer-events-none transition-opacity duration-700 ${
            selected ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <p className="animate-fade-up font-mono text-[11px] tracking-[0.28em] text-editorial-white/80 uppercase text-center">
            Select a vehicle to inspect
          </p>
        </div>
      )}

      {/* Phone controls: previous / next + position dots, and the "Show more" button below the bike */}
      {isPhone && (
        <div
          inert={open}
          aria-hidden={open}
          className={`absolute inset-x-0 bottom-0 z-30 px-6 pb-8 pt-4 flex flex-col items-center gap-4 transition-opacity duration-500 ${
            open ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => cycle(-1)}
              aria-label="Previous vehicle"
              className="w-11 h-11 border border-white/15 active:border-ducati-red flex items-center justify-center text-editorial-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">chevron_left</span>
            </button>
            <div className="flex items-center">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => setFocusId(vehicle.id)}
                  aria-label={`Show ${vehicle.name}`}
                  aria-current={vehicle.id === focusId ? 'true' : undefined}
                  className="p-3"
                >
                  <span
                    className={`block w-2 h-2 rounded-full transition-[transform,background-color] duration-500 ${
                      vehicle.id === focusId ? 'bg-ducati-red scale-125' : 'bg-white/30'
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => cycle(1)}
              aria-label="Next vehicle"
              className="w-11 h-11 border border-white/15 active:border-ducati-red flex items-center justify-center text-editorial-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">chevron_right</span>
            </button>
          </div>
          <button
            ref={showMoreRef}
            type="button"
            onClick={() => select(focusId)}
            className="w-full max-w-xs flex items-center justify-center gap-2 py-3.5 border border-white/20 active:border-ducati-red bg-void/60 backdrop-blur-sm font-mono text-[11px] tracking-[0.24em] text-editorial-white uppercase transition-colors"
          >
            Show more
            <span className="material-symbols-outlined text-[18px] text-ducati-red" aria-hidden="true">
              keyboard_arrow_up
            </span>
          </button>
        </div>
      )}

      {/* Dossier: right-hand panel on desktop, bottom sheet on small screens */}
      <aside
        ref={panelRef}
        tabIndex={-1}
        inert={!selected}
        aria-hidden={!selected}
        aria-label={displayed ? `${displayed.name} dossier` : 'Vehicle dossier'}
        className={`absolute z-40 inset-x-0 bottom-0 h-[56vh] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[42vw] lg:max-w-[640px] overflow-y-auto outline-none transition-opacity duration-500 ${
          selected ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {displayed && (
          <Dossier
            key={`${displayed.id}-${session}`}
            vehicle={displayed}
            index={selected ? selectedIndex : displayedIndex}
            total={vehicles.length}
            phone={isPhone}
            onBack={() => select(null)}
            onCycle={cycle}
          />
        )}
      </aside>
    </div>
  )
}
