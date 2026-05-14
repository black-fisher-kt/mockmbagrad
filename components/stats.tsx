"use client"

import React from "react"
import { motion } from "framer-motion"

const stats = [
  { label: "Students", value: "10,000+" },
  { label: "Mock Tests", value: "500+" },
  { label: "Free Forever", value: "100%" },
  { label: "AI-Powered", value: "24/7" },
]

export default function Stats() {
  return (
    <section className="py-8 border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}