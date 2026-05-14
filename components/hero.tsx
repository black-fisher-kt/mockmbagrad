"use client"
 
import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, FileText, PlayCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
 
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-visible animated-grid">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
 
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-3xl" />
 
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
 
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-900/40 to-slate-900/40 border border-indigo-500/30 text-indigo-200 text-sm font-semibold backdrop-blur-md shadow-xl shadow-indigo-900/30">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50" />
            India's #1 Free CAT Platform
          </span>
        </motion.div>
 
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-10 tracking-tight leading-tight"
        >
          <span className="text-white">Complete CAT Preparation</span>
          <br />
          <span className="text-gradient-gold">at Zero Cost</span>
        </motion.h1>
 
        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed"
        >
          Join 10,000+ CAT aspirants getting free Mock Tests, PYQs, NCERT Books and 24/7 AI Guidance
        </motion.p>
 
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-6 mb-12"
        >
          <Link href="/mock">
            <Button
              size="lg"
              className="group relative px-14 py-7 text-xl font-bold rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-600 text-white border border-indigo-400/40 shadow-2xl shadow-indigo-900/60 hover:shadow-indigo-600/80 transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <FileText className="inline-block mr-3 h-7 w-7" />
              Attempt Mock Test
              <ArrowRight className="inline-block ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
 
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/resources">
              <Button
                size="lg"
                className="group relative px-8 py-5 text-base font-semibold rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white border border-slate-600/50 shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <BookOpen className="inline-block mr-2.5 h-5 w-5 text-indigo-400" />
                Free Resources
              </Button>
            </Link>
 
            <Link href="/watchlist">
              <Button
                size="lg"
                className="group relative px-8 py-5 text-base font-semibold rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white border border-slate-600/50 shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <PlayCircle className="inline-block mr-2.5 h-5 w-5 text-amber-400" />
                CAT Watchlist
              </Button>
            </Link>
          </div>
        </motion.div>
 
        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <Link
            href="https://t.me/hymbagrad"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-indigo-400 transition-all duration-200 flex items-center gap-2 group text-sm font-medium"
          >
            <span>Join Telegram</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            href="https://discord.gg/hymbagrad"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-indigo-400 transition-all duration-200 flex items-center gap-2 group text-sm font-medium"
          >
            <span>Join Discord</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
 
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-gray-600"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] mb-4 text-gray-500">Scroll</span>
            <div className="w-7 h-12 rounded-full border-2 border-gray-700/60 flex justify-center p-2.5 bg-gray-900/30 backdrop-blur-sm">
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-lg shadow-indigo-500/50"
              />
            </div>
          </motion.div>
        </motion.div>
 
      </div>
    </section>
  )
}