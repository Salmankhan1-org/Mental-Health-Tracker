const { generateUsingAI } = require("./gemini.ai")
const { SeverityCheckPrompt } = require("../Prompts/severity.check.prompt")

const FallbackSeverity = (reason = '', description = '') => {
    const text = `${reason} ${description}`.toLowerCase()

    if (
        text.includes('abuse') ||
        text.includes('harassment') ||
        text.includes('threat') ||
        text.includes('unsafe')
    ) {
        return 'critical'
    }

    if (
        text.includes('no show') ||
        text.includes('did not join') ||
        text.includes('ignored')
    ) {
        return 'high'
    }

    if (
        text.includes('late') ||
        text.includes('delay') ||
        text.includes('poor')
    ) {
        return 'medium'
    }

    return 'low'
}

exports.GetSeverity = async (reason, description) => {
    try {
        const prompt = SeverityCheckPrompt(reason, description)

        const severity = await generateUsingAI(prompt);
        const valid = ['low', 'medium', 'high', 'critical']

        if (!valid.includes(severity)) {
            throw new Error('Invalid AI response')
        }

        return text

    } catch (error) {
        return FallbackSeverity(reason, description)
    }
}