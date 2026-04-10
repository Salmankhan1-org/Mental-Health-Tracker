// workers/thread.analysis.worker.js

const { Worker } = require("bullmq")
const connection = require('../config/bullmq.ioredis');
const Thread = require("../models/Community/community.thread.model");
const { ThreadAnalysisPrompt } = require("../utils/Prompts/analyze.thread.prompt");
const { generateUsingAI } = require("../utils/AI/gemini.ai");


const worker = new Worker(
    "analyze-thread",
    async (job) => {
		try {
			const { threadId } = job.data

			// 1. Get thread
			const thread = await Thread.findById(threadId)

			if (!thread) return

			// 2. Build prompt
			const prompt = ThreadAnalysisPrompt(
				thread.content,
				thread.moodLabel,
				thread.topic
			)

			// 3. Call AI
			const AIResponse = await generateUsingAI(prompt, true)

			if (!AIResponse) return

			// 4. Update thread
			await Thread.findByIdAndUpdate(threadId, {
				aiMeta: {
					sentiment: AIResponse.sentiment,
					emotionTags: AIResponse.emotionTags,
					riskLevel: AIResponse.riskLevel
				},
				moderation: {
					isSensitive: AIResponse.isSensitive,
					isFlagged: AIResponse.riskLevel === "high",
					flaggedReason: AIResponse.flaggedReason || null
				}
			})

			console.log("✅ Thread analyzed:", threadId)

		} catch (error) {
			console.error("❌ Worker Error:", error.message)
			throw error
		}
    },
    {
      connection,
      concurrency: 5 //  parallel jobs
    }
)

module.exports = worker