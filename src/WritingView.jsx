import { useEffect, useRef, useState } from 'react'
import { fetchFeedback } from './api'
import { playBack, playClick, playFocus, playLoad, playSuccess } from './sounds'

function countWords(text) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const MIN_WORDS = 30

export default function WritingView({ story, initialText = '', onFeedback, onStartOver }) {
  const [text, setText] = useState(initialText)
  const [peekOpen, setPeekOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const textareaRef = useRef(null)
  const prevCanSubmit = useRef(countWords(initialText) >= MIN_WORDS)

  const wordCount = countWords(text)
  const canSubmit = wordCount >= MIN_WORDS
  const remaining = MIN_WORDS - wordCount

  useEffect(() => { textareaRef.current?.focus() }, [])

  useEffect(() => {
    if (canSubmit && !prevCanSubmit.current) playSuccess()
    prevCanSubmit.current = canSubmit
  }, [canSubmit])

  function handleStartOver() { playBack(); onStartOver() }
  function handlePeekToggle() { playClick(); setPeekOpen((o) => !o) }

  async function handleFeedback() {
    if (!canSubmit || loading) return
    setError(null)
    setLoading(true)
    playLoad()
    try {
      const result = await fetchFeedback(story, text)
      onFeedback(result, text)
    } catch (err) {
      setError("Couldn't get feedback. Is Ollama running?")
      setLoading(false)
    }
  }

  const paragraphs = story.story.split(/\n+/).map((p) => p.trim()).filter(Boolean)

  return (
    <div className="min-h-screen bg-[#0d0d0f] px-6 py-12">
      <div className="max-w-2xl mx-auto">

        <button
          onClick={handleStartOver}
          className="flex items-center gap-2 text-[#7a7590] hover:text-[#c9c3b8] transition-colors text-sm mb-10"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Start over
        </button>

        <h1
          className="text-3xl font-bold text-[#e8e4dc] leading-tight mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {story.title}
        </h1>

        <p className="text-[#7a7590] text-[0.9375rem] leading-relaxed mb-8">
          Retell this story in your own words. Focus on the arc, the stakes, and why it matters.
        </p>

        {/* Peek at original */}
        <div className="mb-6">
          <button
            onClick={handlePeekToggle}
            className="flex items-center gap-1.5 text-[#7a7590] hover:text-[#c9c3b8] transition-colors text-xs uppercase tracking-widest"
          >
            <ChevronIcon open={peekOpen} />
            {peekOpen ? 'Hide original' : 'Peek at original'}
          </button>
          <div style={{ maxHeight: peekOpen ? '220px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
            <div className="mt-3 max-h-[208px] overflow-y-auto rounded-xl border border-[#2a2830] bg-[#111013] px-5 py-4 space-y-3">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-[#3a3648] text-sm leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          onFocus={playFocus}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          placeholder="Begin your retelling…"
          className="w-full h-56 bg-[#16151a] border border-[#2a2830] rounded-xl p-5 text-[#c9c3b8] placeholder-[#4a4560] text-[1.0625rem] leading-[1.8] resize-none focus:outline-none focus:border-[#4a4560] transition-colors disabled:opacity-50"
        />

        <div className="flex items-center justify-between mt-3">
          <span
            className="text-sm tabular-nums transition-colors duration-300"
            style={{ color: canSubmit ? '#a89ec0' : wordCount > 15 ? '#7a7590' : '#4a4560' }}
          >
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
            {!canSubmit && <span style={{ color: '#4a4560' }}> · {remaining} to go</span>}
          </span>

          <button
            onClick={handleFeedback}
            disabled={!canSubmit || loading}
            className="px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
            style={
              canSubmit && !loading
                ? { background: '#a89ec0', color: '#0d0d0f', cursor: 'pointer' }
                : { background: '#16151a', color: '#4a4560', border: '1px solid #2a2830', cursor: 'not-allowed' }
            }
          >
            {loading && (
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
              </svg>
            )}
            {loading ? 'Analyzing…' : 'Get Feedback'}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-3 text-sm bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-2.5">
            <p className="text-red-400/80 flex-1">{error}</p>
            <button
              onClick={handleFeedback}
              className="text-red-400 hover:text-red-300 underline underline-offset-2 whitespace-nowrap transition-colors"
            >
              Try again
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
