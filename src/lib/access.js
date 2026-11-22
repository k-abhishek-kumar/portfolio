// Password gate for the private RishAbh page.
//
// The password is never stored in the code. `VITE_RISHABH_HASH` (set in `.env.local`, created by
// `npm run hash-password`) holds a salted PBKDF2 hash as "saltHex:hashHex". Without it, nothing
// can be unlocked.
//
// NOTE: this is a client-side gate. It keeps casual visitors out, but anything shipped to the
// browser can in principle be inspected — don't put genuinely sensitive data behind it.

const STORAGE_KEY = 'rishabh-unlocked'
const ITERATIONS = 150000 // must match scripts/hash-password.mjs

const hexToBytes = (hex) => Uint8Array.from(hex.match(/../g) ?? [], (h) => parseInt(h, 16))
const bytesToHex = (buffer) =>
  [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')

export const isConfigured = Boolean(import.meta.env.VITE_RISHABH_HASH)

export function isUnlocked() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function lock() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage unavailable — nothing to clear
  }
}

/** Checks the password; on success remembers the unlock for this browser tab. */
export async function tryUnlock(password) {
  const stored = import.meta.env.VITE_RISHABH_HASH
  if (!stored || !password || !globalThis.crypto?.subtle) return false
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false

  try {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
      'deriveBits',
    ])
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: hexToBytes(saltHex), iterations: ITERATIONS },
      key,
      256,
    )
    if (bytesToHex(bits) !== hashHex) return false
    sessionStorage.setItem(STORAGE_KEY, '1')
    return true
  } catch {
    return false
  }
}
