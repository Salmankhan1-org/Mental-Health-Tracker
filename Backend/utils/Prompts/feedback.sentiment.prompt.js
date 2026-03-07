exports.GetFeedbackSentimentPrompt = (userFeedback)=>{
    return `Analyze the sentiment of the following user feedback.

    Return ONLY one word:
    positive
    neutral
    negative

    Feedback:
    "${userFeedback}"`
}