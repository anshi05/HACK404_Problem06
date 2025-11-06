import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "inspector" | "manager" | "auditor" | "regulator"

export interface User {
  id: string
  email: string
  walletAddress: string
  role: UserRole
  name: string
  organization: string
}

export interface AuthStore {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  connectWallet: (address: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

// Mock users for demonstration
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "inspector@complichain.com": {
    password: "inspector123",
    user: {
      id: "1",
      email: "inspector@complichain.com",
      walletAddress: "0x1234...5678",
      role: "inspector",
      name: "John Inspector",
      organization: "SafeCheck Inc",
    },
  },
  "manager@complichain.com": {
    password: "manager123",
    user: {
      id: "2",
      email: "manager@complichain.com",
      walletAddress: "0x9876...5432",
      role: "manager",
      name: "Sarah Manager",
      organization: "SafeCheck Inc",
    },
  },
  "auditor@complichain.com": {
    password: "auditor123",
    user: {
      id: "3",
      email: "auditor@complichain.com",
      walletAddress: "0xabcd...ef01",
      role: "auditor",
      name: "Mike Auditor",
      organization: "Compliance Audits Ltd",
    },
  },
  "regulator@complichain.com": {
    password: "regulator123",
    user: {
      id: "4",
      email: "regulator@complichain.com",
      walletAddress: "0xfedc...ba98",
      role: "regulator",
      name: "Alice Regulator",
      organization: "Safety Authority",
    },
  },
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      login: async (email: string, password: string, role: UserRole) => {
        const mockUser = MOCK_USERS[email]
        if (mockUser && mockUser.password === password) {
          set({ user: mockUser.user, isLoggedIn: true })
          console.log("[v0] User logged in:", email, "Role:", role)
        } else {
          throw new Error("Invalid credentials")
        }
      },

      connectWallet: async (address: string) => {
        set((state) => {
          if (state.user) {
            return {
              user: { ...state.user, walletAddress: address },
              isLoggedIn: true,
            }
          }
          return state
        })
        console.log("[v0] Wallet connected:", address)
      },

      logout: () => {
        set({ user: null, isLoggedIn: false })
        console.log("[v0] User logged out")
      },

      setUser: (user: User) => {
        set({ user, isLoggedIn: true })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
