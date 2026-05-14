"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is this platform completely free?",
    answer: "Yes! HY MBAGRAD is 100% free. All mock tests, PYQs, NCERT books, and AI guidance are available at no cost. We believe quality CAT preparation should be accessible to everyone.",
  },
  {
    question: "How does the AI Mock Test work?",
    answer: "Our AI analyzes CAT patterns and generates questions matching the difficulty level. After attempting, you get detailed explanations for each answer, helping you understand concepts better.",
  },
  {
    question: "What topics are covered?",
    answer: "We cover all CAT sections: Verbal Ability & Reading Comprehension (VARC), Data Interpretation & Logical Reasoning (DILR), and Quantitative Aptitude. Complete syllabus with topic-wise tests.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No account required for basic access! Just start practicing. However, creating a free account helps you track your progress and get personalized recommendations.",
  },
  {
    question: "How is this different from other platforms?",
    answer: "We're completely free with AI-powered explanations, curated by CAT toppers, and offer a comprehensive one-stop solution. No hidden charges, no premium tiers - everything is free.",
  },
]

export default function FAQ() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg bg-muted/30 px-6"
              >
                <AccordionTrigger className="text-left text-white hover:text-accent transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}