import { useState } from 'react'
import { fetchStory } from './api'
import {
  getProgress,
  incrementStoriesRead,
  incrementSummariesWritten,
  recordFeedback,
} from './progress'
import HomeView from './HomeView'
import LoadingView from './LoadingView'
import ReadingView from './ReadingView'
import WritingView from './WritingView'
import FeedbackView from './FeedbackView'

export default function App() {
  const [view, setView]         = useState('home')
  const [story, setStory]       = useState(null)
  const [category, setCategory] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [summary, setSummary]   = useState('')
  const [error, setError]       = useState(null)
  const [progress, setProgress] = useState(() => getProgress())

  async function handleSelect(cat) {
    setCategory(cat)
    setError(null)
    setSummary('')
    setFeedback(null)
    setView('loading')
    try {
      const result = await fetchStory(cat.id)
      setStory(result)
      setView('reading')
    } catch (err) {
      setError(`Couldn't reach Ollama. Is it running? (${err.message})`)
      setView('home')
    }
  }

  function handleReadingDone() {
    setProgress(incrementStoriesRead())
    setView('writing')
  }

  function handleFeedback(result, text) {
    incrementSummariesWritten()
    const updated = recordFeedback({
      score: result.overall_score,
      category: category?.title ?? 'Unknown',
      title: story?.title ?? 'Unknown',
    })
    setProgress(updated)
    setFeedback(result)
    setSummary(text)
    setView('feedback')
  }

  if (view === 'loading') {
    return <LoadingView category={category} />
  }
  if (view === 'reading') {
    return (
      <ReadingView
        story={story}
        onDone={handleReadingDone}
        onBack={() => setView('home')}
      />
    )
  }
  if (view === 'writing') {
    return (
      <WritingView
        story={story}
        initialText={summary}
        onFeedback={handleFeedback}
        onStartOver={() => setView('home')}
      />
    )
  }
  if (view === 'feedback') {
    return (
      <FeedbackView
        feedback={feedback}
        story={story}
        summary={summary}
        onNextStory={() => { setProgress(getProgress()); setView('home') }}
        onRevise={() => setView('writing')}
      />
    )
  }

  return (
    <HomeView
      onSelect={handleSelect}
      error={error}
      onRetry={category ? () => handleSelect(category) : null}
      progress={progress}
    />
  )
}
