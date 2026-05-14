"use client"
 
import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
 
const steps = [
  {
    number: "01",
    title: "Choose Your Topic",
    description: "Select from VARC, DILR, or Quantitative Aptitude",
  },
  {
    number: "02",
    title: "AI Generates Your Test",
    description: "Get personalized questions based on your level",
  },
  {
    number: "03",
    title: "Review with AI Explanation",
    description: "Understand every answer with detailed solutions",
  },
]
 
export default function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Three simple steps to CAT success
          </p>
        </motion.div>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-center flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border-2 border-primary text-white text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400">
                  {step.description}
                </p>
 
                {index === 1 && (
                  <Link
                    href="/mock"
                    className="mt-5 px-5 py-2 rounded-lg border border-white/20 hover:border-amber-400/40 hover:text-amber-400 transition-all duration-200 hover:scale-105 text-xs text-white/60 mx-auto block w-fit"
                  >
                    Attempt Mock Now
                  </Link>
                )}
              </div>
 
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full">
                  <div className="h-0.5 bg-gradient-to-r from-primary to-transparent w-full"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}