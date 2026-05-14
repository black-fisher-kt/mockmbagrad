"use client"
 
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AIChatButton from "@/components/ai-chat-button"
import Link from "next/link"
 
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <Navbar />
 
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            About <span className="text-[#F59E0B]">HY MBAGRAD</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl sm:text-2xl text-gray-400"
          >
            Built by CAT aspirants, for CAT aspirants
          </motion.p>
        </div>
      </section>
 
      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-[#F59E0B] mb-8 uppercase tracking-widest text-sm">
              Our Story
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg mb-6">
              HY MBAGRAD was born out of frustration. We were CAT aspirants ourselves — 
              spending lakhs on coaching, struggling with scattered resources, and getting 
              zero personalized guidance. We knew there had to be a better way.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              So we built it. A completely free platform where every CAT aspirant — 
              regardless of their financial background — gets access to the same quality 
              of preparation that was once only available to those who could afford it.
            </p>
          </motion.div>
        </div>
      </section>
 
      {/* What We Offer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <h2 className="text-sm font-semibold text-[#F59E0B] uppercase tracking-widest mb-3">
              What We Offer
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white">
              Everything you need. Nothing you don't.
            </h3>
          </motion.div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Guidance",
                description: "Our CAT-trained AI provides personalized strategies, doubt solving and performance analysis 24/7. No human tutor needed."
              },
              {
                title: "Zero Cost, Always",
                description: "Every mock test, every PYQ, every NCERT resource — completely free. No hidden charges, no premium tiers, ever."
              },
              {
                title: "Built for Aspirants",
                description: "Every feature on this platform was designed by people who have sat for CAT. We know what works and what doesn't."
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-white/10 bg-white/[0.03] p-8 rounded-2xl hover:bg-white/[0.06] hover:border-[#F59E0B]/20 transition-all duration-300"
              >
                <div className="w-8 h-[2px] bg-[#F59E0B] mb-6" />
                <h3 className="text-lg font-semibold text-white mb-4">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed text-[15px]">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Mission */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-[#F59E0B] uppercase tracking-widest mb-6">
              Our Mission
            </p>
            <p className="text-2xl sm:text-3xl text-white leading-relaxed font-light">
              To democratize CAT preparation and make quality education accessible 
              to every aspirant in India, regardless of their financial background.
            </p>
          </motion.div>
        </div>
      </section>
 
      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Students", value: "10,000+" },
              { label: "Mock Tests", value: "500+" },
              { label: "Free Access", value: "100%" },
              { label: "AI Support", value: "24/7" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-[#F59E0B] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-semibold text-[#F59E0B] uppercase tracking-widest mb-3">
              The Team
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-8">
              Who We Are
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              We are a small team of IIM graduates and CAT toppers who believe that quality education 
              should not have a price tag. Every feature you see on this platform has been built with 
              one goal in mind — your success.
            </p>
          </motion.div>
        </div>
      </section>
 
      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              Ready to start your CAT journey?
            </h2>
            <p className="text-gray-400 mb-10">
              Join 10,000+ aspirants already preparing for free.
            </p>
            <Link
              href="/mock"
              className="inline-block px-10 py-4 bg-[#F59E0B] text-[#0F172A] font-bold rounded-xl hover:bg-amber-400 transition-all duration-200 shadow-lg shadow-[#F59E0B]/20 hover:shadow-[#F59E0B]/40 hover:scale-105"
            >
              Start Your CAT Journey
            </Link>
          </motion.div>
        </div>
      </section>
 
      <Footer />
      <AIChatButton />
    </main>
  )
}