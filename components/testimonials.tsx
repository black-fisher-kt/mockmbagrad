"use client"

import React from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    quote: "HY MBAGRAD's mock tests are incredibly close to the actual CAT. The AI explanations helped me understand my weak areas in DILR.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    quote: "The best free resource for CAT preparation. The PYQ bank is comprehensive and the AI mentor is available 24/7!",
    rating: 5,
  },
  {
    name: "Ananya Gupta",
    quote: "I improved my VARC score by 20 percentile using their free resources. Highly recommended for serious aspirants.",
    rating: 5,
  },
]

export default function Testimonials() {
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
            What Our Students Say
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of successful CAT aspirants
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border border-border bg-muted/30 hover:border-accent transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-4 italic">
                "{testimonial.quote}"
              </p>
              
              <div className="border-t border-border pt-4">
                <div className="font-semibold text-white">{testimonial.name}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}