"use client"
 
import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, BookOpen, BarChart2, Calculator, MessageSquare, Target, TrendingUp, Brain, Plus, ArrowLeft, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Image from "next/image"
 
interface ChatMessage {
  id: string
  question: string
  answer: string
  modelUsed: string
  timestamp: string
  topic: string
}
 
const markdownComponents = {
  p: ({ children }: any) => (
    <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'rgba(255,255,255,0.82)', marginBottom: '12px', marginTop: '0' }}>
      {children}
    </p>
  ),
  strong: ({ children }: any) => (
    <strong style={{ fontWeight: '600', color: 'white' }}>{children}</strong>
  ),
  em: ({ children }: any) => (
    <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>{children}</em>
  ),
  h1: ({ children }: any) => (
    <h1 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginTop: '20px', marginBottom: '10px', letterSpacing: '-0.02em' }}>
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginTop: '18px', marginBottom: '8px' }}>
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.85)', marginTop: '14px', marginBottom: '6px' }}>
      {children}
    </h3>
  ),
  ul: ({ children }: any) => (
    <ul style={{ paddingLeft: '0', margin: '8px 0 12px 0', listStyle: 'none' }}>{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol style={{ paddingLeft: '20px', margin: '8px 0 12px 0' }}>{children}</ol>
  ),
  li: ({ children }: any) => (
    <li style={{ fontSize: '14px', lineHeight: '1.75', color: 'rgba(255,255,255,0.8)', marginBottom: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
      <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: '#3B82F6', marginTop: '9px', flexShrink: 0 }} />
      <span>{children}</span>
    </li>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0' }} />
  ),
  blockquote: ({ children }: any) => (
    <blockquote style={{ borderLeft: '2px solid #3B82F6', paddingLeft: '14px', margin: '12px 0', color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontStyle: 'italic' }}>
      {children}
    </blockquote>
  ),
  code: ({ inline, children }: any) => inline ? (
    <code style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '4px', padding: '1px 6px', fontSize: '13px', color: '#93C5FD', fontFamily: 'monospace' }}>
      {children}
    </code>
  ) : (
    <pre style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '14px 16px', overflow: 'auto', margin: '12px 0' }}>
      <code style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace', lineHeight: '1.6' }}>
        {children}
      </code>
    </pre>
  ),
}
 
