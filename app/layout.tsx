import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HY MBAGRAD - Complete CAT Preparation at Zero Cost",
  description: "India's #1 Free CAT Platform. Join 10,000+ CAT aspirants getting free Mock Tests, PYQs, NCERT Books and 24/7 AI Guidance.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}