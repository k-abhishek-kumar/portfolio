import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UnlockDialog from '../components/UnlockDialog.jsx'
import { isUnlocked } from '../lib/access.js'

/**
 * Access handling for a menu entry. For a locked section that hasn't been unlocked yet:
 * `locked` is true, `ask()` opens the password prompt, and `dialog` must be rendered somewhere.
 * A correct password navigates to the section. Other sections get `locked: false` and no dialog.
 */
export function useSectionAccess(section) {
  const navigate = useNavigate()
  const [asking, setAsking] = useState(false)

  const locked = Boolean(section.locked) && !isUnlocked()
  const dialog = section.locked ? (
    <UnlockDialog
      open={asking}
      onClose={() => setAsking(false)}
      onUnlocked={() => {
        setAsking(false)
        navigate(section.to)
      }}
    />
  ) : null

  return { locked, ask: () => setAsking(true), dialog }
}
