"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ManagerDashboard } from "@/components/manager-dashboard"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth"
import Link from "next/link"

export default function ManagerDashboardPage() {
  const [walletConnected, setWalletConnected] = useState(false)
  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn || user?.role !== "manager") {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <Navigation walletConnected={walletConnected} onWalletConnect={() => setWalletConnected(!walletConnected)} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Access Restricted</h1>
            <p className="text-muted-foreground">This page is only available to managers</p>
            <Link href="/auth">
              <button className="px-6 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded font-bold">
                Login as Manager
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navigation walletConnected={walletConnected} onWalletConnect={() => setWalletConnected(!walletConnected)} />

      <div className="flex-1 px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-foreground">Manager Review Panel</h1>
              <motion.div className="text-sm text-muted-foreground bg-primary/10 px-4 py-2 rounded border border-primary/30">
                {user?.name}
              </motion.div>
            </div>
            <p className="text-muted-foreground">Review and approve safety inspections submitted by inspectors</p>
          </motion.div>

          <ManagerDashboard />
        </div>
      </div>

      <Footer />
    </main>
  )
}
