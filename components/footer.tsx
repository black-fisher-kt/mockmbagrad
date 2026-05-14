"use client"

import React from "react"
import Link from "next/link"
import { MessageCircle, Users, Youtube, Instagram, Mail } from "lucide-react"

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Mock Tests", href: "/mock" },
    { name: "Resources", href: "/resources" },
    { name: "Watchlist", href: "/watchlist" },
    { name: "About", href: "/about" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ]

  const socialLinks = [
    { name: "Telegram", href: "https://t.me/hymbagrad", icon: MessageCircle },
    { name: "Discord", href: "https://discord.gg/hymbagrad", icon: Users },
    { name: "Instagram", href: "https://instagram.com/hymbagrad", icon: Instagram },
    { name: "Email", href: "https://instagram.com/hymbagrad", icon: Mail },
  ]

  return (
    <footer className="py-12 bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-gradient-gold">HY MBAGRAD</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Complete CAT Preparation at Zero with AI Guidance
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-accent transition-colors duration-200"
                  title={link.name}
                >
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} HY MBAGRAD. All rights reserved. Made with ❤️ for CAT aspirants.
          </p>
        </div>
      </div>
    </footer>
  )
}