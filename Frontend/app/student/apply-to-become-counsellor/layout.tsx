import { Footer } from "@/components/common/footer"
import { Navbar } from "@/components/common/navbar"
import ProtectedRoute from "@/components/system/protected-route"



export default function ApplyCounsellorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ProtectedRoute>
        <main className="flex-1">{children}</main>
      </ProtectedRoute>
      <Footer />
    </div>
  )
}
