"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { BinaryRainBackground } from "./binary-rain-background"

export function LoadingScreen({ onComplete, terminalText }: { onComplete: () => void; terminalText: string[] }) {
  const [displayedText, setDisplayedText] = useState("")
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    let textIndex = 0
    let charIndex = 0
    let currentText = ""

    const typeInterval = setInterval(() => {
      if (textIndex < terminalText.length) {
        if (charIndex < terminalText[textIndex].length) {
          currentText += terminalText[textIndex][charIndex]
          setDisplayedText(currentText)
          charIndex++
        } else {
          currentText += "\n"
          setDisplayedText(currentText)
          textIndex++
          charIndex = 0
        }
      } else {
        clearInterval(typeInterval)
      }
    }, 70)

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 100) {
          return prev + 8
        }
        clearInterval(progressInterval)
        return 100
      })
    }, 50)

    const minDisplayTime = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => {
      clearInterval(typeInterval)
      clearInterval(progressInterval)
      clearTimeout(minDisplayTime)
    }
  }, [onComplete, terminalText])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-background text-primary overflow-hidden"
    >
      {/* Hacker-style binary rain background */}
      <BinaryRainBackground />
      
      {/* Main content overlay */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center space-y-8 p-8 max-w-lg w-full bg-background/80 backdrop-blur-sm rounded-lg border border-purple-500/30 shadow-lg shadow-purple-500/20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-mono text-sm md:text-base text-center whitespace-pre-wrap break-words"
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-primary ml-1"
            />
          </motion.div>

          <div className="w-full max-w-md">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg shadow-purple-500/50"
            />
            <div className="font-mono text-xs text-foreground/70 mt-2 text-center">
              LOADING: {loadingProgress}%
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}