"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth, type UserRole } from "@/lib/auth"
import { motion } from "framer-motion"
import Link from "next/link"

export default function AuthPage() {
  const [step, setStep] = useState<"method" | "login" | "signup">("method")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("inspector")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, connectWallet } = useAuth()
  const router = useRouter()

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: "inspector", label: "Inspector", desc: "Submit site inspections" },
    { role: "manager", label: "Manager", desc: "Review and approve reports" },
    { role: "auditor", label: "Auditor", desc: "Final sign-off authority" },
    { role: "regulator", label: "Regulator", desc: "Monitor compliance" },
  ]

  const handleLogin = async () => {
    setIsLoading(true)
    setError("")
    try {
      await login(email, password, selectedRole)
      router.push("/")
    } catch (err) {
      setError("Invalid credentials. Try inspector@complichain.com / inspector123")
    }
    setIsLoading(false)
  }

  const handleWalletConnect = async () => {
    try {
      // In real implementation, use Web3Modal or wagmi
      const mockAddress = "0x" + Math.random().toString(16).substr(2, 40)
      await connectWallet(mockAddress)
      router.push("/")
    } catch (err) {
      setError("Wallet connection failed")
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="console-card space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition">
              <div className="text-2xl font-bold text-foreground">
                COMPLI<span className="text-accent">CHAIN</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Access Portal</h1>
            <p className="text-sm text-muted-foreground">Select your role to continue</p>
          </div>

          {step === "method" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <motion.button
                    key={r.role}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRole(r.role)}
                    className={`p-4 rounded border-2 transition-all text-center ${
                      selectedRole === r.role
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-transparent text-foreground hover:border-accent/50"
                    }`}
                  >
                    <div className="font-semibold text-sm">{r.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
                  </motion.button>
                ))}
              </div>

              {/* Auth Method Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => setStep("login")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                  size="lg"
                >
                  Login
                </Button>
                <Button
                  onClick={handleWalletConnect}
                  variant="outline"
                  className="w-full border-2 border-accent text-accent hover:bg-accent/10 font-bold bg-transparent"
                  size="lg"
                >
                  Connect Wallet
                </Button>
              </div>
            </motion.div>
          )}

          {step === "login" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`${selectedRole}@complichain.com`}
                  className="w-full px-4 py-2 rounded border border-border bg-input text-foreground focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded border border-border bg-input text-foreground focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="p-3 rounded bg-destructive/10 border border-destructive/50 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded border border-border">
                Demo: {selectedRole}@complichain.com / {selectedRole}123
              </div>

              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                size="lg"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <Button
                onClick={() => setStep("method")}
                variant="outline"
                className="w-full border-border hover:bg-card bg-transparent"
              >
                Back
              </Button>
            </motion.div>
          )}
        </div>

        {/* Help text */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-primary hover:text-accent transition-colors">
            Return to Home
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
