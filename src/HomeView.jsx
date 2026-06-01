import { playClick } from './sounds'
import StatsBar from './StatsBar'
import ProgressSection from './ProgressSection'

const NONFICTION = [
  { id: 'ancient-history',  emoji: '🏺', title: 'Ancient History',  description: 'Civilizations, myths, and empires before 500 AD.' },
  { id: 'medieval-history', emoji: '⚔️', title: 'Medieval History', description: 'Kingdoms, crusades, and culture from 500–1500 AD.' },
  { id: 'modern-history',   emoji: '🏛️', title: 'Modern History',   description: 'Revolutions, wars, and progress from 1500 AD to today.' },
  { id: 'business',         emoji: '📈', title: 'Business',          description: 'Markets, entrepreneurs, and the forces that shape economies.' },
  { id: 'science',          emoji: '🔬', title: 'Science',           description: 'Discoveries, breakthroughs, and the nature of the universe.' },
  { id: 'politics',         emoji: '⚖️', title: 'Politics',          description: 'Power, governance, and the struggle for society.' },
  { id: 'philosophy',       emoji: '🧠', title: 'Philosophy',        description: 'Big questions about existence, ethics, and the human mind.' },
]

const FICTION = [
  { id: 'classic-fiction', emoji: '📖', title: 'Classic Fiction', description: 'Timeless tales from Chekhov, Shakespeare, Tolstoy, and beyond.' },
  { id: 'modern-fiction',  emoji: '✍️', title: 'Modern Fiction',  description: 'Contemporary voices and fresh perspectives on the human condition.' },
  { id: 'surprise-me',     emoji: '🎲', title: 'Surprise Me',     description: 'Let fate choose. A random story from across all genres.' },
]

function CategoryCard({ emoji, title, description, id, onSelect }) {
  function handleClick() {
    playClick()
    onSelect({ id, emoji, title, description })
  }

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col gap-3 rounded-xl bg-[#16151a] border border-[#2a2830] p-6 text-left transition-all duration-200 hover:border-[#4a4560] hover:bg-[#1c1b22] hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5 cursor-pointer w-full"
    >
      <span className="text-3xl">{emoji}</span>
      <div>
        <h3
          className="text-[#e8e4dc] text-lg font-semibold leading-snug mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h3>
        <p className="text-[#7a7590] text-sm leading-relaxed">{description}</p>
      </div>
    </button>
  )
}

function Section({ title, categories, onSelect }) {
  return (
    <section className="mb-14">
      <h2
        className="text-[#c9c3b8] mb-6"
        style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.12em', fontSize: '0.7rem', textTransform: 'uppercase' }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} {...cat} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}

export default function HomeView({ onSelect, error, onRetry, progress }) {
  return (
    <div className="min-h-screen bg-[#0d0d0f] px-6 py-14 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1
          className="text-4xl sm:text-5xl font-bold text-[#e8e4dc] mb-3 tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Storytime
        </h1>
        <p className="text-[#7a7590] text-base">Choose a category and let the story begin.</p>
        {error && (
          <div className="mt-4 flex items-center gap-3 text-sm bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-2.5 inline-flex">
            <p className="text-red-400/80">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-red-400 hover:text-red-300 underline underline-offset-2 whitespace-nowrap transition-colors"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </header>

      <StatsBar progress={progress} />

      <Section title="Nonfiction" categories={NONFICTION} onSelect={onSelect} />
      <Section title="Fiction"    categories={FICTION}    onSelect={onSelect} />

      <ProgressSection progress={progress} />
    </div>
  )
}
