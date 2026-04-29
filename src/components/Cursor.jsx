"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export default function GsapCursor() {
  const dotRef = useRef(null)
  const borderRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e

      // Smooth follow for border circle
      gsap.to(borderRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.6,
        ease: "expo.out",
      })

      // Fast follow for center dot
      gsap.to(dotRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.1,
        ease: "power2.out",
      })
    }

    const handleHover = () => setIsHovering(true)
    const handleLeave = () => setIsHovering(false)

    window.addEventListener("mousemove", moveCursor)

    // Select all interactive elements
    const updateInteractivity = () => {
      const interactiveEls = document.querySelectorAll("a, button, [role='button'], .cursor-pointer")
      interactiveEls.forEach((el) => {
        el.addEventListener("mouseenter", handleHover)
        el.addEventListener("mouseleave", handleLeave)
      })
    }

    updateInteractivity()
    // Run again after a short delay to catch dynamic elements
    const timeoutId = setTimeout(updateInteractivity, 1000)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
      {/* Center dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Outer ring */}
      <div
        ref={borderRef}
        className={`absolute top-0 left-0 border border-indigo-500/30 rounded-full transition-all duration-300 ease-out
          ${isHovering ? "w-10 h-10 bg-indigo-500/5 border-indigo-500/60 scale-110" : "w-6 h-6 border-indigo-500/20 scale-100"}
        `}
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className={`absolute inset-0 rounded-full blur-[2px] transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-full h-full border border-primary/40 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

