"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { BlockchainSubmission } from "@/components/blockchain-submission"

interface AIAnalysisResultProps {
  data: any
  onSubmit: () => void
}

export function AIAnalysisResult({ data, onSubmit }: AIAnalysisResultProps) {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return <BlockchainSubmission data={data} />
  }

  const scoreColor =
    data.complianceScore >= 8 ? "text-primary" : data.complianceScore >= 6 ? "text-yellow-500" : "text-destructive"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Score Card */}
      <div className="console-card border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
          <div className={`text-5xl font-bold ${scoreColor}`}>{data.complianceScore}/10</div>
        </div>
        <p className="text-muted-foreground text-sm">Compliance Score: {data.status}</p>
      </div>

      {/* Warnings */}
      {data.warnings.length > 0 && (
        <div className="console-card border-yellow-500/30 bg-yellow-500/5">
          <h3 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
            <span>⚠</span> Warnings
          </h3>
          <ul className="space-y-2">
            {data.warnings.map((warning: string, idx: number) => (
              <li key={idx} className="text-sm text-foreground/80 flex gap-2">
                <span className="text-muted-foreground">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Critical Issues */}
      {data.criticalIssues.length > 0 && (
        <div className="console-card border-destructive/30 bg-destructive/5">
          <h3 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
            <span>🛑</span> Critical Issues
          </h3>
          <ul className="space-y-2">
            {data.criticalIssues.map((issue: string, idx: number) => (
              <li key={idx} className="text-sm text-foreground/80 flex gap-2">
                <span className="text-muted-foreground">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <div className="console-card border-accent/30 bg-accent/5">
          <h3 className="text-lg font-semibold text-accent mb-4 flex items-center gap-2">
            <span>✓</span> Recommendations
          </h3>
          <ul className="space-y-2">
            {data.recommendations.map((rec: string, idx: number) => (
              <li key={idx} className="text-sm text-foreground/80 flex gap-2">
                <span className="text-accent">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Metadata */}
      <div className="console-card grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground mb-1">Location</p>
          <p className="text-foreground font-mono text-xs">{data.location}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Site ID</p>
          <p className="text-foreground font-mono text-xs">{data.siteId}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Timestamp</p>
          <p className="text-foreground font-mono text-xs">{new Date(data.timestamp).toLocaleDateString()}</p>
        </div>
      </div>

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
