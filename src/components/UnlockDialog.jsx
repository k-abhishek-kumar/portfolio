import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { isConfigured, tryUnlock } from '../lib/access.js'

/**
 * Modal password prompt built on the native <dialog>: it traps focus, closes on Esc, makes the
 * page behind it inert, and returns focus to whatever opened it. Rendered in a portal so it never
 * disturbs the layout of the menu it was opened from.
 */
export default function UnlockDialog({ open, onClose, onUnlocked }) {
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setValue('')
      setError('')
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const submit = async (event) => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    const ok = await tryUnlock(value)
    setBusy(false)
    if (ok) {
      onUnlocked()
    } else {
      setError('Incorrect password.')
      setValue('')
      inputRef.current?.focus()
    }
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby="unlock-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose() // click on the backdrop
      }}
      className="m-auto w-[min(92vw,26rem)] bg-surface-container-low text-editorial-white border border-white/10 p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={submit} className="flex flex-col gap-6 p-7">
        <div className="flex flex-col gap-3">
          <span className="material-symbols-outlined text-ducati-red text-[26px]" aria-hidden="true">
            lock
          </span>
          <h2 id="unlock-title" className="font-headline text-2xl font-extrabold uppercase tracking-[-0.01em]">
            RishAbh
          </h2>
          <p className="font-mono text-[10px] tracking-[0.2em] text-editorial-muted uppercase">
            Private — enter the password to continue
          </p>
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-editorial-muted uppercase">Password</span>
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            autoFocus
            aria-invalid={error ? 'true' : undefined}
            aria-describedby="unlock-error"
            className="w-full bg-void/60 border border-white/15 focus:border-ducati-red px-3 py-2.5 font-mono text-sm tracking-[0.1em] text-editorial-white outline-none transition-colors"
          />
        </label>

        <p id="unlock-error" role="alert" className="min-h-[1.25rem] -mt-3 font-mono text-[11px] tracking-[0.1em] text-primary">
          {error}
          {!error && import.meta.env.DEV && !isConfigured
            ? 'No password set yet — run: npm run hash-password -- "your password"'
            : ''}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-white/15 hover:border-white/40 font-mono text-[11px] tracking-[0.18em] text-editorial-muted hover:text-editorial-white uppercase transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !value}
            className="px-4 py-2.5 bg-ducati-red hover:bg-ducati-red/85 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-[11px] tracking-[0.18em] text-white uppercase font-semibold transition-colors"
          >
            {busy ? 'Checking…' : 'Unlock'}
          </button>
        </div>
      </form>
    </dialog>,
    document.body,
  )
}
