"use client"

import { useCallback, useEffect, useRef } from "react"

export function useMousePositionRef() {
  const mousePosition = useRef({ x: 0, y: 0 })

  const updateMousePosition = useCallback((e: MouseEvent) => {
    // Get viewport width/height for calculating normalized position
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Calculate position as ratio of viewport (0 to 1)
    const normalizedX = e.clientX / viewportWidth
    const normalizedY = e.clientY / viewportHeight
    
    // Convert to range -1 to 1 for easier parallax calculations
    const x = (normalizedX * 2) - 1
    const y = (normalizedY * 2) - 1
    
    mousePosition.current = { x, y }
  }, [])

  useEffect(() => {
    // Set initial position to center
    mousePosition.current = { x: 0, y: 0 }
    
    // Add event listener
    window.addEventListener("mousemove", updateMousePosition)
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [updateMousePosition])

  return mousePosition
} 