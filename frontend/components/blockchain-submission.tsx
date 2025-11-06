"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BlockchainSubmissionProps {
  data: any
}

type SubmissionStep = "uploading" | "signing" | "confirmed" | "success"

export function BlockchainSubmission({ data }: BlockchainSubmissionProps) {
  const [step, setStep] = useState<SubmissionStep>("uploading")
  const [transactionHash, setTransactionHash] = useState("0x" + Math.random().toString(16).substr(2, 40).toUpperCase())
  const [ipfsHash, setIpfsHash] = useState("QmX" + Math.random().toString(36).substr(2, 44))

  useEffect(() => {
    const timeline = [
      { delay: 0, newStep: "uploading" as SubmissionStep },
      { delay: 2000, newStep: "signing" as SubmissionStep },
      { delay: 4000, newStep: "confirmed" as SubmissionStep },
      { delay: 6000, newStep: "success" as SubmissionStep },
    ]

    const timers = timeline.map(({ delay, newStep }) => setTimeout(() => setStep(newStep), delay))

    return () => timers.forEach(clearTimeout)
  }, [])

  const steps = [
    { id: "uploading", label: "Upload to IPFS", icon: "⬆" },
    { id: "signing", label: "Sign Transaction", icon: "✍" },
    { id: "confirmed", label: "Transaction Confirmed", icon: "✓" },
  ]

  if (step === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="console-card border-accent/50 bg-gradient-to-br from-accent/10 to-transparent text-center py-12 space-y-8"
      >
        <div className="text-6xl animate-pulse">✓</div>
        <div>
          <h2 className="text-3xl font-bold text-accent mb-2">Inspection Recorded</h2>
          <p className="text-muted-foreground">
            Your safety inspection has been successfully recorded on the blockchain
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 bg-primary/10 rounded p-6 border border-primary/20">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Inspector Address</p>
            <p className="font-mono text-xs text-foreground break-all">0x12f3K9a...abC9E7f</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
            <p className="font-mono text-xs text-primary">{transactionHash}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Compliance Score</p>
            <p className="text-lg font-bold text-foreground">{data.complianceScore}/10</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">IPFS Hash</p>
            <p className="font-mono text-xs text-accent break-all">{ipfsHash}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">View on Explorer</Button>
          <Link href="/inspect">
            <Button variant="outline" className="border-border hover:bg-card bg-transparent">
              Start New Inspection
            </Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-12"
    >
      {/* Progress Steps */}
      <div className="console-card">
        <h2 className="text-xl font-bold text-foreground mb-8">Blockchain Submission</h2>

        <div className="space-y-6">
          {steps.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex items-center gap-4"
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${
                  step === s.id || (steps.findIndex((st) => st.id === step) > idx)
                    ? "bg-accent/20 border border-accent text-accent"
                    : "bg-muted border border-border text-muted-foreground"
                }`}
              >
                {step === s.id ? <span className="animate-spin">⟳</span> : s.icon}
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium transition-colors ${step === s.id || (steps.findIndex((st) => st.id === step) > idx) ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {s.label}
                </p>
              </div>
              {steps.findIndex((st) => st.id === step) > idx && <span className="text-accent">✓</span>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Details Card */}
      <div className="console-card space-y-4">
        <h3 className="font-semibold text-foreground">Inspection Summary</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-muted-foreground mb-2">Location</p>
            <p className="text-foreground font-mono">{data.location}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-2">Compliance Score</p>
            <p className="text-foreground font-bold">{data.complianceScore}/10</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-2">Site ID</p>
            <p className="text-foreground font-mono text-xs">{data.siteId}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-2">Status</p>
            <span className="score-badge">{data.status}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
