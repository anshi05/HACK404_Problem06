"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { blockchainService } from "@/lib/blockchain"

interface AuditRecord {
  id: string
  siteId: string
  location: string
  managerApprovalDate: string
  complianceScore: number
  status: "pending_audit" | "final_approved" | "rejected"
  managerAddress: string
  inspectionDetails: string
}

const MOCK_AUDITS: AuditRecord[] = [
  {
    id: "1",
    siteId: "SITE-A1B2C3",
    location: "Downtown Construction Site",
    managerApprovalDate: "2025-01-06",
    complianceScore: 8.5,
    status: "pending_audit",
    managerAddress: "0x9876...5432",
    inspectionDetails: "Full safety inspection with AI analysis complete",
  },
  {
    id: "2",
    siteId: "SITE-D4E5F6",
    location: "Industrial Facility B",
    managerApprovalDate: "2025-01-05",
    complianceScore: 9.1,
    status: "pending_audit",
    managerAddress: "0x9876...5432",
    inspectionDetails: "Comprehensive compliance check passed",
  },
  {
    id: "3",
    siteId: "SITE-G7H8I9",
    location: "Office Building C",
    managerApprovalDate: "2025-01-04",
    complianceScore: 9.5,
    status: "final_approved",
    managerAddress: "0x9876...5432",
    inspectionDetails: "Audit completed and approved",
  },
]

export function AuditorDashboard() {
  const [audits, setAudits] = useState<AuditRecord[]>(MOCK_AUDITS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAuditApproval = async (id: string) => {
    setIsProcessing(true)
    try {
      const record = audits.find((a) => a.id === id)
      if (record) {
        console.log("[v0] Recording audit approval on blockchain for:", record.siteId)
        // In real app, pass actual auditor address from auth
        await blockchainService.auditApprovalOnBlockchain(id, "0xabcd...ef01")

        setAudits(audits.map((a) => (a.id === id ? { ...a, status: "final_approved" as const } : a)))
        console.log("[v0] Audit approval recorded successfully")
      }
    } catch (error) {
      console.error("[v0] Audit approval failed:", error)
    }
    setIsProcessing(false)
  }

  const handleAuditReject = (id: string) => {
    setAudits(audits.map((a) => (a.id === id ? { ...a, status: "rejected" as const } : a)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "final_approved":
        return "bg-accent/20 border-accent/50 text-accent"
      case "rejected":
        return "bg-destructive/20 border-destructive/50 text-destructive"
      default:
        return "bg-primary/20 border-primary/50 text-primary"
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            label: "Pending Audit",
            value: audits.filter((a) => a.status === "pending_audit").length,
            color: "primary",
          },
          {
            label: "Final Approved",
            value: audits.filter((a) => a.status === "final_approved").length,
            color: "accent",
          },
          {
            label: "Rejected",
            value: audits.filter((a) => a.status === "rejected").length,
            color: "destructive",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="console-card text-center"
          >
            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
            <p
              className={`text-3xl font-bold ${
                stat.color === "accent"
                  ? "text-accent"
                  : stat.color === "destructive"
                    ? "text-destructive"
                    : "text-primary"
              }`}
            >
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Audits Table */}
      <div className="console-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Site ID</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Location</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Score</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Status</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((audit) => (
              <motion.tr
                key={audit.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-border/50 hover:bg-primary/5 transition-colors"
              >
                <td className="px-4 py-3 text-foreground font-mono text-xs">{audit.siteId}</td>
                <td className="px-4 py-3 text-foreground">{audit.location}</td>
                <td className="px-4 py-3 font-bold text-accent">{audit.complianceScore}/10</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatusBadge(audit.status)}`}>
                    {audit.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  {audit.status === "pending_audit" && (
                    <>
                      <Button
                        size="sm"
                        disabled={isProcessing}
                        className="h-7 text-xs bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30"
                        onClick={() => handleAuditApproval(audit.id)}
                      >
                        {isProcessing ? "Recording..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30"
                        onClick={() => handleAuditReject(audit.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {audit.status !== "pending_audit" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-border hover:bg-card bg-transparent"
                      onClick={() => setSelectedId(audit.id)}
                    >
                      View
                    </Button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
