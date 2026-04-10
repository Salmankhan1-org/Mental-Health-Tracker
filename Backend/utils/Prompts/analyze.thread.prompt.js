

exports.ThreadAnalysisPrompt = (content, emotion, topic) => {
  return `
    You are a mental health safety AI.

    Analyze a community post and detect emotional tone and risk.

    INPUT:
    - emotion: "${emotion}"
    - topic: "${topic}"
    - content: "${content}"

    Return ONLY valid JSON.

    {
    "sentiment": "positive" | "neutral" | "negative",
    "emotionTags": [string], 
    "riskLevel": "low" | "medium" | "high",
    "isSensitive": boolean,
    "flaggedReason": string | null
    }

    RULES:
    - "high" risk → self-harm, suicidal, severe distress
    - "medium" → anxiety, panic, burnout
    - "low" → normal discussion

    - emotionTags: 3–5 words (e.g. anxiety, fear, sadness)

    - isSensitive = true if:
    self-harm, trauma, abuse, panic

    - flaggedReason ONLY if dangerous content exists
    `
}