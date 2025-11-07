"use client"

import { useState, useEffect } from 'react'

// Type definitions for Ethereum
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on: (event: string, callback: (...args: any[]) => void) => void
  removeListener: (event: string, callback: (...args: any[]) => void) => void
  removeAllListeners?: (event?: string) => void
  selectedAddress?: string
  isMetaMask?: boolean
  chainId?: string
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

interface UseWalletReturn {
  walletConnected: boolean
  account: string | null
  isConnecting: boolean
  hasMetaMask: boolean
  connectWallet: () => Promise<boolean>
  disconnectWallet: () => void
  checkWalletConnection: () => Promise<void>
  installMetaMask: () => void
}

export function useWallet(): UseWalletReturn {
  const [walletConnected, setWalletConnected] = useState<boolean>(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(false)

  // Check if MetaMask is installed and if wallet is already connected
  useEffect(() => {
    const checkInitialState = async () => {
      await checkMetaMaskInstallation()
      await checkWalletConnection()
    }
    
    checkInitialState()
  }, [])

  const checkMetaMaskInstallation = async (): Promise<boolean> => {
    const ethereum = window.ethereum
    
    if (!ethereum) {
      setHasMetaMask(false)
      return false
    }

    const isMetaMask = !!ethereum.isMetaMask
    const hasMetaMaskMethods = typeof ethereum.request === 'function'
    
    const detected = isMetaMask || hasMetaMaskMethods
    
    setHasMetaMask(detected)
    return detected
  }

  const checkWalletConnection = async (): Promise<void> => {
    if (!window.ethereum) {
      setHasMetaMask(false)
      return
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      }) as string[]
      
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setWalletConnected(true)
        setHasMetaMask(true)
      } else {
        setWalletConnected(false)
        setAccount(null)
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
      setHasMetaMask(true)
    }
  }

  const connectWallet = async (): Promise<boolean> => {
    const metaMaskDetected = await checkMetaMaskInstallation()
    
    if (!metaMaskDetected) {
      if (confirm('MetaMask is not detected. Would you like to install it?')) {
        installMetaMask()
      }
      return false
    }

    if (!window.ethereum) {
      setHasMetaMask(false)
      return false
    }

    setIsConnecting(true)
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[]
      
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setWalletConnected(true)
        setHasMetaMask(true)
        setIsConnecting(false)
        return true
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      setIsConnecting(false)
      
      if (error.code === 4001) {
        alert('Connection rejected by user. Please try again and approve the connection.')
      } else {
        alert(`Error connecting wallet: ${error.message || 'Please try again.'}`)
      }
      return false
    }
    
    setIsConnecting(false)
    return false
  }

  const disconnectWallet = (): void => {
    // Note: We cannot programmatically disconnect from MetaMask
    // This just clears the local state
    setWalletConnected(false)
    setAccount(null)
    
    // You can also clear any wallet-related data from localStorage/sessionStorage
    localStorage.removeItem('walletConnected')
    sessionStorage.removeItem('walletAccount')
    
    console.log('Wallet disconnected from app (local state cleared)')
  }

  const installMetaMask = (): void => {
    window.open('https://metamask.io/download.html', '_blank')
  }

  // Listen for account changes
  useEffect(() => {
    const ethereum = window.ethereum
    if (!ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('Accounts changed:', accounts)
      if (accounts.length === 0) {
        // User disconnected their wallet from MetaMask
        setWalletConnected(false)
        setAccount(null)
      } else {
        setAccount(accounts[0])
        setWalletConnected(true)
      }
    }

    const handleChainChanged = (chainId: string) => {
      console.log('Chain changed:', chainId)
      window.location.reload()
    }

    const handleDisconnect = (error: any) => {
      console.log('Disconnected from MetaMask:', error)
      setHasMetaMask(false)
      setWalletConnected(false)
      setAccount(null)
    }

    ethereum.on('accountsChanged', handleAccountsChanged)
    ethereum.on('chainChanged', handleChainChanged)
    ethereum.on('disconnect', handleDisconnect)

    return () => {
      ethereum.removeListener?.('accountsChanged', handleAccountsChanged)
      ethereum.removeListener?.('chainChanged', handleChainChanged)
      ethereum.removeListener?.('disconnect', handleDisconnect)
      
      if (ethereum.removeAllListeners) {
        ethereum.removeAllListeners('accountsChanged')
        ethereum.removeAllListeners('chainChanged')
        ethereum.removeAllListeners('disconnect')
      }
    }
  }, [])

  return {
    walletConnected,
    account,
    isConnecting,
    hasMetaMask,
    connectWallet,
    disconnectWallet,
    checkWalletConnection,
    installMetaMask
  }
}