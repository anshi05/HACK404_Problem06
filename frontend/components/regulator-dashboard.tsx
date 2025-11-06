"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ExportPanel } from "@/components/export-panel"

const COMPLIANCE_DATA = [
  { day: "Jan 1", score: 72 },
  { day: "Jan 8", score: 75 },
  { day: "Jan 15", score: 78 },
  { day: "Jan 22", score: 81 },
  { day: "Jan 29", score: 79 },
  { day: "Feb 5", score: 85 },
]

const RECENT_ALERTS = [
  { id: 1, site: "Downtown Site A", issue: "Fire safety certificate expired", date: "2025-01-06" },
  { id: 2, site: "Industrial Facility B", issue: "Electrical hazard detected", date: "2025-01-05" },
  { id: 3, site: "Office Building C", issue: "Emergency exit blocked", date: "2025-01-04" },
  { id: 4, site: "Factory Complex", issue: "PPE compliance low", date: "2025-01-03" },
]

export function RegulatorDashboard() {
  const statCards = [
    { label: "Total Sites", value: 24, icon: "📍" },
    { label: "Safe Sites", value: 20, icon: "✓", color: "accent" },
    { label: "Warning Sites", value: 3, icon: "⚠", color: "yellow" },
    { label: "Critical Sites", value: 1, icon: "🛑", color: "destructive" },
  ]

  const mockRecords = [
    {
      siteId: "SITE-A1B2C3",
      location: "Downtown Site A",
      complianceScore: 8.5,
      status: "approved",
      inspectorAddress: "0x12f3K9a...abC9",
      timestamp: "2025-01-06",
      transactionHash: "0x1234...5678",
    },
    {
      siteId: "SITE-D4E5F6",
      location: "Industrial Facility B",
      complianceScore: 7.2,
      status: "pending",
      inspectorAddress: "0x5Ka9x2L...mN1O",
      timestamp: "2025-01-05",
      transactionHash: "0x9999...aaaa",
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="console-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Compliance Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="console-card"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">Compliance Trend (Last 90 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={COMPLIANCE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ fill: "var(--accent)", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="console-card"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">Recent Alerts</h2>
        <div className="space-y-3">
          {RECENT_ALERTS.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 border border-border/50 rounded hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{alert.site}</p>
                  <p className="text-sm text-muted-foreground mt-1">{alert.issue}</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{alert.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="console-card"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">Export & Reporting</h2>
        <ExportPanel records={mockRecords} title="Compliance Records" />
      </motion.div>

      {/* Export Actions */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" className="border-border hover:bg-card gap-2 bg-transparent">
          📄 Export PDF
        </Button>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">⬇ Download CSV</Button>
      </div>
    </motion.div>
  )
}
