import { useEffect, useState } from 'react'

function scoreColor(n) {
  if (n >= 9) return '#5a9e7a'
  if (n >= 7) return '#a89ec0'
  if (n >= 5) return '#c09e5a'
  return '#c05a5a'
}

const LEGEND = [
  { color: '#5a9e7a', label: '9–10' },
  { color: '#a89ec0', label: '7–8' },
  { color: '#c09e5a', label: '5–6' },
  { color: '#c05a5a', label: '1–4' },
]

function BarChart({ entries }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex items-end gap-1.5" style={{ height: 92 }}>
      {entries.map((entry, i) => {
        const color = scoreColor(entry.score)
        const targetH = Math.max(6, (entry.score / 10) * 68)
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center justify-end gap-1"
            title={`${entry.title}\n${entry.category} · ${entry.score}/10 · ${entry.date}`}
          >
            <span
              className="tabular-nums leading-none select-none"
              style={{ color, fontSize: '10px' }}
            >
              {entry.score}
            </span>
            <div
              className="w-full rounded-t-sm"
              style={{
                height: mounted ? targetH : 4,
                background: color,
                opacity: 0.72,
                transition: `height 0.65s ease ${i * 55}ms`,
                minWidth: 8,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default function ProgressSection({ progress }) {
  const { scores_history = [], total_feedback_received } = progress
  if (scores_history.length === 0) return null

  const last10 = scores_history.slice(-10)

  return (
    <section className="mt-4 mb-10">
      <h2
        className="mb-6 text-[#c9c3b8]"
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          letterSpacing: '0.12em',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
        }}
      >
        My Progress
      </h2>

      <div className="bg-[#16151a] border border-[#2a2830] rounded-xl p-6">
        <div className="flex items-baseline justify-between mb-5">
          <p className="text-[#7a7590] text-xs">
            Last {last10.length} session{last10.length !== 1 ? 's' : ''}
          </p>
          {total_feedback_received > 10 && (
            <p className="text-[#4a4560] text-xs">{total_feedback_received} total</p>
          )}
        </div>

        <BarChart entries={last10} />

        <div className="flex items-center gap-5 mt-5 pt-4 border-t border-[#2a2830]">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: color, opacity: 0.72 }} />
              <span className="text-[#4a4560]" style={{ fontSize: '10px' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
