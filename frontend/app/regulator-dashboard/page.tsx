"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { RegulatorDashboard } from "@/components/regulator-dashboard"
import { motion } from "framer-motion"

export default function RegulatorDashboardPage() {
  const [walletConnected, setWalletConnected] = useState(false)

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
            <h1 className="text-4xl font-bold text-foreground mb-2">Regulator Overview</h1>
            <p className="text-muted-foreground">Monitor compliance across all sites and facilities</p>
          </motion.div>

          <RegulatorDashboard />
        </div>
      </div>

      <Footer />
    </main>
  )
}
