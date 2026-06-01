export default function StatsBar({ progress }) {
  const {
    total_stories_read,
    total_summaries_written,
    total_feedback_received,
    average_score,
    best_score,
    current_streak,
  } = progress

  if (!total_stories_read && !total_summaries_written && !total_feedback_received) return null

  const items = [
    { label: 'Stories read',  value: total_stories_read },
    { label: 'Summaries',     value: total_summaries_written },
    { label: 'Avg score',     value: total_feedback_received > 0 ? average_score.toFixed(1) : '--' },
    { label: 'Best',          value: best_score > 0 ? `${best_score}/10` : '--' },
    { label: 'Streak',        value: `${current_streak} 🔥` },
  ]

  return (
    <div className="flex items-center bg-[#16151a] border border-[#2a2830] rounded-xl divide-x divide-[#2a2830] mb-10 overflow-x-auto">
      {items.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center shrink-0 flex-1 min-w-[60px] px-3 py-3">
          <span className="text-[#4a4560] mb-0.5 whitespace-nowrap" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {label}
          </span>
          <span className="text-[#c9c3b8] text-sm font-medium tabular-nums">{value}</span>
        </div>
      ))}
    </div>
  )
}
