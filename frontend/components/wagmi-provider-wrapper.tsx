'use client'

import { WagmiConfig } from 'wagmi'
import { QueryClientProvider } from "@tanstack/react-query";
import { config, queryClient } from '@/lib/wagmi-config'
import { ReactNode } from 'react'

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  )
}
