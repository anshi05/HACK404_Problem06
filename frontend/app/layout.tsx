import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { NotificationToast } from "@/components/notification-toast"
import { LoadingProvider } from "@/components/loading-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AuditVault - Decentralized Compliance Platform",
  description: "Immutable Safety. Transparent Compliance.",
  icons: { icon: "/logo2.png" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased relative bg-background bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,81,169,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,81,169,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <LoadingProvider>
          <div className="relative z-10">{children}</div>
        </LoadingProvider>
        <NotificationToast />
      </body>
    </html>
  )
}
