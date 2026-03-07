import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import ProtectedRoute from "@/components/system/protected-route"

export default function DashboardLayout({
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
