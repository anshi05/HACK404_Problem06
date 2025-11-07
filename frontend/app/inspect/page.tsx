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
import { LoadingScreen } from "@/components/loading-screen"

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
  const [signPayloadResponse, setSignPayloadResponse] = useState<any>(null); // New state for sign payload response
  const [isSigning, setIsSigning] = useState(false); // New state for signing status
  const [showLoadingScreen, setShowLoadingScreen] = useState(false); // New state for loading screen for blockchain submission
  const [loadingText, setLoadingText] = useState<string[]>([]); // New state for loading screen text for blockchain submission
  const [showAnalysisLoading, setShowAnalysisLoading] = useState(false); // New state for analysis loading screen

  useEffect(() => {
    setStep("form");
    setAnalysisData(null);
    setUploadedFile(null); // Reset uploaded file
  }, []);

  const handleAnalyze = async (file: File) => {
    setShowAnalysisLoading(true); // Show analysis loading screen

    // Simulate 2-second loading, then proceed
    setTimeout(async () => {
      try {
        setUploadedFile(file); // Store the file
        const result = await analyzePdf(file);
        setAnalysisData({ ...result }); 
        setStep("analysis");
      } catch (error) {
        console.error("PDF analysis failed:", error);
        // Optionally, show an error message to the user
      } finally {
        setShowAnalysisLoading(false); // Hide analysis loading screen
      }
    }, 2000); // 2 second delay
  }

  const handleSubmitBlockchain = async (ipfsCid: string, contentHash: string) => {
    console.log("handleSubmitBlockchain called with IPFS CID:", ipfsCid, "and Content Hash:", contentHash); // Added for debugging
    if (analysisData) {
      setAnalysisData(prev => prev ? { ...prev, ipfs_cid: ipfsCid, content_hash: contentHash } : null);
    }
    setStep("confirm");

    // New logic to call /sign-payload directly
    setIsSigning(true); // Set signing state to true
    try {
      const response = await fetch(`http://localhost:8001/sign-payload?ipfs_cid=${ipfsCid}&summary=Routine%20inspection%20passed`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to sign payload");
      }

      const signPayloadResult = await response.json();
      console.log("Sign Payload Result from inspect/page.tsx:", signPayloadResult); // Log the result for debugging
      setSignPayloadResponse(signPayloadResult);
    } catch (error: any) {
      console.error("Error signing payload in inspect/page.tsx:", error);
      // Handle error, maybe show an error message to the user
    } finally {
      setIsSigning(false); // Reset signing state
    }
};

const startSubmissionLoading = (messages: string[]) => {
  setLoadingText(messages);
  setShowLoadingScreen(true);
};

const onMainLoadingComplete = () => {
  setShowLoadingScreen(false);
  setStep("confirm"); // Transition to confirm step after loading
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
            <AIAnalysisResult data={analysisData} file={uploadedFile} onSubmit={handleSubmitBlockchain} onStartLoading={startSubmissionLoading} />
          )}
          {step === "confirm" && analysisData && (
            <BlockchainSubmission 
              data={analysisData} 
              signPayloadResponse={signPayloadResponse} 
              isSigning={isSigning}
              onSubmissionComplete={() => setSignPayloadResponse(null)} // New prop being passed
            />
          )}
        </div>
      </div>

      {showLoadingScreen && (
        <LoadingScreen onComplete={onMainLoadingComplete} terminalText={loadingText} />
      )}

      {showAnalysisLoading && (
        <LoadingScreen onComplete={() => {}} terminalText={["> ANALYZING DOCUMENT...", "> PERFORMING FORGERY CHECKS..."]} />
      )}

      <Footer />
    </main>
  )
}
