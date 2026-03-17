"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Loader2,
  Heart,
  User,
  Sparkles,
  AlertTriangle,
} from "lucide-react"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from "axios"

const quickPrompts = [
  "I'm feeling overwhelmed with exams",
  "I can't seem to sleep well lately",
  "I'm having trouble concentrating",
  "I feel lonely on campus",
  "How can I manage my anxiety?",
  "I need help with time management stress",
]

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadig, setInitialLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setInput("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/ai-chats/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: text,
        }),
        credentials: 'include'
      })

      const result = await response.json()

      if (result.success) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.data,
        }

        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }


  const handleGetAllAiChats = async () => {
  try {
    setInitialLoading(true);
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/ai-chats/get/all`,
      { withCredentials: true }
    )

    if (response.data?.success && response.data?.data?.messages) {
      const formattedMessages: Message[] =
        response.data.data.messages.map((msg: any) => ({
          id: msg._id,
          role: msg.role,
          content: msg.content,
        }))

      setMessages(formattedMessages)
    }
  } catch (error: any) {
    console.log(error)
  } finally {
    setInitialLoading(false)
  }
}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }


  useEffect(()=>{
    handleGetAllAiChats();
  },[]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <EmptyState onSelectPrompt={handleQuickPrompt} />
          ) : (
            <div className="flex flex-col gap-6">
              {messages.map((message) => {
                const text = message.content

                const displayText = text
                  .replace(
                    /\[SENTIMENT:\s*(positive|neutral|negative|concerning)\]/gi,
                    ""
                  )
                  .trim()

                const sentimentMatch = text.match(
                  /\[SENTIMENT:\s*(positive|neutral|negative|concerning)\]/i
                )

                const sentiment = sentimentMatch
                  ? sentimentMatch[1].toLowerCase()
                  : null

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        message.role === "user"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Heart className="h-4 w-4" />
                      )}
                    </div>

                  <div
                    className={`max-w-full text-sm rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground border border-border"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold mb-2">{children}</strong>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              className="text-primary underline"
                            >
                              {children}
                            </a>
                          ),
                          code: ({ children }) => (
                            <code className="bg-muted px-1 py-0.5 my-2 rounded text-xs">
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {displayText}
                      </ReactMarkdown>
                    </div>

                      {sentiment && message.role === "assistant" && (
                        <SentimentIndicator sentiment={sentiment} />
                      )}

                      {isLoading &&
                        message === messages[messages.length - 1] &&
                        message.role === "assistant" && (
                          <Loader2 className="mt-1 h-3 w-3 animate-spin text-muted-foreground" />
                        )}
                    </div>
                  </div>
                )
              })}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl border border-border bg-card px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>MindBridge is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-card px-4 py-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-3"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind..."
            className="min-h-11 max-h-32 flex-1 resize-none text-sm"
            rows={1}
            disabled={isLoading}
          />

          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground">
          MindBridge AI provides supportive guidance, not professional diagnosis.
          If you are in crisis, please call 988.
        </p>
      </div>
    </div>
  )
}

function EmptyState({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mb-2 text-xl font-semibold">
        How can I support you today?
      </h2>
      <p className="mb-8 max-w-sm text-center text-sm text-muted-foreground">
        I am your confidential AI companion. Share what is on your mind.
      </p>
      <div className="grid max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground hover:border-primary/30 hover:bg-secondary hover:text-foreground"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

function SentimentIndicator({ sentiment }: { sentiment: string }) {
  const config: Record<string, { color: string; label: string }> = {
    positive: { color: "text-chart-1", label: "Positive tone detected" },
    neutral: { color: "text-chart-4", label: "Neutral tone detected" },
    negative: { color: "text-chart-5", label: "Stress signals detected" },
    concerning: {
      color: "text-destructive",
      label: "Elevated distress detected",
    },
  }

  const conf = config[sentiment] || config.neutral

  return (
    <div className={`mt-2 flex items-center gap-1.5 text-xs ${conf.color}`}>
      {sentiment === "concerning" ? (
        <AlertTriangle className="h-3 w-3" />
      ) : (
        <Sparkles className="h-3 w-3" />
      )}
      <span>{conf.label}</span>
    </div>
  )
}