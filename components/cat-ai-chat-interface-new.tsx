"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, History, Trash2, Volume2, Copy, Check } from 'lucide-react'
import CatAiChatHistory from './cat-ai-chat-history'

interface ChatMessage {
  id: string
  question: string
  answer: string
  modelUsed: string
  timestamp: string
  title?: string
  lastMessagePreview?: string
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
  const [activeSubject, setActiveSubject] = useState('general')
  const [sessionId, setSessionId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  useEffect(() => {
    if (isOpen) {
      const loadHistory = async () => {
        try {
          const storedSessionId = localStorage.getItem('cat-ai-session')
          const newSessionId = storedSessionId || 'cat-ai-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8)
          setSessionId(newSessionId)
          if (!storedSessionId) {
            localStorage.setItem('cat-ai-session', newSessionId)
          }
          const response = await fetch('/api/cat-ai/chat', {
            headers: { 'X-Session-ID': newSessionId }
          })
          if (response.ok) {
            const data = await response.json()
            if (data.success) setHistory(data.history || [])
          }
        } catch (error) {
          console.error('Failed to load history:', error)
        }
      }
      loadHistory()
    }
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
      timestamp: new Date().toISOString()
    }
    setHistory(prev => [...prev, tempMessage])
    setMessage("")
    try {
      const response = await fetch('/api/cat-ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({ question: message, subject: activeSubject })
      })
      const data = await response.json()
      if (data.success) {
        setHistory(prev => prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, answer: data.answer, modelUsed: data.modelUsed, timestamp: data.timestamp }
            : msg
        ))
        const fullResponse = await fetch('/api/cat-ai/chat', {
          headers: { 'X-Session-ID': sessionId }
        })
        const fullData = await fullResponse.json()
        if (fullData.success) setHistory(fullData.history || [])
      } else {
        console.error('API Error:', data.error)
        setHistory(prev => prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, answer: `Error: ${data.error || 'Failed to get response'}`, modelUsed: '', timestamp: new Date().toISOString() }
            : msg
        ))
      }
    } catch (error) {
      console.error('Error:', error)
      setHistory(prev => prev.map(msg => 
        msg.id === tempMessage.id 
          ? { ...msg, answer: `Connection Error: ${error instanceof Error ? error.message : 'Unknown error'}`, modelUsed: '', timestamp: new Date().toISOString() }
          : msg
      ))
    } finally {
      setIsTyping(false)
    }
  }

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      try {
        await fetch('/api/cat-ai/chat', {
          method: 'DELETE',
          headers: { 'X-Session-ID': sessionId }
        })
        setHistory([])
      } catch (error) {
        console.error('Failed to clear history:', error)
      }
    }
  }

  const subjects = [
    { id: 'general', label: 'General', icon: '🌟' },
    { id: 'varc', label: 'VARC', icon: '📚' },
    { id: 'dilr', label: 'DILR', icon: '📊' },
    { id: 'qa', label: 'Quant', icon: '📐' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className={isFullPageMode
            ? "fixed inset-0 z-50 w-full h-full bg-muted border-border rounded-0 flex flex-col"
            : "fixed bottom-10 right-10 z-50 w-[90vw] max-w-4xl h-[85vh] bg-muted border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          }
        >
          <div className="bg-primary/20 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">CAT Preparation AI</h3>
                <p className="text-gray-400 text-sm">Your personal CAT exam assistant</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background">
            <span className="text-xs text-gray-500 mr-2">Topic:</span>
            {subjects.map(subject => (
              <button
                key={subject.id}
                onClick={() => setActiveSubject(subject.id)}
                className={
                  `px-3 py-1.5 rounded-full text-sm transition-all ${
                    activeSubject === subject.id
                      ? 'bg-amber-500 text-white shadow-lg' 
                      : 'bg-muted hover:bg-amber-500/20 text-gray-300'
                  }`
                }
              >
                <span className="mr-1">{subject.icon}</span>
                {subject.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-background space-y-4">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-amber-500" />
                </div>
                <div className="space-y-2 max-w-xs">
                  <h4 className="font-semibold text-white">Welcome to CAT AI</h4>
                  <p className="text-gray-400 text-sm">Ask me anything about CAT preparation</p>
                </div>
                <div className="grid grid-cols-2 gap-2 max-w-xs w-full mt-4">
                  {['What is the latest CAT exam pattern?', 'How to improve VARC accuracy?', 'Best strategy for DILR sections?', 'Quant tips for time management?'].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMessage(suggestion)
                        setTimeout(() => {
                          const form = document.querySelector('form')
                          if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                        }, 10)
                      }}
                      className="text-left px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors text-gray-400"
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((msg, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-end">
                      <div className="flex items-start gap-2 max-w-[90%]">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                          </div>
                        </div>
                        <div className="bg-muted/80 border border-border rounded-xl px-4 py-2.5 text-sm text-white">
                          {msg.question}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="flex items-start gap-2 max-w-[90%]">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <Bot className="h-3 w-3 text-primary" />
                          </div>
                        </div>
                        <div className="bg-primary/10 border border-border rounded-xl px-4 py-2.5 text-sm text-white">
                          {msg.answer}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 text-center">
                      {msg.modelUsed ? `AI Model: ${msg.modelUsed}` : ''} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
            
            {isTyping && (
              <div className="flex items-center justify-center text-gray-500 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="ml-2 text-xs">Thinking...</span>
              </div>
            )}
          </div>

          <div className="max-h-48 min-h-0 border-t border-border bg-background">
            <CatAiChatHistory history={history} onClear={handleClearHistory} />
          </div>

          <div className="p-4 border-t border-border bg-background">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a CAT preparation question..."
                disabled={isTyping}
                className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isTyping || !message.trim()}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-500">AI may generate incorrect information. Verify important details.</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}