import dynamic from "next/dynamic"

const ChatInterface = dynamic(()=>import("@/components/student/chat/chat-interface")) 

export default function ChatPage() {
  return <ChatInterface />
}
