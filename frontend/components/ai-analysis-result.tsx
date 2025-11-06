"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { BlockchainSubmission } from "@/components/blockchain-submission"

interface AnalysisResult {
  label: string;
  confidence: number;
  prob_fake: number;
  file: string;
}

interface AnalysisSummary {
  real: number;
  fake: number;
  total: number;
}

interface AIAnalysisResultProps {
  data: {
    status: string;
    count: number;
    results: AnalysisResult[];
    summary: AnalysisSummary;
  };
  onSubmit: () => void;
}

export function AIAnalysisResult({ data, onSubmit }: AIAnalysisResultProps) {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return <BlockchainSubmission data={data} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Summary Card */}
      <div className="console-card border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Analysis Summary</h2>
          <div className="text-5xl font-bold text-primary">{data.summary.real} / {data.summary.total}</div>
        </div>
        <p className="text-muted-foreground text-sm">Total Images Analyzed: {data.summary.total}</p>
        <p className="text-muted-foreground text-sm">Real Images: {data.summary.real}</p>
        <p className="text-muted-foreground text-sm">Fake Images: {data.summary.fake}</p>
      </div>

      {/* Results */}
      {data.results.length > 0 && (
        <div className="console-card border-accent/30 bg-accent/5">
          <h3 className="text-lg font-semibold text-accent mb-4 flex items-center gap-2">
            <span>📊</span> Detailed Results
          </h3>
          <ul className="space-y-4">
            {data.results.map((result: AnalysisResult, idx: number) => (
              <li key={idx} className="text-sm text-foreground/80 flex flex-col gap-1">
                <p><span className="font-medium">File:</span> {result.file}</p>
                <p><span className="font-medium">Label:</span> {result.label}</p>
                <p><span className="font-medium">Confidence:</span> {(result.confidence * 100).toFixed(2)}%</p>
                <p><span className="font-medium">Probability of Fake:</span> {(result.prob_fake * 100).toFixed(2)}%</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" className="border-border hover:bg-card bg-transparent">
          Back to Form
        </Button>
        <Button
          onClick={() => setSubmitted(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
        >
          Submit to Blockchain →
        </Button>
      </div>
    </motion.div>
  )
}
