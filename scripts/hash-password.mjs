// Sets the password for the private RishAbh page.
//
//   npm run hash-password -- "your password"
//
// Writes a salted PBKDF2 hash to `.env.local` as VITE_RISHABH_HASH (the file is git-ignored).
// The password itself is never stored. Restart `npm run dev` afterwards. For a deployed site,
// set the same VITE_RISHABH_HASH value as an environment variable in your host's build settings.
import { pbkdf2Sync, randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const ITERATIONS = 150000 // must match src/lib/access.js
const KEY = 'VITE_RISHABH_HASH'

const password = process.argv[2]
if (!password) {
  console.error('Usage: npm run hash-password -- "your password"')
  process.exit(1)
}

const salt = randomBytes(16)
const hash = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256')
const line = `${KEY}=${salt.toString('hex')}:${hash.toString('hex')}`

const file = new URL('../.env.local', import.meta.url)
const existing = existsSync(file) ? readFileSync(file, 'utf8').split(/\r?\n/) : []
const kept = existing.filter((l) => l.trim() && !l.startsWith(`${KEY}=`))
writeFileSync(file, [...kept, line].join('\n') + '\n')

console.log('Saved the password hash to .env.local — restart the dev server to apply it.')
