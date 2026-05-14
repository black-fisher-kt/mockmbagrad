'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AIChatButton from "@/components/ai-chat-button";

export default function WatchlistPage() {
  return (
    <div className="bg-[#0F172A] min-h-screen text-white">
      <Navbar />
      <main>
        {/* SECTION 1 — HERO */}
        <section className="pt-32 pb-16 px-6 text-center max-w-700px mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-[#F59E0B] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              COMING SOON
            </span>
            
            <h1 className="text-52px font-bold text-white tracking-tight mb-4">
              CAT Watchlist
            </h1>
            
            <p className="text-gray-400 text-[17px] leading-relaxed max-w-[560px] mx-auto">
              We are curating the best YouTube videos for CAT preparation — topic-wise and sequence-wise — so you know exactly what to watch and in what order.
            </p>
          </motion.div>
        </section>

        {/* SECTION 2 — WHAT'S COMING */}
        <section className="border-t border-white/[0.06] py-20 px-6 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-[#F59E0B] text-[11px] font-bold tracking-widest uppercase">
                  WHAT TO EXPECT
                </div>
                <h2 className="text-34px font-bold text-white mt-2 mb-2">
                  Handpicked videos. Proper sequence.
                </h2>
                <p className="text-gray-400 text-[16px] max-w-[560px] mx-auto">
                  No random playlists. Every video is selected and arranged by our team for maximum learning efficiency.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-[#0F172A] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-200"
                >
                  <div className="border-l-2 border-[#F59E0B] pl-5">
                    <h3 className="text-15px font-semibold text-white mb-2">
                      {i === 1 && "Topic-wise Organization"}
                      {i === 2 && "Sequence-based Learning"}
                      {i === 3 && "Curated by Toppers"}
                      {i === 4 && "Completely Free"}
                    </h3>
                    <p className="text-gray-400 text-[14px] leading-relaxed">
                      {i === 1 && "Videos sorted by VARC, DILR and Quantitative Aptitude so you can focus on your weak areas first."}
                      {i === 2 && "Each topic follows a logical learning sequence — from basics to advanced — so you never feel lost."}
                      {i === 3 && "Every video is reviewed and selected by CAT toppers who know which content actually helps crack the exam."}
                      {i === 4 && "All videos are from YouTube — free to watch. We just organize them so you save time finding the right content."}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — TOPICS PREVIEW */}
        <section className="border-t border-white/[0.06] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center"
            >
              <h2 className="text-34px font-bold text-white mb-4">Topics Preview</h2>
              <p className="text-gray-400 text-[16px]">
                From basics to advanced — structured for maximum retention
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {[
                { name: "Number Systems", count: 12 },
                { name: "Algebra", count: 18 },
                { name: "Geometry", count: 15 },
                { name: "Arithmetic", count: 22 },
                { name: "Modern Maths", count: 8 },
                { name: "Trigonometry", count: 6 },
              ].map((topic, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="bg-[#0F172A] border border-white/10 rounded-xl p-5 hover:border-[#F59E0B]/30 transition-all duration-200"
                >
                  <h3 className="text-[15px] font-semibold text-white mb-2">{topic.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-400">{topic.count} videos</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Subscription CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#0F172A] rounded-2xl p-8 border border-white/10 max-w-3xl mx-auto text-center"
            >
              <h3 className="text-20px font-bold text-white mb-3">Be the first to know when Watchlist launches</h3>
              <p className="text-gray-400 text-[16px] mb-6">
                We'll notify you as soon as we publish videos for each topic.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-[#050810] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#F59E0B]/40 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#F59E0B] text-[#0F172A] font-bold px-6 py-3 rounded-xl hover:bg-amber-400 transition-all duration-200 whitespace-nowrap"
                >
                  Get Early Access
                </button>
              </form>
              <p className="text-[12px] text-gray-500 mt-4">We'll email you once we publish our first video collection</p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <AIChatButton />
    </div>
  );
}