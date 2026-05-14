"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AIChatButton from "@/components/ai-chat-button";

export default function ResourcesPage() {
  return (
    <div className="bg-[#0F172A] min-h-screen text-white">
      <Navbar />
      <main>
        {/* SECTION 1 — HERO */}
        <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-[#F59E0B] text-[11px] font-bold tracking-widest uppercase mb-4">
              FREE RESOURCES
            </div>
            
            <h1 className="text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
              Everything You Need to<br />
              Crack CAT — Free.
            </h1>
            
            <p className="text-gray-400 text-[17px] leading-relaxed max-w-[560px] mt-6 mb-10">
              Access PYQs, NCERT books, daily updates and current affairs — all curated for CAT aspirants. 
              No payment. No sign-up. Just join our Telegram community and get everything for free.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="https://t.me/hymbagrad"
                target="_blank"
                className="bg-[#F59E0B] text-[#0F172A] font-bold px-8 py-4 rounded-xl hover:bg-amber-400 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all duration-200"
              >
                Join Telegram for Free Resources
              </Link>
              <Link
                href="https://discord.gg/hymbagrad"
                target="_blank"
                className="border border-white/20 text-white px-8 py-4 rounded-xl hover:border-white/40 hover:bg-white/5 transition-all duration-200"
              >
                Join Discord Community
              </Link>
            </div>
          </motion.div>
        </section>

        {/* SECTION 2 — WHAT YOU GET */}
        <section className="bg-white/[0.02] border-t border-white/[0.06] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center"
            >
              <div className="text-[#F59E0B] text-[11px] font-bold tracking-widest uppercase">
                WHAT YOU GET
              </div>
              <h2 className="text-36px font-bold text-white mt-2">All Resources. Zero Cost.</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* CARD 1 — PYQ Papers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-[#0F172A] border border-white/10 rounded-2xl p-8 hover:border-white/20 shadow-lg shadow-black/20 transition-all duration-300"
              >
                <div className="h-2 bg-[#F59E0B] w-full mb-6" />
                
                <h3 className="text-xl font-bold text-white mb-3">Previous Year Questions</h3>
                <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-3 py-1 text-xs mb-6">
                  CAT 2019 — 2024
                </span>
                
                <p className="text-gray-300 text-[17px] leading-relaxed mb-6">
                  Complete CAT previous year question papers with detailed solutions. 
                  Solve them as mock tests or use them for topic-wise practice. 
                  Covers all three sections — VARC, DILR and Quantitative Aptitude.
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#F59E0B] mr-2">•</span>
                    <span className="text-gray-400">Full papers with answer keys</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#F59E0B] mr-2">•</span>
                    <span className="text-gray-400">Section-wise sorted questions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#F59E0B] mr-2">•</span>
                    <span className="text-gray-400">Detailed solution explanations</span>
                  </li>
                </ul>
                
                <Link
                  href="https://t.me/hymbagrad"
                  target="_blank"
                  className="text-[#F59E0B] hover:text-amber-400 transition-colors flex items-center font-medium"
                >
                  Get PYQs on Telegram <span className="ml-1">→</span>
                </Link>
              </motion.div>

              {/* CARD 2 — NCERT Books */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-[#0F172A] border border-white/10 rounded-2xl p-8 hover:border-white/20 shadow-lg shadow-black/20 transition-all duration-300"
              >
                <div className="h-2 bg-white/20 w-full mb-6" />
                
                <h3 className="text-xl font-bold text-white mb-3">NCERT Books & Notes</h3>
                <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-3 py-1 text-xs mb-6">
                  Class 6 — 12
                </span>
                
                <p className="text-gray-300 text-[17px] leading-relaxed mb-6">
                  Download complete NCERT books in PDF format. 
                  Essential for CAT VARC and Quantitative preparation. Includes 
                  Mathematics, English and key reference chapters curated 
                  specifically for CAT syllabus.
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#F59E0B] mr-2">•</span>
                    <span className="text-gray-400">Maths Class 11 & 12 PDFs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#F59E0B] mr-2">•</span>
                    <span className="text-gray-400">English literature references</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#F59E0B] mr-2">•</span>
                    <span className="text-gray-400">CAT-relevant chapters highlighted</span>
                  </li>
                </ul>
                
                <Link
                  href="https://t.me/hymbagrad"
                  target="_blank"
                  className="text-[#F59E0B] hover:text-amber-400 transition-colors flex items-center font-medium"
                >
                  Get NCERTs on Telegram <span className="ml-1">→</span>
                </Link>
              </motion.div>

              {/* CARD 3 — Daily Updates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-[#0F172A] border border-white/10 rounded-2xl p-8 hover:border-white/20 shadow-lg shadow-black/20 transition-all duration-300"
              >
                <div className="h-2 bg-white/20 w-full mb-6" />
                
                <h3 className="text-xl font-bold text-white mb-3">Daily Updates & News</h3>
                <span className="inline-block bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-xs mb-6">
                  Updated Daily
                </span>
                
                <p className="text-gray-300 text-[17px] leading-relaxed mb-6">
                  Stay updated with daily CAT news, exam 
                  notifications, important current affairs and strategy tips 
                  shared by our team every day. Never miss an important 
                  update during your preparation.
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#F59E0B] mr-2">•</span>
                    <span className="text-gray-400">CAT exam notifications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#F59E0B] mr-2">•</span>
                    <span className="text-gray-400">Daily current affairs digest</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#F59E0B] mr-2">•</span>
                    <span className="text-gray-400">Strategy tips from toppers</span>
                  </li>
                </ul>
                
                <Link
                  href="https://t.me/hymbagrad"
                  target="_blank"
                  className="text-[#F59E0B] hover:text-amber-400 transition-colors flex items-center font-medium"
                >
                  Get Daily Updates on Telegram <span className="ml-1">→</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — HOW IT WORKS */}
        <section className="border-t border-white/[0.06] py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center"
            >
              <h2 className="text-36px font-bold text-white mb-2">How to Access Resources</h2>
              <p className="text-gray-400">Three simple steps</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#F59E0B] text-[#0F172A] flex items-center justify-center font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Click Join Telegram</h3>
                <p className="text-gray-400 text-[17px]">Tap the button above to join our free Telegram channel instantly.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#F59E0B] text-[#0F172A] flex items-center justify-center font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Get Instant Access</h3>
                <p className="text-gray-400 text-[17px]">All resources are pinned and organized in the channel for easy access.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#F59E0B] text-[#0F172A] flex items-center justify-center font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Start Preparing</h3>
                <p className="text-gray-400 text-[17px]">Download PDFs, attempt PYQs and get daily updates — all for free.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — MOCK TESTS CTA */}
        <section className="border-t border-white/[0.06] py-20 px-6 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto bg-[#0F172A]/50 rounded-3xl p-8 md:p-12 border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-24px font-bold text-white mb-2">Want to practice with AI Mock Tests?</h3>
                <p className="text-gray-400 text-[17px]">Attempt free mock tests powered by AI — get instant results and detailed explanations.</p>
              </div>
              <div>
                <Link
                  href="/mock"
                  className="bg-[#F59E0B] text-[#0F172A] font-bold px-8 py-4 rounded-xl hover:bg-amber-400 hover:scale-105 transition-all duration-200"
                >
                  Attempt Mock Test
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — BOTTOM CTA */}
        <section className="border-t border-white/[0.06] py-24 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to access all resources?</h2>
            <p className="text-gray-400 text-[17px] mb-8">Join 10,000+ CAT aspirants on our free Telegram channel.</p>
            
            <Link
              href="https://t.me/hymbagrad"
              target="_blank"
              className="inline-block bg-[#F59E0B] text-[#0F172A] font-bold px-12 py-5 rounded-xl text-lg hover:bg-amber-400 hover:scale-105 shadow-xl shadow-amber-500/20 transition-all duration-200"
            >
              Join Telegram — It's Free
            </Link>
            
            <p className="text-gray-500 text-[13px] mt-6">No sign-up required. Join instantly.</p>
          </motion.div>
        </section>
      </main>
      <Footer />
      <AIChatButton />
    </div>
  );
}