/**
 * iOS Safari requires an AudioContext to be resumed (or created) in response
 * to a user gesture before any audio can play. This module provides a
 * one-time unlock that persists for the lifetime of the page.
 *
 * Call `unlockAudioContext()` inside any click/tap event handler before
 * calling `audio.play()`.
 */
let unlocked = false

export function unlockAudioContext(): void {
  if (unlocked || typeof window === 'undefined') return
  unlocked = true
  try {
    const AC = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    ctx.resume().then(() => ctx.close()).catch(() => {})
  } catch {
    // Silently ignore — not all environments support AudioContext
  }
}
