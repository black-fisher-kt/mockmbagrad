"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Mock Tests", href: "/mock" },
    { name: "CAT AI", href: "/cat-ai" },
    { name: "Resources", href: "/resources" },
    { name: "Watchlist", href: "/watchlist" },
    { name: "About", href: "/about" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="HY MBAGRAD" width={72} height={72} />
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent bg-300% animate-gradient group-hover:from-amber-100 group-hover:via-amber-300 group-hover:to-amber-100 transition-all duration-500">HY MBAGRAD</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/mock?type=full">
            <Button className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-background border border-amber-400/30 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/40 transition-all duration-300 hover:scale-105">
              Get Started Free
            </Button>
            </Link>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-background w-full">
                Get Started Free
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}