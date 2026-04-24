const {GoogleGenAI} = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.generateUsingAI = async(prompt, isParse=false) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });


    const rawText = response.candidates[0]?.content.parts[0]?.text;

    // Remove markdown if Gemini adds it
    const cleanText = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    let answer = cleanText;

    if(isParse){
      answer = JSON.parse(cleanText);
    }

    return answer;

  } catch (err) {
    throw new Error(err?.message || "Error while using Ai")
  }
}
