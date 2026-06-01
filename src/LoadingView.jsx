import { useEffect } from 'react'
import { playLoad } from './sounds'

export default function LoadingView({ category }) {
  useEffect(() => {
    playLoad()
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0d0f] flex flex-col items-center justify-center gap-8 px-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-[#2a2830]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#a89ec0] animate-spin" />
      </div>

      <div className="text-center">
        <p className="text-[#7a7590] text-sm mb-1">Writing your story</p>
        {category && (
          <p
            className="text-[#e8e4dc] text-xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {category.title}
          </p>
        )}
      </div>
    </div>
  )
}
