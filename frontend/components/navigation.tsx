"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth"
import { useNotifications } from "@/lib/notifications"
import { useRouter } from "next/navigation"
import { useLoading } from "@/components/loading-provider"

interface NavigationProps {
  walletConnected: boolean
  onWalletConnect: () => void
}

export function Navigation({ walletConnected, onWalletConnect }: NavigationProps) {
  const { user, isLoggedIn, logout } = useAuth()
  const { getUnreadCount } = useNotifications()
  const unreadCount = getUnreadCount()
  const router = useRouter()
  const { startLoading } = useLoading()

  const dashboardLink = isLoggedIn
    ? user?.role === "manager"
      ? "/manager-dashboard"
      : user?.role === "auditor"
        ? "/auditor-dashboard"
        : user?.role === "regulator"
          ? "/regulator-dashboard"
          : "/inspect"
    : "/auth"

  const dashboardLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Dashboard"

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="AuditVault" className="w-8 h-8" />
          <span className="font-bold text-foreground hidden sm:inline">AuditVault</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            onClick={() => startLoading(["> LOADING HOME PAGE...", "> ANALYZING SYSTEM STATUS..."])}
            className="text-sm text-foreground/70 hover:text-accent transition-colors font-mono"
          >
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link
                href="/inspect"
                onClick={() => startLoading(["> ACCESSING INSPECTION MODULE...", "> RETRIEVING PENDING TASKS..."])}
                className="text-sm text-foreground/70 hover:text-accent transition-colors font-mono"
              >
                Inspect
              </Link>
              <Link
                href={dashboardLink}
                onClick={() => startLoading(["> AUTHENTICATING USER ROLE...", "> LOADING DASHBOARD DATA..."])}
                className="text-sm text-foreground/70 hover:text-accent transition-colors font-mono"
              >
                {dashboardLabel}
              </Link>
            </>
          )}
        </div>

        {/* Right section - Notifications and Auth */}
        <div className="flex items-center gap-4">
          {/* Notifications indicator */}
          {isLoggedIn && unreadCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="relative text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              🔔
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-accent-foreground rounded-full text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            </motion.div>
          )}

          {/* Auth Button */}
          {!isLoggedIn ? (
            <Link href="/auth">
              <button className="px-4 py-2 rounded border-2 border-accent text-accent hover:bg-accent/10 font-mono font-bold text-sm transition-all">
                LOGIN
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onWalletConnect}
                className={`px-3 py-1 rounded border text-xs font-mono font-bold transition-all cursor-pointer ${
                  walletConnected
                    ? "bg-accent/20 border-accent text-accent"
                    : "border-accent/40 text-accent hover:bg-accent/10"
                }`}
              >
                {walletConnected ? "✓ CONNECTED" : "WALLET"}
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  logout()
                  window.location.href = "/"
                }}
                className="px-4 py-2 rounded border-2 border-destructive/50 text-destructive hover:bg-destructive/10 font-mono font-bold text-sm transition-all"
              >
                LOGOUT
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
