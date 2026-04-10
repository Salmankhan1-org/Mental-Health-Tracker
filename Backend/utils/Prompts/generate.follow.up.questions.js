exports.GenerateQuestionsPrompt = (mood, note) => {
  return `
    You are a mental health assistant.

    User mood: ${mood}
    User note: ${note || "No note provided"}

    Generate 3 short follow-up questions to better understand the user's emotional state.

    Rules:
    - Each question must have 3-4 options
    - Keep questions simple and supportive
    - No medical or clinical language
    - Options must be short (1-3 words)

    Return ONLY JSON in this format:

    [
    {
        "question": "string",
        "options": ["option1", "option2", "option3"]
    }
    ]
    `
}