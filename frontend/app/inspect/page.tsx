"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { InspectionForm } from "@/components/inspection-form"
import { AIAnalysisResult } from "@/components/ai-analysis-result"
import { BlockchainSubmission } from "@/components/blockchain-submission"
import { motion } from "framer-motion"
import { analyzePdf } from "@/lib/analysis"
import { uploadFile } from "@/lib/blockchain"

// Add these two interfaces
interface AnalysisResult {
  label: string;
  confidence: number;
  prob_fake: number;
  file: string;
  image_base64: string;
  final_label: string;
}

interface AnalysisSummary {
  real: number;
  fake: number;
  total: number;
}

interface AnalysisData {
  status: string;
  count: number;
  results: AnalysisResult[];
  summary: AnalysisSummary;
  ipfs_cid?: string; 
  content_hash?: string; 
}

type Step = "form" | "analysis" | "confirm"

export default function InspectPage() {
  const [step, setStep] = useState<Step>("form")
  const [walletConnected, setWalletConnected] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // Keep this state

  useEffect(() => {
    setStep("form");
    setAnalysisData(null);
    setUploadedFile(null); // Reset uploaded file
  }, []);

  const handleAnalyze = async (file: File) => {
    try {
      setUploadedFile(file); // Store the file
      const result = await analyzePdf(file);
      setAnalysisData({ ...result }); 
      setStep("analysis");
    } catch (error) {
      console.error("PDF analysis failed:", error);
      // Optionally, show an error message to the user
    }
  }

  const handleSubmitBlockchain = (ipfsCid: string, contentHash: string) => {
    if (analysisData) {
      setAnalysisData(prev => prev ? { ...prev, ipfs_cid: ipfsCid, content_hash: contentHash } : null);
    }
    setStep("confirm");
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navigation walletConnected={walletConnected} onWalletConnect={() => setWalletConnected(!walletConnected)} />

      <div className="flex-1 px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {step === "form" && (
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
          )}

          {step === "form" && <InspectionForm onAnalyze={handleAnalyze} />}
          {step === "analysis" && analysisData && uploadedFile && (
            <AIAnalysisResult data={analysisData} file={uploadedFile} onSubmit={handleSubmitBlockchain} />
          )}
          {step === "confirm" && analysisData && (
            <BlockchainSubmission data={analysisData} />
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
