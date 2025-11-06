"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { InspectionForm } from "@/components/inspection-form"
import { AIAnalysisResult } from "@/components/ai-analysis-result"
import { motion } from "framer-motion"
import { analyzePdf } from "@/lib/analysis"

type Step = "form" | "analysis" | "confirm"

export default function InspectPage() {
  const [step, setStep] = useState<Step>("form")
  const [walletConnected, setWalletConnected] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)

  const handleAnalyze = async (file: File) => {
    try {
      const result = await analyzePdf(file);
      setAnalysisData(result);
      setStep("analysis");
    } catch (error) {
      console.error("PDF analysis failed:", error);
      // Optionally, show an error message to the user
    }
  }

  const handleSubmitBlockchain = () => {
    setStep("confirm")
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navigation walletConnected={walletConnected} onWalletConnect={() => setWalletConnected(!walletConnected)} />

      <div className="flex-1 px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">Submit New Safety Inspection</h1>
            <p className="text-muted-foreground">
              Upload your inspection documents for AI analysis and blockchain recording
            </p>
          </motion.div>

          {step === "form" && <InspectionForm onAnalyze={handleAnalyze} />}
          {step === "analysis" && analysisData && (
            <AIAnalysisResult data={analysisData} onSubmit={handleSubmitBlockchain} />
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
