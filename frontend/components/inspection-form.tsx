"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface InspectionFormProps {
  onAnalyze: (file: File) => void
}

export function InspectionForm({ onAnalyze }: InspectionFormProps) {
  const [formData, setFormData] = useState({
    location: "",
    siteId: `SITE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    file: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async () => {
    setIsLoading(true)
    if (formData.file) {
      await onAnalyze(formData.file);
    }
    setIsLoading(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-8">
      {/* Form Fields */}
      <div className="console-card space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Site Location</label>
          <input
            type="text"
            placeholder="e.g., Construction Site A, Building 42"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 rounded border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Site ID</label>
          <div className="px-4 py-2 rounded border border-border bg-muted/30 text-foreground font-mono text-sm">
            {formData.siteId}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Upload Inspection File</label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              className="hidden"
              id="file-upload"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                {formData.file ? (
                  <div>
                    <p className="font-medium text-foreground">✓ {formData.file.name}</p>
                    <p className="text-sm mt-1">Click to change</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-foreground">Drag and drop your file here</p>
                    <p className="text-sm mt-1">or click to select (PDF, JPG, PNG)</p>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" className="border-border hover:bg-card bg-transparent">
          Cancel
        </Button>
        <Button
          onClick={handleAnalyze}
          disabled={!formData.location || !formData.file || isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          {isLoading ? (
            <>
              <span className="inline-block animate-spin">⟳</span>
              Analyzing...
            </>
          ) : (
            "Analyze with AI →"
          )}
        </Button>
      </div>
    </motion.div>
  )
}
