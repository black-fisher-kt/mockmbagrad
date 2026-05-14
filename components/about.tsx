"use client"

import React from "react"
import { motion } from "framer-motion"

export default function About() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            About HY MBAGRAD
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Built by CAT aspirants, for CAT aspirants. We understand the challenges of CAT preparation 
            - expensive coaching, lack of quality resources, and no personalized guidance. That's why 
            we created HY MBAGRAD - a completely free platform with AI-powered features to help every 
            aspirant achieve their dream B-school.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 border border-primary">
            <span className="text-gradient-gold font-semibold text-lg">
              Built by CAT aspirants, for CAT aspirants
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}