import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FlowAI - Workflow Builder',
  description: 'Visual LLM workflow builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-zinc-950 text-white antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}