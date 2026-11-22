import { Link } from 'react-router-dom'

/**
 * Editorial top bar. `sublabel` sits next to the wordmark; `children` is the right-hand side.
 * Pass `className` to position it (e.g. absolute overlay on full-screen pages).
 * `alwaysShowChildren` keeps the right-hand side visible on small screens (it wraps below the
 * wordmark) — used for the section navigation. Otherwise it is hidden under the `sm` breakpoint.
 */
export default function SiteHeader({ sublabel, children, className = 'relative', alwaysShowChildren = false }) {
  return (
    <header
      className={`${className} z-50 w-full px-8 md:px-16 pt-8 pb-4 flex flex-wrap items-center justify-between gap-y-3 pointer-events-auto`}
    >
      <div className="flex items-center gap-3">
        <Link
          to="/"
          aria-label="TITAN — home"
          className="font-headline tracking-[0.28em] text-[15px] font-bold text-editorial-white uppercase hover:text-ducati-red transition-colors"
        >
          TITAN
        </Link>
        {sublabel && (
          <>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ducati-red" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-editorial-subtle uppercase">{sublabel}</span>
          </>
        )}
      </div>
      <div
        className={`items-center gap-8 font-mono text-[11px] tracking-[0.16em] text-editorial-muted ${
          alwaysShowChildren ? 'flex min-w-0 w-full sm:w-auto' : 'hidden sm:flex'
        }`}
      >
        {children}
      </div>
    </header>
  )
}
