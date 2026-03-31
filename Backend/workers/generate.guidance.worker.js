// workers/guidance.worker.js

const { Worker } = require("bullmq");
const connection = require("../config/bullmq.ioredis");
const Guidance = require("../models/AI/guidance.schema");
const { GenerateGuidancePrompt } = require("../utils/Prompts/generate.guidance.prompt");
const { generateUsingAI } = require("../utils/AI/gemini.ai");
const MoodEntry = require("../models/AI/mood.entry.schema");
const redisClient = require("../config/redis");

const worker = new Worker(
    "guidance-queue",
    async (job) => {
        const { userId, moodEntryId } = job.data;

        // Prevent duplicate generation
        const existing = await Guidance.findOne({
            triggerMoodEntry: moodEntryId
        });

        if (existing) return;

        // Fetch last 7 + today
        const entries = await MoodEntry.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(7)
        .lean();

        // if (!entries || entries.length < 3) return;

        const todayEntry = entries[0];
        const historyEntries = entries.slice(1);

        // Optional cost optimization (skip low signal cases)
        if (
            todayEntry?.analysis?.stressLevel < 2 &&
            todayEntry?.analysis?.moodScore >= 3
        ) {
            return;
        }


        const usedEntries = entries.map((entry)=>entry._id);

        // Generate AI prompt
        const prompt = GenerateGuidancePrompt({
            historyEntries,
            todayEntry
        });

        const aiResponse = await generateUsingAI(prompt, true);

        if (!aiResponse) return;

        const now = new Date();

        const generatedForDate = new Date();
        generatedForDate.setUTCHours(0, 0, 0, 0);

        const generatedForDay = now.toISOString().split("T")[0];

        // Store guidance
        const newGuidance = await Guidance.create({
            student: userId,
            triggerMoodEntry: moodEntryId,
            entriesUsed: usedEntries,
            generatedForDate,
            generatedForDay,
            analysisHeader: aiResponse.analysisHeader,

            contextSnapshot: {
                avgMoodScore: aiResponse.contextSnapshot?.avgMoodScore,
                avgStressLevel: aiResponse.contextSnapshot?.avgStressLevel,
                emotionalBalanceScore: aiResponse.contextSnapshot?.emotionalBalanceScore,
                dominantEmotions: aiResponse.contextSnapshot?.dominantEmotions || [],
                trend: aiResponse.contextSnapshot?.trend,
            },

            microActions: aiResponse.microActions || [],

            educationalInsight: aiResponse.educationalInsight,

            severity: aiResponse?.severity,

            referral: {
                recommended: aiResponse?.referral?.recommended || false,
                reason: aiResponse?.referral?.reason || "",
                matchCriteria: {
                    focusAreas: aiResponse?.referral?.matchCriteria?.focusAreas || [],
                    emotions: aiResponse?.referral?.matchCriteria?.emotions || [],
                    suggestedExpertise:
                        aiResponse?.referral?.matchCriteria?.suggestedExpertise || [],
                },
            },
        });

        // Store in redis immediately
        const todayKey = new Date().toISOString().split("T")[0];
        const redisKey = `guidance:${userId}:${todayKey}`;

        await redisClient.set(
            redisKey,
            JSON.stringify(newGuidance),
            "EX",
            60 * 60 * 24
        );
    },
    {
        connection,
        concurrency: 3,
    }
);

worker.on("completed", (job) => {
  console.log(`Guidance job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Guidance job ${job.id} failed`, err.message);
});

module.exports = worker;