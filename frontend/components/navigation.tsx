"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth"
import { useNotifications } from "@/lib/notifications"
import { useRouter } from "next/navigation"
import { useLoading } from "@/components/loading-provider"
import { useWallet } from "@/lib/wallet"
import { useState, useRef, useEffect } from "react"

interface NavigationProps {
  isHomePage?: boolean
}

export function Navigation({ isHomePage }: NavigationProps) {
  const { user, isLoggedIn, logout } = useAuth()
  const { getUnreadCount } = useNotifications()
  const unreadCount = getUnreadCount()
  const router = useRouter()
  const { startLoading } = useLoading()
  
  const { 
    walletConnected, 
    account, 
    isConnecting, 
    hasMetaMask,
    connectWallet, 
    disconnectWallet,
    installMetaMask,
    checkWalletConnection
  } = useWallet()

  const [showWalletMenu, setShowWalletMenu] = useState<boolean>(false)
  const walletMenuRef = useRef<HTMLDivElement>(null)

  // Close wallet menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (walletMenuRef.current && !walletMenuRef.current.contains(event.target as Node)) {
        setShowWalletMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const dashboardLink = isLoggedIn
    ? user?.role === "manager"
      ? "/manager-dashboard"
      : user?.role === "auditor"
        ? "/auditor-dashboard"
        : user?.role === "regulator"
          ? "/regulator-dashboard"
          : "/history"
    : "/auth"

  const dashboardLabel = user?.role ? 
    user.role.charAt(0).toUpperCase() + user.role.slice(1) : 
    "Dashboard"

  const handleWalletConnect = async (): Promise<void> => {
    if (walletConnected) {
      // If already connected, show the menu
      setShowWalletMenu(!showWalletMenu)
      return
    }

    await checkWalletConnection()

    if (!hasMetaMask) {
      if (confirm('MetaMask is not detected. Would you like to install it?')) {
        installMetaMask()
      }
      return
    }

    const success = await connectWallet()
    if (success) {
      console.log('Wallet connected successfully:', account)
    }
  }

  const handleDisconnectWallet = (): void => {
    disconnectWallet()
    setShowWalletMenu(false)
    // Optional: Show a message to the user
    console.log('Wallet disconnected from the application')
  }

  const copyToClipboard = async (): Promise<void> => {
    if (account) {
      try {
        await navigator.clipboard.writeText(account)
        alert('Wallet address copied to clipboard!')
        setShowWalletMenu(false)
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
    }
  }

  const getWalletDisplayText = (): string => {
    if (!hasMetaMask) return "INSTALL METAMASK"
    if (isConnecting) return "CONNECTING..."
    if (walletConnected && account) {
      // Show shortened address
      return `✓ ${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    }
    return "CONNECT WALLET"
  }

  const getWalletButtonClass = (): string => {
    if (!hasMetaMask) {
      return "bg-yellow-500/20 border-yellow-500 text-yellow-600 hover:bg-yellow-500/30"
    }
    if (walletConnected) {
      return "bg-green-500/20 border-green-500 text-green-600 hover:bg-green-500/30"
    }
    if (isConnecting) {
      return "bg-gray-500/20 border-gray-500 text-gray-600 cursor-not-allowed"
    }
    return "border-blue-500/40 text-blue-600 hover:bg-blue-500/10 cursor-pointer"
  }

  const handleLogout = (): void => {
    // Also disconnect wallet when logging out
    if (walletConnected) {
      disconnectWallet()
    }
    logout()
    window.location.href = "/"
  }

  const handleLinkClick = (loadingMessages: string[]): void => {
    startLoading(loadingMessages)
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md ${
        isHomePage ? "bg-transparent border-transparent" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 group"
          onClick={() => handleLinkClick(["> LOADING HOME PAGE...", "> ANALYZING SYSTEM STATUS..."])}
        >
          <img src="/logo.png" alt="AuditVault" className="w-8 h-8" />
          <span className="font-bold text-foreground hidden sm:inline">
            Audit<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline audiowide-regular">Vault</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            onClick={() => handleLinkClick(["> LOADING HOME PAGE...", "> ANALYZING SYSTEM STATUS..."])}
            className="text-sm text-foreground/70 hover:text-accent transition-colors font-mono"
          >
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link
                href="/inspect"
                onClick={() => handleLinkClick(["> ACCESSING INSPECTION MODULE...", "> RETRIEVING PENDING TASKS..."])}
                className="text-sm text-foreground/70 hover:text-accent transition-colors font-mono"
              >
                Inspect
              </Link>
              <Link
                href={dashboardLink}
                onClick={() => handleLinkClick(["> AUTHENTICATING USER ROLE...", "> LOADING DASHBOARD DATA..."])}
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
              {/* Wallet Button with Dropdown */}
              <div className="relative" ref={walletMenuRef}>
                <motion.button
                  whileHover={{ scale: hasMetaMask && !isConnecting ? 1.05 : 1 }}
                  whileTap={{ scale: hasMetaMask && !isConnecting ? 0.95 : 1 }}
                  onClick={handleWalletConnect}
                  disabled={isConnecting}
                  className={`px-3 py-1 rounded border text-xs font-mono font-bold transition-all ${getWalletButtonClass()} ${
                    hasMetaMask && !isConnecting ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {getWalletDisplayText()}
                </motion.button>

                {/* Wallet Dropdown Menu */}
                {showWalletMenu && walletConnected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50"
                  >
                    <div className="p-4">
                      <div className="text-sm text-muted-foreground mb-2">Connected Wallet</div>
                      <div className="font-mono text-sm break-all mb-3 p-2 bg-muted rounded">
                        {account}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={copyToClipboard}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors"
                        >
                          📋 Copy Address
                        </button>
                        <button
                          onClick={handleDisconnectWallet}
                          className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors"
                        >
                          🚫 Disconnect Wallet
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
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