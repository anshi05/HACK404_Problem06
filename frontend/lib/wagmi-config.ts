'use client'

import { createConfig } from 'wagmi'
import { hardhat, mainnet } from 'wagmi/chains'
import { http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient()

export const config = createConfig({
  chains: [mainnet, hardhat],
  transports: {
    [mainnet.id]: http(),
    [hardhat.id]: http(),
  },
  connectors: [
    injected({ target: 'metaMask' }),
  ],
})
