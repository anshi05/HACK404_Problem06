"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { AnimatePresence } from "framer-motion"
import { LoadingScreen } from "./loading-screen"

interface LoadingContextType {
  isLoading: boolean
  startLoading: (messages?: string[]) => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

const DEFAULT_TERMINAL_TEXT = [
  "> INITIALIZING SYSTEM...",
  "> LOADING ESSENTIAL MODULES...",
  "> PROCESSING DATA...",
  "> READY.",
]

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentTerminalText, setCurrentTerminalText] = useState(DEFAULT_TERMINAL_TEXT)

  const startLoading = (messages?: string[]) => {
    if (messages) {
      setCurrentTerminalText(messages)
    } else {
      setCurrentTerminalText(DEFAULT_TERMINAL_TEXT)
    }
    setIsLoading(true)
  }
  const stopLoading = () => setIsLoading(false)

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={stopLoading} terminalText={currentTerminalText} />}
      </AnimatePresence>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
