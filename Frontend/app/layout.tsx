import type { Metadata, Viewport } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'sonner'
import AuthInitializer from '@/components/system/auth-initializer'
import { Provider } from 'react-redux'
import ReduxProvider from '@/components/system/redux-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'MindBridge - Student Mental Health Support',
  description:
    'An accessible, intelligent, and confidential digital ecosystem helping students manage emotional distress, stress, and mental fatigue through AI-powered support.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#3d9b8f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} h-full`}>
      <body className="font-sans antialiased h-full min-h-screen">
        <Toaster position='top-right' richColors/>
        <ReduxProvider>
            <AuthInitializer>
            {children}
          </AuthInitializer>
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}
