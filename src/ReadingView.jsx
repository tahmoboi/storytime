import { useEffect, useRef, useState } from 'react'
import { playSuccess, playDone, playBack } from './sounds'

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function ReadingView({ story, onDone, onBack }) {
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    playSuccess()
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  function handleBack() {
    playBack()
    onBack()
  }

  function handleDone() {
    clearInterval(timerRef.current)
    playDone()
    onDone()
  }

  const wordCount = story.story.split(/\s+/).length
  const estMinutes = Math.ceil(wordCount / 200)

  const paragraphs = story.story
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-[#0d0d0f] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#7a7590] hover:text-[#c9c3b8] transition-colors text-sm mb-10"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          All categories
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-medium uppercase tracking-widest text-[#7a7590] px-2.5 py-1 rounded-full border border-[#2a2830]">
            {story.type}
          </span>
          <span className="text-xs text-[#4a4560]">~{estMinutes} min read</span>
        </div>

        <h1
          className="text-3xl sm:text-4xl font-bold text-[#e8e4dc] leading-tight mb-10"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {story.title}
        </h1>

        <div className="space-y-5 mb-14">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[#c9c3b8] text-[1.0625rem] leading-[1.8] tracking-[0.01em]">
              {p}
            </p>
          ))}
        </div>

        <div className="border-t border-[#2a2830] pt-8 flex items-center justify-between">
          <span className="text-[#4a4560] text-sm tabular-nums">{formatTime(elapsed)}</span>
          <button
            onClick={handleDone}
            className="px-6 py-2.5 bg-[#a89ec0] hover:bg-[#bdb3d4] text-[#0d0d0f] text-sm font-medium rounded-lg transition-colors"
          >
            I've read it
          </button>
        </div>
      </div>
    </div>
  )
}
