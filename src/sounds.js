let _ctx = null

function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)()
  // Resume if suspended (browser autoplay policy)
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

function tone({ freq, freqEnd, type = 'sine', start, duration, volume }) {
  const c = ctx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)

  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, start + duration)

  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(volume, start + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  osc.start(start)
  osc.stop(start + duration + 0.02)
}

// Soft tap — card selection
export function playClick() {
  const now = ctx().currentTime
  tone({ freq: 680, freqEnd: 340, start: now, duration: 0.09, volume: 0.13 })
}

// Ascending sweep — loading begins
export function playLoad() {
  const now = ctx().currentTime
  tone({ freq: 220, freqEnd: 440, start: now, duration: 0.45, volume: 0.07 })
}

// Three-note ascending chime — story arrives
export function playSuccess() {
  const now = ctx().currentTime
  ;[523.25, 659.25, 783.99].forEach((freq, i) => {
    tone({ freq, start: now + i * 0.1, duration: 0.7, volume: 0.11 })
  })
}

// Warm chord — "I've read it"
export function playDone() {
  const now = ctx().currentTime
  ;[261.63, 329.63, 392, 523.25].forEach((freq, i) => {
    tone({ freq, start: now + i * 0.04, duration: 1.1, volume: 0.09 })
  })
}

// Soft descending — back navigation
export function playBack() {
  const now = ctx().currentTime
  tone({ freq: 480, freqEnd: 290, start: now, duration: 0.14, volume: 0.1 })
}

// Subtle tick — textarea focus
export function playFocus() {
  const now = ctx().currentTime
  tone({ freq: 420, freqEnd: 380, start: now, duration: 0.06, volume: 0.07 })
}
