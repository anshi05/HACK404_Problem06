"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ProblemSolutionSection } from "@/components/problem-solution-section"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useLoading } from "@/components/loading-provider"

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    // stopLoading() // Removed: Loader now controls its own visibility duration

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleWalletConnect = async () => {
    if (walletConnected) {
      setWalletConnected(false)
      return
    }

    try {
      startLoading(["> CONNECTING TO AUDITVAULT NETWORK...", "> AUTHENTICATING WALLET...", "> SECURE CONNECTION ESTABLISHED."])
      console.log("[v0] Wallet connection initiated")
      setWalletConnected(true)
      console.log("[v0] Wallet connected successfully")
      // stopLoading() - This will be handled by the next page's useEffect
    } catch (error) {
      console.error("[v0] Wallet connection failed:", error)
      stopLoading() // Stop loading if connection fails
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <Navigation walletConnected={walletConnected} onWalletConnect={handleWalletConnect} isHomePage={true} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        <motion.div
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.015,
            y: -mousePosition.y * 0.015,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Problem and Solution Section */}
      <ProblemSolutionSection />

      <Footer />
    </main>
  )
}
