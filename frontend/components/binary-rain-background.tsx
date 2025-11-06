"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { BinaryColumn } from "./binary-column"

export function BinaryRainBackground() {
  const [columns, setColumns] = useState<number[]>([])

  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth
      const columnCount = Math.floor(width / 20)
      setColumns(Array.from({ length: columnCount }, (_, i) => i))
    }

    calculateColumns()
    window.addEventListener('resize', calculateColumns)
    
    return () => window.removeEventListener('resize', calculateColumns)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,81,169,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,81,169,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Binary rain columns */}
      <div className="flex justify-between absolute inset-0">
        {columns.map((colIndex) => (
          <BinaryColumn key={colIndex} delay={colIndex * 100} />
        ))}
      </div>
      
      {/* Animated glow effects */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-600/10 to-transparent"
        animate={{
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}
