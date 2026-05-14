"use client"

import React from "react"
import { motion } from "framer-motion"
import { FileText, BookOpen, Library, Bot, Newspaper, Play } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Free Mock Tests",
    description: "Practice with 500+ CAT-level mock tests",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    icon: BookOpen,
    title: "PYQ Bank",
    description: "Previous year questions with solutions",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    icon: Library,
    title: "NCERT Library",
    description: "Complete NCERT books & notes",
    color: "text-teal-400",
    bgColor: "bg-teal-400/10",
  },
  {
    icon: Bot,
    title: "AI Mentor",
    description: "24/7 AI-powered doubt solving",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  {
    icon: Newspaper,
    title: "Daily Updates",
    description: "Fresh content & current affairs",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    icon: Play,
    title: "CAT Watchlist",
    description: "Curated video lessons & tips",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to Crack CAT
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Complete preparation toolkit designed by CAT toppers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl border border-border bg-muted/30 hover:border-accent transition-all duration-300 card-glow"
            >
              <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}