export default function CatAiChatInterface({
  isOpen,
  onClose,
  isFullPageMode = false
}: {
  isOpen: boolean
  onClose: () => void
  isFullPageMode?: boolean
}) {
  const [message, setMessage] = useState("")
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeTopic, setActiveTopic] = useState('general')
  const [topicsCovered, setTopicsCovered] = useState<string[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [sessions, setSessions] = useState<{id: string, title: string, timestamp: string}[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)
 
  const downloadChatAsPDF = () => {
    if (history.length === 0) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    const chatHTML = history.map(msg => `
      ${msg.question ? `
      <div class="message user-message">
        <div class="message-label">You</div>
        <div class="message-content">${msg.question}</div>
      </div>
      ` : ''}
      ${msg.answer ? `
      <div class="message ai-message">
        <div class="message-label">Mbagrad AI</div>
        <div class="message-content">${msg.answer
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/^## (.*$)/gm, '<h2>$1</h2>')
          .replace(/^### (.*$)/gm, '<h3>$1</h3>')
          .replace(/^- (.*$)/gm, '<li>$1</li>')
          .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
          .replace(/\n/g, '<br>')
        }</div>
        <div class="message-time">${new Date(msg.timestamp).toLocaleString()}</div>
      </div>
      ` : ''}
    `).join('')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>HY MBAGRAD — CAT AI Chat Export</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #fff;
            color: #1a1a1a;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            border-bottom: 3px solid #F59E0B;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            font-size: 24px;
            font-weight: 800;
            color: #0F172A;
          }
          .header h1 span { color: #F59E0B; }
          .header p {
            color: #666;
            font-size: 13px;
            margin-top: 6px;
          }
          .message {
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          .message-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 6px;
          }
          .user-message .message-label { color: #6366F1; }
          .ai-message .message-label { color: #F59E0B; }
          .message-content {
            font-size: 14px;
            line-height: 1.75;
            color: #1a1a1a;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 14px 18px;
            border-left: 3px solid #e2e8f0;
          }
          .user-message .message-content {
            border-left-color: #6366F1;
            background: #eef2ff;
          }
          .ai-message .message-content {
            border-left-color: #F59E0B;
            background: #fffbeb;
          }
          .message-time {
            font-size: 11px;
            color: #999;
            margin-top: 6px;
            text-align: right;
          }
          .message-content h2 {
            font-size: 16px;
            margin: 12px 0 6px;
            color: #0F172A;
          }
          .message-content h3 {
            font-size: 14px;
            margin: 10px 0 4px;
            color: #374151;
          }
          .message-content ul {
            padding-left: 18px;
            margin: 6px 0;
          }
          .message-content li { margin-bottom: 4px; }
          .message-content strong { color: #0F172A; }
          .footer {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
          @media print {
            body { padding: 20px; }
            .message { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1><span>HY</span> MBAGRAD — CAT AI Chat</h1>
          <p>Exported on ${new Date().toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}</p>
        </div>
        ${chatHTML}
        <div class="footer">
          Generated by HY MBAGRAD · Complete CAT Preparation at Zero Cost · hymbagrad.com
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
                      setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  const loadAllSessions = () => {
    const allKeys = Object.keys(localStorage)
    const sessionKeys = allKeys.filter(k => k.startsWith('chat-history-cat-ai-'))
    const sessionList = sessionKeys.map(key => {
      const historyData = JSON.parse(localStorage.getItem(key) || '[]')
      const firstMsg = historyData[0]?.question || 'New Conversation'
      const title = firstMsg.length > 35 ? firstMsg.substring(0, 35) + '...' : firstMsg
      const id = key.replace('chat-history-', '')
      return {
        id,
        title,
        timestamp: historyData[0]?.timestamp || new Date().toISOString()
      }
    })
    sessionList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    setSessions(sessionList)
  }

  const switchSession = (sessionId: string) => {
    const saved = localStorage.getItem(`chat-history-${sessionId}`)
    if (saved) {
      setHistory(JSON.parse(saved))
      setActiveSessionId(sessionId)
      setSessionId(sessionId)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, isTyping])
 
  useEffect(() => {
    if (!isOpen) return
    const loadHistory = async () => {
      try {
        const storedSessionId = localStorage.getItem('cat-ai-session')
        const newSessionId = storedSessionId || 'cat-ai-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8)
        setSessionId(newSessionId)
        if (!storedSessionId) localStorage.setItem('cat-ai-session', newSessionId)
        const res = await fetch('/api/cat-ai/chat', { headers: { 'X-Session-ID': newSessionId } })
        if (res.ok) {
          const data = await res.json()
          if (data.success && Array.isArray(data.history)) {
            setHistory(data.history)
            const uniqueTopics = Array.from(new Set(data.history.map((m: ChatMessage) => m.topic).filter(Boolean))) as string[]
            setTopicsCovered(uniqueTopics)
          }
        }
        // Check localStorage after API fetch
        const localHistory = localStorage.getItem(`chat-history-${newSessionId}`)
        if (localHistory) {
          const parsed = JSON.parse(localHistory)
          if (parsed.length > 0) setHistory(parsed)
        }
        // Load all sessions
        loadAllSessions()
      } catch (e) {
        console.error('Failed to load history:', e)
      }
    }
    loadHistory()
  }, [isOpen])
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setIsTyping(true)
    const tempMessage: ChatMessage = {
      id: Date.now().toString(),
      question: message,
      answer: '',
      modelUsed: '',
      timestamp: new Date().toISOString(),
      topic: activeTopic
    }
    setHistory(prev => [...prev, tempMessage])
    setMessage("")
    try {
      const res = await fetch('/api/cat-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-ID': sessionId },
        body: JSON.stringify({ question: message, subject: activeTopic })
      })
      const data = await res.json()
      if (data.success) {
        setHistory(prev => {
          const updatedHistory = prev.map(msg =>
            msg.id === tempMessage.id
              ? { ...msg, answer: data.answer, modelUsed: data.modelUsed, timestamp: data.timestamp, topic: activeTopic }
              : msg
          )
          // Save to localStorage after updating history
          localStorage.setItem(`chat-history-${sessionId}`, JSON.stringify(updatedHistory))
          loadAllSessions()
          return updatedHistory
        })
        if (!topicsCovered.includes(activeTopic)) setTopicsCovered(prev => [...prev, activeTopic])
      } else {
        setHistory(prev => {
          const updatedHistory = prev.map(msg =>
            msg.id === tempMessage.id
              ? { ...msg, answer: `Error: ${data.error || 'Failed'}`, modelUsed: '', timestamp: new Date().toISOString(), topic: activeTopic }
              : msg
          )
          // Save to localStorage after updating history
          localStorage.setItem(`chat-history-${sessionId}`, JSON.stringify(updatedHistory))
          loadAllSessions()
          return updatedHistory
        })
      }
    } catch (error) {
      setHistory(prev => {
        const updatedHistory = prev.map(msg =>
          msg.id === tempMessage.id
            ? { ...msg, answer: `Error: ${error instanceof Error ? error.message : 'Unknown'}`, modelUsed: '', timestamp: new Date().toISOString(), topic: activeTopic }
            : msg
        )
        // Save to localStorage after updating history
        localStorage.setItem(`chat-history-${sessionId}`, JSON.stringify(updatedHistory))
        loadAllSessions()
        return updatedHistory
      })
    } finally {
      setIsTyping(false)
    }
  }
 
  const suggestions = [
    "Explain Reading Comprehension strategy for CAT",
    "How to approach DILR sets under time pressure",
    "What is the ideal QA preparation timeline?",
    "Analyze my weak areas in Verbal Ability"
  ]
 
  if (!isOpen) return null
 
  return (
    <div className="flex h-screen bg-[#050810] text-gray-200 overflow-hidden relative">
 
      {/* LEFT SIDEBAR */}
      <div className="w-[260px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#070C18] overflow-y-auto">
 
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-[10px] overflow-hidden">
            <Image src="/logo.svg" alt="HY MBAGRAD" width={46} height={46} style={{ flexShrink: 0, objectFit: 'contain' }} />
            <span className="text-[22px] font-bold text-white tracking-[-0.02em] flex-1">CAT AI</span>
          </div>
          <div className="text-[11px] font-medium text-[#F59E0B] uppercase tracking-[0.1em]">HY MBAGRAD</div>
        </div>
 
        {/* New Chat */}
        <div className="p-4">
          <button
            onClick={() => {
              // Generate new session ID
              const newSessionId = 'cat-ai-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8)
              // Save new session to localStorage
              localStorage.setItem('cat-ai-session', newSessionId)
              // Update states
              setSessionId(newSessionId)
              setHistory([])
              setTopicsCovered([])
              setActiveSessionId(newSessionId)
              // Refresh sessions list
              loadAllSessions()
            }}
            className="w-full flex items-center gap-2 px-4 py-[10px] rounded-lg border border-white/10 hover:border-[rgba(29,78,216,0.5)] hover:bg-[rgba(29,78,216,0.06)] transition-all duration-200 group"
          >
            <Plus className="w-4 h-4 text-[#60A5FA]" />
            <span className="text-[14px] font-medium text-white/70 group-hover:text-white/90">New Chat</span>
          </button>
        </div>
        
        {/* Recent Chats */}
        <div className="px-4 mb-4">
          <div className="text-[11px] font-medium text-white/30 uppercase tracking-[0.12em] mb-2">
            Recent Chats
          </div>
          <div className="space-y-1">
            {sessions.length === 0 ? (
              <div className="text-[12px] text-white/20 px-2 py-1">
                No conversations yet
              </div>
            ) : (
              sessions.slice(0, 6).map(session => (
                <div key={session.id} className="relative group">
                  <button
                    onClick={() => switchSession(session.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-150 truncate flex items-center gap-2
                      ${session.id === sessionId
                        ? 'bg-white/[0.08] text-white'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                      }`}
                  >
                    {session.title}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      localStorage.removeItem(`chat-history-${session.id}`)
                      if (session.id === sessionId) {
                        setHistory([])
                      }
                      loadAllSessions()
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-white/30 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
 
        {/* Topics */}
        <div className="px-4 flex-1">
          <div className="text-[11px] font-medium text-white/30 uppercase tracking-[0.12em] mb-3">Topics</div>
          <div className="space-y-1">
            {[
              { id: 'general', label: 'General Strategy', icon: <Target className="w-4 h-4" /> },
              { id: 'varc', label: 'VARC', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'dilr', label: 'DILR', icon: <BarChart2 className="w-4 h-4" /> },
              { id: 'qa', label: 'Quantitative', icon: <Calculator className="w-4 h-4" /> },
            ].map(topic => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`w-full flex items-center gap-[10px] px-3 py-[11px] rounded-lg transition-all duration-150 text-left
                  ${activeTopic === topic.id
                    ? 'text-white font-semibold bg-[rgba(29,78,216,0.15)] border-l-2 border-[#1D4ED8] pl-[10px]'
                    : 'text-white/70 hover:text-white/90 hover:bg-white/[0.04]'
                  }`}
              >
                <span className={activeTopic === topic.id ? 'text-[#60A5FA]' : 'text-[#94A3B8]'}>
                  {topic.icon}
                </span>
                <span className="text-[15px] font-medium">{topic.label}</span>
              </button>
            ))}
          </div>
        </div>
 
        {/* Download PDF */}
        {history.length > 0 && (
          <div className="px-4">
            <button
              onClick={downloadChatAsPDF}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-200 mb-3 group"
            >
              <svg className="w-4 h-4 text-white/40 group-hover:text-amber-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span className="text-[13px] text-white/40 group-hover:text-white/70 transition-colors">
                Download Chat PDF
              </span>
            </button>
          </div>
        )}

        {/* Bottom */}
        <div className="p-4 mt-auto border-t border-white/[0.06]">
          <div className="bg-[rgba(29,78,216,0.08)] border border-[rgba(29,78,216,0.2)] rounded-[10px] p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span className="text-[12px] font-semibold text-white/80">CAT Specialist AI</span>
            </div>
            <span className="text-[11px] text-white/35">Trained on 10+ years of CAT papers</span>
          </div>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/40 hover:text-amber-500 transition-colors duration-200 p-2 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[13px] font-medium">Back to Home</span>
          </button>
        </div>
      </div>
 
      {/* CENTER CHAT PANEL */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">

        {/* Background orbs */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(29,78,216,0.07)_0%,transparent_70%)] pointer-events-none z-0" />
        <div className="absolute top-[200px] right-[10%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.04)_0%,transparent_65%)] pointer-events-none z-0" />
 
        {/* Welcome screen */}
        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center px-8 py-8 relative z-10 overflow-y-auto">
            <div className="text-center w-full max-w-[680px] mx-auto">
 
              <div className="inline-flex items-center gap-2 mb-5">
                <Sparkles className="w-[14px] h-[14px] text-[#F59E0B]" />
                <span className="text-[12px] font-medium text-amber-500/70 uppercase tracking-[0.06em]">Powered by Claude AI</span>
              </div>
 
              <h2 className="text-[clamp(36px,5vw,56px)] font-bold text-white tracking-[-0.04em] leading-[1.1] mb-4">
                Your CAT Preparation,{' '}
                <span className="text-amber-500">Elevated.</span>
              </h2>
 
              <p className="text-white/50 text-[16px] leading-[1.75] mb-10">
                Experience AI-powered CAT preparation with the most advanced intelligent companion.
                Get personalized strategies for VARC, DILR, and QA sections.
              </p>
 
              {/* Feature cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { title: 'VARC', desc: 'Reading strategies', icon: <BookOpen className="w-5 h-5 text-[#60A5FA]" /> },
                  { title: 'DILR', desc: 'Data analysis', icon: <BarChart2 className="w-5 h-5 text-[#A78BFA]" /> },
                  { title: 'QA', desc: 'Math mastery', icon: <Calculator className="w-5 h-5 text-[#34D399]" /> },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-[rgba(29,78,216,0.45)] hover:bg-[rgba(29,78,216,0.07)] transition-all duration-200 cursor-pointer"
                    onClick={() => setActiveTopic(item.title.toLowerCase())}
                  >
                    {item.icon}
                    <span className="text-[15px] font-bold text-white uppercase tracking-[0.05em]">{item.title}</span>
                    <span className="text-[12px] text-white/40">{item.desc}</span>
                  </div>
                ))}
              </div>
 
              {/* Suggestion cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {suggestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMessage(q)
                      setTimeout(() => {
                        const form = document.querySelector('form')
                        if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
                      }, 50)
                    }}
                    className="relative text-left px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-[rgba(29,78,216,0.5)] hover:bg-[rgba(29,78,216,0.07)] hover:text-white hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgba(29,78,216,0.15)] transition-all duration-200"
                  >
                    <div className="text-[14px] text-white/70 leading-[1.65] font-medium pr-5">{q}</div>
                    <ChevronRight className="absolute top-4 right-4 w-[13px] h-[13px] text-white/20" />
                  </button>
                ))}
              </div>
 
              {/* Capability pills */}
              <div className="flex flex-wrap justify-center items-center gap-2">
                {[
                  { icon: <Brain className="w-3.5 h-3.5" />, label: 'Strategy & Planning' },
                  { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Performance Analysis' },
                  { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Concept Explanations' },
                ].map((pill, i) => (
                  <React.Fragment key={i}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.25)',
                        textShadow: '0 0 12px rgba(255,255,255,0.15)',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease'
                      }}
                      className="hover:text-[rgba(255,255,255,0.45)]"
                      onClick={() => setActiveTopic(pill.label.toLowerCase().split(' ')[0])}
                    >
                      {pill.icon}
                      <span>{pill.label}</span>
                    </span>
                    {i < 2 && (
                      <span className="text-[14px] text-white/10 mx-1">
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chat messages */
          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
            {history.map((msg) => (
              <div key={msg.id} className="space-y-4">
                {/* User message */}
                {msg.question && (
                  <div className="flex justify-end">
                    <div className="max-w-[65%]">
                      <div className="bg-[#1D4ED8] rounded-2xl rounded-tr-sm px-5 py-3 shadow-[0_4px_16px_rgba(29,78,216,0.3)]">
                        <p className="text-[14px] text-white leading-[1.6]">{msg.question}</p>
                      </div>
                      <div className="text-[11px] text-white/30 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )}
 
                {/* AI message */}
                {msg.answer && (
                  <div className="flex justify-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="max-w-[75%]">
                      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-tl-sm px-5 py-4">
                        <ReactMarkdown components={markdownComponents}>
                          {msg.answer}
                        </ReactMarkdown>
                      </div>
                      <div className="text-[11px] text-white/25 mt-1 ml-1">
                        {msg.modelUsed ? `Mbagrad · ` : ''}
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
 
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="flex items-center gap-1 bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3">
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
 
            <div ref={messagesEndRef} />
          </div>
        )}
 
        {/* Input bar */}
        <div className="relative z-10 p-4 border-t border-white/[0.06] bg-[#070C18]/60 backdrop-blur-md">
          <form
            onSubmit={handleSubmit}
            className="max-w-[700px] mx-auto flex items-end gap-2 px-5 py-2 rounded-2xl bg-white/[0.05] border border-white/10 focus-within:border-[rgba(29,78,216,0.6)] focus-within:shadow-[0_0_0_3px_rgba(29,78,216,0.12)] transition-all duration-200"
          >
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Ask anything about CAT..."
              className="flex-1 bg-transparent text-white/90 placeholder-white/20 focus:outline-none resize-none max-h-[160px] min-h-[24px] py-3 text-[15px] leading-relaxed"
              rows={1}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement
                t.style.height = 'auto'
                t.style.height = t.scrollHeight + 'px'
              }}
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className={`mb-1 p-2.5 rounded-xl transition-all duration-150 ${message.trim() ? 'bg-[#1D4ED8] hover:bg-[#2563EB] active:scale-95 cursor-pointer' : 'bg-white/[0.07] cursor-not-allowed'}`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className="text-center text-[11px] text-white/20 mt-2">
            CAT AI is trained specifically for VARC, DILR and Quantitative sections
          </p>
        </div>
      </div>
    </div>
  )
}

