import { create } from "zustand"

export interface InspectionRecord {
  id: string
  siteId: string
  location: string
  inspectorAddress: string
  inspectorName: string
  file?: File
  complianceScore: number
  status: "pending" | "approved" | "rejected" | "final_approved"
  warnings: string[]
  criticalIssues: string[]
  recommendations: string[]
  timestamp: string
  ipfsHash?: string
  transactionHash?: string
  managerApproval?: {
    approved: boolean
    address: string
    timestamp: number
    txHash: string
  }
  auditorApproval?: {
    approved: boolean
    address: string
    timestamp: number
    txHash: string
  }
}

interface InspectionStore {
  inspections: InspectionRecord[]
  addInspection: (inspection: InspectionRecord) => void
  updateInspection: (id: string, updates: Partial<InspectionRecord>) => void
  getInspectionsByRole: (role: string, userAddress?: string) => InspectionRecord[]
  getInspectionById: (id: string) => InspectionRecord | undefined
}

export const useInspectionStore = create<InspectionStore>((set, get) => ({
  inspections: [],

  addInspection: (inspection: InspectionRecord) => {
    set((state) => ({
      inspections: [...state.inspections, inspection],
    }))
    console.log("[v0] Inspection added:", inspection.id)
  },

  updateInspection: (id: string, updates: Partial<InspectionRecord>) => {
    set((state) => ({
      inspections: state.inspections.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }))
    console.log("[v0] Inspection updated:", id)
  },

  getInspectionsByRole: (role: string, userAddress?: string) => {
    const inspections = get().inspections
    switch (role) {
      case "inspector":
        return inspections.filter((i) => i.inspectorAddress === userAddress)
      case "manager":
        return inspections.filter((i) => i.status === "pending")
      case "auditor":
        return inspections.filter((i) => i.status === "approved")
      case "regulator":
        return inspections
      default:
        return []
    }
  },

  getInspectionById: (id: string) => {
    return get().inspections.find((i) => i.id === id)
  },
}))
