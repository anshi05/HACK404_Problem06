"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { blockchainService } from "@/lib/blockchain"
import { useNotifications } from "@/lib/notifications"

interface Inspection {
  id: string
  siteId: string
  location: string
  inspector: string
  score: number
  status: "pending" | "approved" | "rejected"
  timestamp: string
}

const MOCK_DATA: Inspection[] = [
  {
    id: "1",
    siteId: "SITE-A1B2C3",
    location: "Downtown Construction Site",
    inspector: "0x12f3K9a...abC9",
    score: 8.5,
    status: "pending",
    timestamp: "2025-01-06",
  },
  {
    id: "2",
    siteId: "SITE-D4E5F6",
    location: "Industrial Facility B",
    inspector: "0x5Ka9x2L...mN1O",
    score: 7.2,
    status: "pending",
    timestamp: "2025-01-05",
  },
  {
    id: "3",
    siteId: "SITE-G7H8I9",
    location: "Office Building C",
    inspector: "0x3Qw9Rt...xY2Z",
    score: 9.1,
    status: "approved",
    timestamp: "2025-01-04",
  },
  {
    id: "4",
    siteId: "SITE-J1K2L3",
    location: "Factory Complex",
    inspector: "0x7Ab3Cd...eF4G",
    score: 5.8,
    status: "rejected",
    timestamp: "2025-01-03",
  },
]

export function ManagerDashboard() {
  const [inspections, setInspections] = useState<Inspection[]>(MOCK_DATA)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { addNotification } = useNotifications()

  const handleStatusChange = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      // Record approval on blockchain
      if (newStatus === "approved") {
        console.log("[v0] Approving on blockchain:", id)
        await blockchainService.approveOnBlockchain(id, "0x9876...5432")
        addNotification({
          type: "success",
          title: "Approval Recorded",
          message: "Inspection approval has been recorded on blockchain",
        })
      }

      setInspections(inspections.map((i) => (i.id === id ? { ...i, status: newStatus } : i)))
    } catch (error) {
      console.error("[v0] Approval failed:", error)
      addNotification({
        type: "error",
        title: "Approval Failed",
        message: "Failed to record approval on blockchain",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-accent/20 border-accent/50 text-accent"
      case "rejected":
        return "bg-destructive/20 border-destructive/50 text-destructive"
      default:
        return "bg-primary/20 border-primary/50 text-primary"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-accent"
    if (score >= 6) return "text-yellow-500"
    return "text-destructive"
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Total Inspections", value: inspections.length, color: "primary" },
          { label: "Approved", value: inspections.filter((i) => i.status === "approved").length, color: "accent" },
          { label: "Pending", value: inspections.filter((i) => i.status === "pending").length, color: "primary" },
          { label: "Rejected", value: inspections.filter((i) => i.status === "rejected").length, color: "destructive" },
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
              className={`text-3xl font-bold ${stat.color === "accent" ? "text-accent" : stat.color === "destructive" ? "text-destructive" : "text-primary"}`}
            >
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Inspections Table */}
      <div className="console-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">ID</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Location</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Inspector</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Score</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Status</th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((inspection) => (
              <motion.tr
                key={inspection.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-border/50 hover:bg-primary/5 transition-colors"
              >
                <td className="px-4 py-3 text-foreground font-mono text-xs">{inspection.siteId}</td>
                <td className="px-4 py-3 text-foreground">{inspection.location}</td>
                <td className="px-4 py-3 text-foreground font-mono text-xs">{inspection.inspector}</td>
                <td className={`px-4 py-3 font-bold ${getScoreColor(inspection.score)}`}>{inspection.score}/10</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor(inspection.status)}`}>
                    {inspection.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  {inspection.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30"
                        onClick={() => handleStatusChange(inspection.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30"
                        onClick={() => handleStatusChange(inspection.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {inspection.status !== "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-border hover:bg-card bg-transparent"
                      onClick={() => setSelectedId(inspection.id)}
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
