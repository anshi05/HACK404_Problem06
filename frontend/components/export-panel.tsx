"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { exportService } from "@/lib/export"
import { motion } from "framer-motion"

interface ExportPanelProps {
  records: any[]
  title?: string
}

export function ExportPanel({ records, title = "Records" }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: "csv" | "pdf") => {
    setIsExporting(true)
    try {
      const timestamp = new Date().toISOString().split("T")[0]
      const filename = `${title.toLowerCase()}-${timestamp}`

      if (format === "csv") {
        await exportService.exportCSV(records, `${filename}.csv`)
      } else {
        await exportService.exportPDF(records, `${filename}.pdf`)
      }

      console.log(`[v0] Export successful: ${filename}.${format}`)
    } catch (error) {
      console.error("[v0] Export failed:", error)
    }
    setIsExporting(false)
  }

  const summary = exportService.generateSummary(records)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        <div className="console-card text-center">
          <p className="text-muted-foreground mb-1">Total</p>
          <p className="text-lg font-bold text-foreground">{summary.totalRecords}</p>
        </div>
        <div className="console-card text-center">
          <p className="text-muted-foreground mb-1">Approved</p>
          <p className="text-lg font-bold text-accent">{summary.approved}</p>
        </div>
        <div className="console-card text-center">
          <p className="text-muted-foreground mb-1">Pending</p>
          <p className="text-lg font-bold text-primary">{summary.pending}</p>
        </div>
        <div className="console-card text-center">
          <p className="text-muted-foreground mb-1">Avg Score</p>
          <p className="text-lg font-bold text-foreground">{summary.averageScore.toFixed(1)}</p>
        </div>
        <div className="console-card text-center">
          <p className="text-muted-foreground mb-1">Critical</p>
          <p className="text-lg font-bold text-destructive">{summary.criticalIssues}</p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button
          onClick={() => handleExport("csv")}
          disabled={isExporting || records.length === 0}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
        >
          {isExporting ? "Exporting..." : "⬇ Download CSV"}
        </Button>
        <Button
          onClick={() => handleExport("pdf")}
          disabled={isExporting || records.length === 0}
          variant="outline"
          className="gap-2 border-border hover:bg-card bg-transparent"
        >
          📄 Export PDF
        </Button>
      </div>
    </motion.div>
  )
}
