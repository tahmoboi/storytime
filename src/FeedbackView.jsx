import { useEffect, useState } from 'react'
import { playBack, playClick, playDone } from './sounds'

const DIMENSIONS = [
  { key: 'completeness',      label: 'Completeness' },
  { key: 'clarity',           label: 'Clarity' },
  { key: 'grammar',           label: 'Grammar' },
  { key: 'tense_consistency', label: 'Tense' },
  { key: 'verb_strength',     label: 'Verbs' },
  { key: 'transitions',       label: 'Transitions' },
  { key: 'narrative_voice',   label: 'Voice' },
  { key: 'conciseness',       label: 'Conciseness' },
]

function scoreColor(n) {
  if (n >= 9) return '#5a9e7a'
  if (n >= 7) return '#a89ec0'
  if (n >= 5) return '#c09e5a'
  return '#c05a5a'
}

function ScoreRing({ score, label, delay = 0 }) {
  const [animated, setAnimated] = useState(false)
  const SIZE = 76
  const STROKE = 5
  const R = (SIZE - STROKE) / 2
  const CIRC = 2 * Math.PI * R
  const offset = animated ? CIRC * (1 - score / 10) : CIRC
  const color = scoreColor(score)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#2a2830" strokeWidth={STROKE} />
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.9s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-semibold" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-xs text-[#7a7590] text-center leading-tight" style={{ maxWidth: SIZE }}>
        {label}
      </span>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs uppercase tracking-widest text-[#4a4560] mb-3">{children}</p>
  )
}

export default function FeedbackView({ feedback, story, summary, onNextStory, onRevise }) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    playDone()
    const target = feedback.overall_score
    let current = 0
    function step() {
      current = Math.min(current + 1, target)
      setDisplayScore(current)
      if (current < target) setTimeout(step, 80)
    }
    setTimeout(step, 400)
  }, [feedback.overall_score])

  const improvements = feedback.improvements ?? []
  const overallColor = scoreColor(feedback.overall_score)

  return (
    <div className="min-h-screen bg-[#0d0d0f] px-6 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Overall score */}
        <div className="text-center mb-12">
          <div
            className="font-bold leading-none mb-1 tabular-nums"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '7rem',
              color: overallColor,
              transition: 'color 0.3s ease',
            }}
          >
            {displayScore}
          </div>
          <p className="text-[#4a4560] text-sm uppercase tracking-widest">/ 10 overall</p>
        </div>

        {/* 8 score rings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-12">
          {DIMENSIONS.map(({ key, label }, i) => (
            <ScoreRing
              key={key}
              score={feedback.scores?.[key] ?? 0}
              label={label}
              delay={100 + i * 80}
            />
          ))}
        </div>

        {/* Assessment */}
        <div className="mb-8">
          <SectionLabel>Assessment</SectionLabel>
          <p className="text-[#c9c3b8] text-[0.9375rem] leading-relaxed">{feedback.overall_feedback}</p>
        </div>

        {/* Strength */}
        {feedback.strength && (
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-5 py-4 mb-8">
            <SectionLabel>Strength</SectionLabel>
            <p className="text-emerald-300/80 text-sm leading-relaxed">{feedback.strength}</p>
          </div>
        )}

        {/* Improvements */}
        {improvements.length > 0 && (
          <div className="mb-8">
            <SectionLabel>Line improvements</SectionLabel>
            <div className="space-y-5">
              {improvements.map((imp, i) => (
                <div key={i}>
                  <div className="rounded-lg border border-red-900/30 bg-red-950/20 px-4 py-3 mb-2">
                    <p className="text-[#c9849a] text-sm leading-relaxed italic">"{imp.original}"</p>
                  </div>
                  <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/20 px-4 py-3 mb-2">
                    <p className="text-emerald-300/80 text-sm leading-relaxed">"{imp.rewrite}"</p>
                  </div>
                  <p className="text-[#7a7590] text-xs pl-1 leading-relaxed">{imp.why}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Framework tip */}
        {feedback.framework_tip && (
          <div className="rounded-xl border border-[#c09e5a]/25 bg-[#1a1710] px-5 py-4 mb-5">
            <SectionLabel>Writing Framework</SectionLabel>
            <p className="text-[#c09e5a] text-sm font-medium mb-2">{feedback.framework_tip.name}</p>
            <p className="text-[#c9c3b8] text-sm leading-relaxed">{feedback.framework_tip.example}</p>
          </div>
        )}

        {/* Storyteller tip */}
        {feedback.storyteller_tip && (
          <div className="rounded-xl border border-[#a89ec0]/25 bg-[#17151f] px-5 py-4 mb-10">
            <SectionLabel>Storyteller tip</SectionLabel>
            <p className="text-[#c9c3b8] text-sm leading-relaxed">{feedback.storyteller_tip}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => { playBack(); onNextStory() }}
            className="flex-1 px-5 py-3 rounded-xl border border-[#2a2830] text-[#c9c3b8] text-sm font-medium hover:border-[#4a4560] hover:bg-[#16151a] transition-all"
          >
            Next story
          </button>
          <button
            onClick={() => { playClick(); onRevise() }}
            className="flex-1 px-5 py-3 rounded-xl bg-[#a89ec0] hover:bg-[#bdb3d4] text-[#0d0d0f] text-sm font-medium transition-colors"
          >
            Revise my summary
          </button>
        </div>

      </div>
    </div>
  )
}
