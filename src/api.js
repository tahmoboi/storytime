function noEmDash(s) {
  return typeof s === 'string' ? s.replace(/—/g, ' - ') : s
}

function sanitizeStory(data) {
  return { ...data, title: noEmDash(data.title), story: noEmDash(data.story) }
}

function sanitizeFeedback(data) {
  return {
    ...data,
    overall_feedback: noEmDash(data.overall_feedback),
    strength: noEmDash(data.strength),
    storyteller_tip: noEmDash(data.storyteller_tip),
    framework_tip: data.framework_tip
      ? { ...data.framework_tip, example: noEmDash(data.framework_tip.example) }
      : data.framework_tip,
    improvements: (data.improvements ?? []).map((imp) => ({
      ...imp,
      original: noEmDash(imp.original),
      rewrite: noEmDash(imp.rewrite),
      why: noEmDash(imp.why),
    })),
  }
}

const CATEGORY_INSTRUCTIONS = {
  'ancient-history': 'true story before 500 AD, figures like Alexander, Ashoka, Caesar',
  'medieval-history': 'true story 500-1500 AD, figures like Saladin, Genghis Khan, Joan of Arc',
  'modern-history': 'true story after 1500, figures like Mandela, Churchill, Lincoln',
  'business': 'true business story, figures like Jobs, Bezos, Oprah',
  'science': 'true science story, figures like Curie, Turing, Ramanujan',
  'politics': 'true political story, figures like Obama, Mandela, Bismarck',
  'philosophy': 'true story about a philosopher like Socrates, Rumi, Marcus Aurelius',
  'classic-fiction': 'original short fiction in style of Chekhov or Shakespeare',
  'modern-fiction': 'original contemporary short fiction with sharp dialogue',
  'surprise-me': 'compelling story from any domain, fiction or nonfiction',
}

export async function fetchStory(categoryId) {
  const instruction = CATEGORY_INSTRUCTIONS[categoryId]
  const prompt = `Write a 400-550 word ${instruction}. Respond ONLY as JSON: {"title":"...","story":"...","type":"fiction or nonfiction"}`

  const res = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.1:8b',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      format: 'json',
    }),
  })

  if (!res.ok) throw new Error(`Ollama error ${res.status}`)

  const data = await res.json()
  return sanitizeStory(JSON.parse(data.message.content))
}

export async function fetchFeedback(story, summary) {
  const prompt =
    `You are a writing coach. A student read this story: ${story.story}. ` +
    `They wrote this summary: ${summary}. ` +
    `Score 1-10 on these 8 dimensions: completeness, clarity, grammar, tense_consistency, verb_strength, transitions, narrative_voice, conciseness. ` +
    `Never use em dashes in your response. ` +
    `Suggest a writing framework (PREP, situation-complication-resolution, or similar) with a concrete example using their text. ` +
    `Reference Obama, Mandela, Chekhov, or Shakespeare in your storyteller tip. ` +
    `Respond ONLY as JSON: {"scores":{"completeness":7,"clarity":8,"grammar":6,"tense_consistency":7,"verb_strength":5,"transitions":6,"narrative_voice":7,"conciseness":8},"overall_score":7,"improvements":[{"original":"their line","rewrite":"better version","why":"reason"}],"strength":"what they did well","framework_tip":{"name":"PREP","example":"how to apply it to their text"},"storyteller_tip":"tip referencing a great communicator","overall_feedback":"2-3 sentence assessment"}`

  const res = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.1:8b',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      format: 'json',
    }),
  })

  if (!res.ok) throw new Error(`Ollama error ${res.status}`)

  const data = await res.json()
  return sanitizeFeedback(JSON.parse(data.message.content))
}
