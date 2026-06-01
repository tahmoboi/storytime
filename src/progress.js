const KEY = 'storytime_progress'

const DEFAULTS = {
  total_stories_read: 0,
  total_summaries_written: 0,
  total_feedback_received: 0,
  average_score: 0,
  best_score: 0,
  current_streak: 0,
  last_active_date: null,
  scores_history: [],
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

function persist(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* quota exceeded */ }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function applyStreak(data) {
  const today = todayISO()
  if (data.last_active_date === today) return data

  const d = new Date()
  d.setDate(d.getDate() - 1)
  const yesterday = d.toISOString().slice(0, 10)

  return {
    ...data,
    current_streak: data.last_active_date === yesterday ? data.current_streak + 1 : 1,
    last_active_date: today,
  }
}

export function getProgress() {
  return load()
}

export function incrementStoriesRead() {
  const fresh = applyStreak(load())
  fresh.total_stories_read += 1
  persist(fresh)
  return fresh
}

export function incrementSummariesWritten() {
  const fresh = applyStreak(load())
  fresh.total_summaries_written += 1
  persist(fresh)
  return fresh
}

export function recordFeedback({ score, category, title }) {
  const d = applyStreak(load())
  const oldCount = d.total_feedback_received
  d.total_feedback_received = oldCount + 1
  d.average_score =
    Math.round(((d.average_score * oldCount + score) / d.total_feedback_received) * 10) / 10
  if (score > d.best_score) d.best_score = score
  d.scores_history = [
    ...d.scores_history,
    { date: todayISO(), score, category, title },
  ].slice(-30)
  persist(d)
  return d
}
