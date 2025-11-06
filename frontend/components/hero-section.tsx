"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Link from "next/link"

export function HeroSection() {
  const [displayedText, setDisplayedText] = useState("")
  const terminalText = ["> INIT SEQUENCE v2.4", "> LOADING MODULES", "> ACCESS GRANTED", "> CONTINUE..."]
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let index = 0
    let charIndex = 0
    let currentText = ""

    const typeInterval = setInterval(() => {
      if (index < terminalText.length) {
        if (charIndex < terminalText[index].length) {
          currentText += terminalText[index][charIndex]
          setDisplayedText(currentText)
          charIndex++
        } else {
          currentText += "\n"
          setDisplayedText(currentText)
          index++
          charIndex = 0
        }
      } else {
        clearInterval(typeInterval)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10" />
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-accent/20"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", stiffness: 30, damping: 20 }}
      />

      {/* Terminal lines - top left corner */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute left-4 md:left-12 top-20 font-mono text-sm text-primary whitespace-pre-wrap break-words"
      >
        {displayedText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          className="inline-block w-2 h-4 bg-primary ml-1"
        />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-20 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-52 h-48"
          >
            <img src="/logo.png" alt="AuditVault Logo" className="w-full h-full" />
          </motion.div>

          {/* Main Heading */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="text-5xl md:text-7xl font-black tracking-tight">
                <span className="text-foreground">Audit</span>
                <motion.span
                  className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent inline"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Vault
                </motion.span>
              </div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-foreground/80 font-light tracking-wide"
              >
                Immutable Safety. Transparent Compliance.
              </motion.p>
            </motion.div>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-4 text-xs md:text-sm font-mono text-foreground/60"
            >
              <span>COMPLIANCE TRACKING</span>
              <span className="text-accent">|</span>
              <span>BLOCKCHAIN VERIFIED</span>
              <span className="text-accent">|</span>
              <span>SAFETY AUDITS</span>
            </motion.div>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
          >
            <Link href="/inspect">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-foreground font-bold rounded-lg text-sm md:text-base transition-all hover:shadow-lg"
              >
                START INSPECTION
              </motion.button>
            </Link>

            <Link href="/auth">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 197, 211, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-accent text-accent font-bold rounded-lg text-sm md:text-base hover:bg-accent/10 transition-all"
              >
                VIEW DASHBOARD
              </motion.button>
            </Link>
          </motion.div>

          {/* Connect Wallet Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border-2 border-foreground/30 text-foreground/70 hover:text-foreground hover:border-accent font-mono text-sm rounded-lg transition-all"
          >
            CONNECT WALLET
          </motion.button>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
            className="text-center text-accent/60 font-mono text-xs mt-12"
          >
            [ SCROLL TO EXPLORE ]
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
