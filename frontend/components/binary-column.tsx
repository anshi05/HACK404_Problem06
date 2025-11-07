"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function BinaryColumn({ delay }: { delay: number }) {
  const [drops, setDrops] = useState<{ id: number; position: number; speed: number; value: string }[]>([])

  useEffect(() => {
    const createDrop = (id: number) => {
      const speed = 8 + Math.random() * 15 // Increased speed
      const value = Math.random() > 0.5 ? "1" : "0"
      return { id, position: -100, speed, value }
    }

    const initialDrops = Array.from({ length: 40 }, (_, i) => createDrop(i)) // Increased initial drops
    setDrops(initialDrops)

    const interval = setInterval(() => {
      setDrops(currentDrops => 
        currentDrops.map(drop => ({
          ...drop,
          position: drop.position + drop.speed
        })).filter(drop => drop.position < 150) // Adjusted threshold
        .map((drop, index) => drop.position < 150 ? drop : createDrop(Date.now() + index)) // Adjusted threshold
      )
    }, 15)

    return () => clearInterval(interval)
  }, [delay])

  return (
    <motion.div 
      className="relative flex-1"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: 0.8 }}
      transition={{ delay: delay / 3000, duration: 0.1 }}
    >
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute font-mono text-xs left-1/2 transform -translate-x-1/2"
          style={{
            top: `${drop.position}%`,
            color: drop.value === "1" ? "rgba(147, 51, 234, 0.8)" : "rgba(59, 130, 246, 0.6)",
            textShadow: "0 0 8px currentColor",
            opacity: 1
          }}
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {drop.value}
        </motion.div>
      ))}
    </motion.div>
  )
}
