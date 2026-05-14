"use client"

import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AIChatButton from "@/components/ai-chat-button"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-400"
          >
            Last updated: <span className="text-[#F59E0B]">April 2026</span>
          </motion.p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Section 1: Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 first:border-t-0"
          >
            <h2 className="text-2xl font-semibold text-[#F59E0B] mb-3">
              1. Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed">
              HY MBAGRAD ('we', 'us', or 'our') operates the website hymbagrad.com. 
              This Privacy Policy explains how we collect, use, and protect your 
              information when you use our platform.
            </p>
          </motion.div>

          {/* Section 2: Information We Collect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 first:border-t-0"
          >
            <h2 className="text-2xl font-semibold text-[#F59E0B] mb-3">
              2. Information We Collect
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect the following types of information:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span className="text-gray-300 leading-relaxed">
                  <strong>Usage data:</strong> pages visited, time spent, mock test results
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span className="text-gray-300 leading-relaxed">
                  <strong>Device information:</strong> browser type, IP address
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span className="text-gray-300 leading-relaxed">
                  <strong>Voluntarily provided:</strong> name or email if you choose to contact us
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span className="text-gray-300 leading-relaxed">
                  <strong>We do NOT collect payment information</strong> as our platform is completely free
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Section 3: How We Use Your Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 first:border-t-0"
          >
            <h2 className="text-2xl font-semibold text-[#F59E0B] mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span className="text-gray-300 leading-relaxed">
                  To improve our platform and user experience
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span className="text-gray-300 leading-relaxed">
                  To analyze usage patterns and optimize content
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span className="text-gray-300 leading-relaxed">
                  To respond to your queries if you contact us
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#F59E0B] mt-1">•</span>
                <span className="text-gray-300 leading-relaxed">
                  We do <strong>NOT</strong> sell your data to third parties
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Section 4: AI Interactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 first:border-t-0"
          >
            <h2 className="text-2xl font-semibold text-[#F59E0B] mb-3">
              4. AI Interactions
            </h2>
            <p className="text-gray-300 leading-relaxed">
              When you use our CAT AI assistant, your questions are processed to 
              generate responses. We do not store your conversation history permanently. 
              AI interactions are used solely to provide you with relevant CAT preparation 
              guidance.
            </p>
          </motion.div>

          {/* Section 5: Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 first:border-t-0"
          >
            <h2 className="text-2xl font-semibold text-[#F59E0B] mb-3">
              5. Cookies
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We use essential cookies to ensure the platform functions correctly. 
              We do not use tracking cookies for advertising purposes.
            </p>
          </motion.div>

          {/* Section 6: Third Party Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 first:border-t-0"
          >
            <h2 className="text-2xl font-semibold text-[#F59E0B] mb-3">
              6. Third Party Services
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Our platform may link to external resources including YouTube videos, 
              Telegram, and Discord. We are not responsible for the privacy practices 
              of these external platforms.
            </p>
          </motion.div>

          {/* Section 7: Data Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 first:border-t-0"
          >
            <h2 className="text-2xl font-semibold text-[#F59E0B] mb-3">
              7. Data Security
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We implement reasonable security measures to protect your information. 
              However, no method of transmission over the internet is 100% secure.
            </p>
          </motion.div>

          {/* Section 8: Children's Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 first:border-t-0"
          >
            <h2 className="text-2xl font-semibold text-[#F59E0B] mb-3">
              8. Children's Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Our platform is intended for users who are 18 years or older. 
              We do not knowingly collect information from minors.
            </p>
          </motion.div>

          {/* Section 9: Changes to This Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 first:border-t-0"
          >
            <h2 className="text-2xl font-semibold text-[#F59E0B] mb-3">
              9. Changes to This Policy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify 
              users of significant changes by posting the new policy on this page.
            </p>
          </motion.div>

          {/* Section 10: Contact Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 first:border-t-0"
          >
            <h2 className="text-2xl font-semibold text-[#F59E0B] mb-3">
              10. Contact Us
            </h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy, contact us through 
              our <Link href="https://t.me/hymbagrad" target="_blank" className="text-[#F59E0B] hover:text-[#F59E0B]/80 transition-colors">Telegram channel</Link> or <Link href="https://discord.gg/hymbagrad" target="_blank" className="text-[#F59E0B] hover:text-[#F59E0B]/80 transition-colors">Discord server</Link>.
            </p>
          </motion.div>

        </div>
      </section>

      <Footer />
      <AIChatButton />
    </main>
  )
}