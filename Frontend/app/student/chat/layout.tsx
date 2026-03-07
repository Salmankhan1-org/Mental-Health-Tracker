import { Navbar } from "@/components/common/navbar"

export const metadata = {
  title: "AI Support Chat - MindBridge",
  description: "Chat with MindBridge AI companion for confidential emotional support and coping strategies.",
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      {children}
    </div>
  )
}
