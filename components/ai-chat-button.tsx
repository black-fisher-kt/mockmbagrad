"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
const questions = [
  "How to prepare for CAT in 6 months?",
  "Best strategy for VARC section?",
  "How to improve DILR accuracy?",
  "What percentile for IIM Ahmedabad?",
  "How many mocks before CAT?",
  "QA shortcuts for CAT?",
]

export default function AIChatButton() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
  const cycle = () => {
    // Step 1: Show karo
    setVisible(true)
    
    // Step 2: 3 seconds baad fade out
    setTimeout(() => {
      setVisible(false)
    }, 4000)
    
    // Step 3: 4 seconds baad next question (1 sec gap after fade out)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % questions.length)
    }, 4000)
  }

  cycle() // pehli baar turant chalao
  const interval = setInterval(cycle, 4000) // har 5 sec mein repeat
  return () => clearInterval(interval)
}, [])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative flex items-center">
        
        {/* Floating question bubble */}
        <div
          style={{
            position: "absolute",
            right: "64px",
            bottom: "0",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(8px)",
            transition: "opacity 400ms ease, transform 400ms ease",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              background: "rgba(15,23,42,0.92)",
              border: "1px solid rgba(245,158,11,0.35)",
              borderRadius: "999px",
              padding: "8px 16px",
              fontSize: "13px",
              color: "rgba(255,255,255,0.85)",
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
          >
            {questions[currentIndex]}
          </span>
        </div>

        {/* Main button */}
        <button
          onClick={() => window.location.href = "/cat-ai"}
          className="relative w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95"
          title="Ask CAT AI"
        >
          <Image src="/logo.svg" alt="logo" width={112} height={112} style={{filter: "brightness(0)"}} />
          <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-30" />
        </button>

      </div>
    </div>
  )
}