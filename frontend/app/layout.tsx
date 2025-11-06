import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { NotificationToast } from "@/components/notification-toast"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CompliChain - Decentralized Compliance Platform",
  description: "Immutable Safety. Transparent Compliance.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased relative`}>
        <div className="relative z-10">{children}</div>
        <NotificationToast />
      </body>
    </html>
  )
}
