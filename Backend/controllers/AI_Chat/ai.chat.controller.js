
const { generateUsingAI } = require("../../utils/AI/gemini.ai")
const mongoose = require("mongoose")
const { GetUserId, GetUserEmail } = require("../../utils/User/get.user.id")
const LogController = require("../System/logs/log.controller")
const Chat = require("../../models/AI/message.schema")

exports.AIChatController = async (request, response) => {
  try {
    const { prompt } = request.body
    const userId = GetUserId(request);
    request.body.email = GetUserEmail(request);


    if (!prompt) {
      return response.status(400).json({
        statusCode: 400,
        success: false,
        error: [
          {
            field: "popup",
            message: "Prompt is required"
          }
        ],
        message: ""
      })
    }

    //  Generate AI response
    const aiResponse = await generateUsingAI(prompt)

    //  Find existing chat or create new
    let chat = await Chat.findOne({ user: userId })

    if (!chat) {
      chat = new Chat({
        user: userId,
        messages: []
      })
    }

    // If you don't limit message array will keep going

    if (chat.messages.length > 100) {
        chat.messages = chat.messages.slice(-100)
    }

    // Push user message
    chat.messages.push({
      role: "user",
      content: prompt
    })

    //  Push AI response
    chat.messages.push({
      role: "assistant",
      content: aiResponse
    })

    await chat.save()

    await LogController(request,"Chat Session Completed","success",`Discussed ${prompt}`)

    response.status(200).json({
      statusCode: 200,
      success: true,
      error: [],
      message: "Response Generated Successfully",
      data: aiResponse
    })

  } catch (error) {
    await LogController(request,"api:info","failed",`${error?.message}`)
    response.status(500).json({
      statusCode: 500,
      success: false,
      error: [
        {
          field: "popup",
          message: error?.message || "Error in Generating AI Response"
        }
      ],
      message: ""
    })
  }
}