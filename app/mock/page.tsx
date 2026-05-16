"use client"

export const dynamic = 'force-dynamic'

import React, { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, BarChart, Calculator, Trophy, Clock, ChevronRight, Lightbulb, SkipForward, CheckCircle, XCircle, MinusCircle, RefreshCw, ArrowLeft, Sparkles, PieChart, TrendingUp } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AIChatButton from "@/components/ai-chat-button"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"

interface Question {
  id: number
  question: string
  options: { A: string; B: string; C: string; D: string }
  correct: string
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  hint?: string
}

interface Topic {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  gradient: string
  borderColor: string
  time: number
  questions: number
}

const topics: Topic[] = [
  { id: "varc", name: "VARC", description: "Verbal Ability & Reading Comprehension", icon: BookOpen, color: "text-blue-400", gradient: "from-blue-900/40 to-slate-900/40", borderColor: "border-blue-500/40", time: 20, questions: 10 },
  { id: "dilr", name: "DILR", description: "Data Interpretation & Logical Reasoning", icon: BarChart, color: "text-purple-400", gradient: "from-purple-900/40 to-slate-900/40", borderColor: "border-purple-500/40", time: 20, questions: 10 },
  { id: "qa", name: "Quantitative Aptitude", description: "Mathematics & Problem Solving", icon: Calculator, color: "text-teal-400", gradient: "from-teal-900/40 to-slate-900/40", borderColor: "border-teal-500/40", time: 20, questions: 10 },
  { id: "full", name: "Full Mock Test", description: "Complete CAT Pattern (All 3 Sections)", icon: Trophy, color: "text-amber-400", gradient: "from-amber-900/40 to-slate-900/40", borderColor: "border-amber-500/40", time: 60, questions: 30 },
]

type TestState = "selection" | "active" | "result"

function MockTestContent() {
  const [testState, setTestState] = useState<TestState>("selection")
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintText, setHintText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [streamingQuestion, setStreamingQuestion] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedQuestionComplete, setStreamedQuestionComplete] = useState<Question | null>(null)
  const [testAnalysis, setTestAnalysis] = useState<any>(null)

  // URL parameter handling for auto-starting tests
  const searchParams = useSearchParams()
  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "full" && testState === "selection") {
      const fullTopic = topics.find(t => t.id === "full")
      if (fullTopic) {
        handleTopicSelect(fullTopic)
      }
    }
  }, [searchParams, testState])

  useEffect(() => {
    if (testState === "active" && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && testState === "active") {
      handleSubmitTest()
    }
  }, [testState, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleTopicSelect = async (topic: Topic) => {
    setSelectedTopic(topic)
    setTestState("active")
    setTimeLeft(topic.time * 60)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setSkippedQuestions(new Set())
    setShowHint(false)
    setHintText("")
    setStreamingQuestion("")
    setStreamedQuestionComplete(null)
    
    // Fetch first question with streaming
    await loadQuestionWithStreaming(topic.id, 0)
  }

  const loadQuestionWithStreaming = async (topic: string, questionNumber: number) => {
    setIsLoading(true)
    setIsStreaming(true)
    setStreamingQuestion("")
    setStreamedQuestionComplete(null)
    
    try {
      // First, get the parsed question from API
      const parsedResponse = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, questionNumber })
      })
      
      if (parsedResponse.ok) {
        const question: Question = await parsedResponse.json()
        
        // Simulate streaming by showing question text word by word
        const words = question.question.split(' ')
        let currentText = ''
        
        for (let i = 0; i < words.length; i++) {
          currentText += (i > 0 ? ' ' : '') + words[i]
          setStreamingQuestion(currentText)
          await new Promise(resolve => setTimeout(resolve, 50)) // 50ms per word
        }
        
        setQuestions((prev) => {
          const exists = prev.find((q) => q.id === questionNumber)
          if (exists) return prev
          return [...prev, question]
        })
        setStreamedQuestionComplete(question)
      } else {
        throw new Error("Failed to fetch question")
      }
    } catch (error) {
      console.error("Error fetching question:", error)
      const mockQ = getMockQuestion(questionNumber, topic)
      setQuestions((prev) => [...prev, mockQ])
      setStreamedQuestionComplete(mockQ)
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const fetchQuestion = async (topic: string, questionNumber: number): Promise<Question | null> => {
    try {
      const response = await fetch("/api/generate-question", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ topic, questionNumber }) 
      })
      
      if (!response.ok) throw new Error("Failed to fetch question")
      const data = await response.json()
      return { ...data, id: questionNumber }
    } catch (error) {
      console.error("Error fetching question:", error)
      return getMockQuestion(questionNumber, topic)
    }
  }

  const getMockQuestion = (num: number, topic: string): Question => ({
    id: num,
    question: `Sample Question ${num + 1} for ${topic.toUpperCase()}. This is a placeholder question.`,
    options: { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
    correct: "B",
    explanation: "This is the explanation for the correct answer.",
    difficulty: num % 3 === 0 ? "easy" : num % 3 === 1 ? "medium" : "hard",
  })

  const handleAnswerSelect = (option: string) => setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }))
  
  const handleNext = async () => {
    if (currentQuestionIndex < (selectedTopic?.questions || 1) - 1) {
      const nextIndex = currentQuestionIndex + 1
      
      // Clear current question display
      setStreamingQuestion("")
      setStreamedQuestionComplete(null)
      setShowHint(false)
      setHintText("")
      
      // Update index
      setCurrentQuestionIndex(nextIndex)
      
      // Check if question already exists
      const existingQuestion = questions.find((q) => q.id === nextIndex)
      if (existingQuestion) {
        setStreamedQuestionComplete(existingQuestion)
      } else {
        // Load next question with streaming
        await loadQuestionWithStreaming(selectedTopic!.id, nextIndex)
      }
    }
  }
  
  const handleSkip = () => { 
    setSkippedQuestions((prev) => new Set(prev).add(currentQuestionIndex))
    handleNext()
  }

  const handleGetHint = async () => {
    if (!questions[currentQuestionIndex]) return
    setShowHint(true)
    setIsLoading(true)
    try {
      const response = await fetch("/api/get-hint", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: questions[currentQuestionIndex].question, topic: selectedTopic?.id }) })
      const data = await response.json()
      setHintText(data.hint)
    } catch (error) {
      setHintText("Focus on the key information. Eliminate obviously wrong options first.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitTest = async () => {
    setIsSubmitting(true)
    
    // Ensure all questions are loaded
    if (questions.length < (selectedTopic?.questions || 0)) {
      const remaining = (selectedTopic?.questions || 0) - questions.length
      const newQuestions = await Promise.all(
        Array.from({ length: remaining }, (_, i) => fetchQuestion(selectedTopic!.id, questions.length + i))
      )
      setQuestions((prev) => [...prev, ...newQuestions.filter((q) => q !== null)])
    }
    
    // Calculate section-wise performance for full mock
    if (selectedTopic?.id === 'full') {
      const sectionPerformance = {
        qa: { correct: 0, wrong: 0, total: 0 },
        dilr: { correct: 0, wrong: 0, total: 0 },
        varc: { correct: 0, wrong: 0, total: 0 }
      }
      
      questions.forEach((q, index) => {
        const section = ['qa', 'dilr', 'varc'][index % 3] as keyof typeof sectionPerformance
        sectionPerformance[section].total++
        if (answers[index] === q.correct) {
          sectionPerformance[section].correct++
        } else if (answers[index]) {
          sectionPerformance[section].wrong++
        }
      })
      
      console.log('Section Performance:', sectionPerformance)
    }
    
    // Send answers to AI for analysis
    try {
      const analysisResponse = await fetch("/api/analyze-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic?.id,
          questions: questions.map((q, i) => ({
            questionNumber: i + 1,
            question: q.question,
            correctAnswer: q.correct,
            userAnswer: answers[i] || null,
            isCorrect: answers[i] === q.correct
          })),
          answers,
          results: calculateResults()
        })
      })
      
      if (analysisResponse.ok) {
        const analysis = await analysisResponse.json()
        setTestAnalysis(analysis)
      }
    } catch (error) {
      console.error("Error getting analysis:", error)
    }
    
    setIsSubmitting(false)
    setTestState("result")
  }

  const calculateResults = () => {
    let correct = 0, wrong = 0
    const skipped = skippedQuestions.size
    questions.forEach((q, index) => {
      if (skippedQuestions.has(index)) return
      if (answers[index] === q.correct) correct++
      else if (answers[index]) wrong++
    })
    const score = correct * 3 - wrong
    const total = questions.length * 3
    const percentile = Math.min(99.9, Math.max(0, 50 + (score / total) * 50))
    return { correct, wrong, skipped, score, total, percentile }
  }

  const handleRetake = () => { 
    setTestState("selection")
    setSelectedTopic(null)
    setQuestions([])
    setAnswers({})
    setSkippedQuestions(new Set())
    setTestAnalysis(null)
  }

  const renderTopicSelection = () => (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">CAT Mock Tests</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">AI-powered questions in real exam format</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic, index) => (
          <motion.div key={topic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02, y: -4 }} onClick={() => handleTopicSelect(topic)} className={`relative p-8 rounded-2xl bg-gradient-to-br ${topic.gradient} border ${topic.borderColor} cursor-pointer group overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="relative z-10">
              <topic.icon className={`h-12 w-12 ${topic.color} mb-4`} />
              <h3 className="text-2xl font-bold text-white mb-2">{topic.name}</h3>
              <p className="text-gray-400 mb-4">{topic.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />~{topic.time} minutes</span>
                <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{topic.questions} questions</span>
              </div>
              <div className="mt-6 flex items-center text-accent font-medium group-hover:gap-3 gap-2 transition-all">Start Test <ChevronRight className="h-4 w-4" /></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderActiveTest = () => {
    const question = streamedQuestionComplete || questions[currentQuestionIndex]
    const selectedAnswer = answers[currentQuestionIndex]
    return (
      <div className="pt-20 min-h-screen flex flex-col">
        <div className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
          <div className={`text-2xl font-bold text-center ${timeLeft < 300 ? "text-red-500" : "text-white"}`}>{formatTime(timeLeft)}</div>
        </div>
        <div className="flex-1 flex flex-col lg:flex-row pt-14 lg:pt-20">
          <div className="flex-1 lg:w-[65%] p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-400">Question {currentQuestionIndex + 1} of {selectedTopic?.questions}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${question?.difficulty === "easy" ? "bg-green-500/20 text-green-400" : question?.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>{question?.difficulty || "Medium"}</span>
              </div>
              <div className="bg-surface rounded-2xl border border-border p-6 lg:p-8 mb-6">
                {isStreaming ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-sm text-accent font-medium">AI is generating question...</span>
                    </div>
                    <div className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap border-l-4 border-accent pl-4 py-2 bg-muted/30 rounded-r-xl">
                      {streamingQuestion}
                      <span className="inline-block w-2.5 h-5 bg-accent ml-1 animate-pulse" />
                    </div>
                  </div>
                ) : question ? (
                  <>
                    <motion.p 
                      key={`question-${currentQuestionIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg text-white mb-6 leading-relaxed"
                    >
                      {question.question}
                    </motion.p>
                    
                    <AnimatePresence>
                      {showHint && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
                        >
                          <div className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 text-amber-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-amber-400 mb-1">Hint</p>
                              <p className="text-gray-300 text-sm">{hintText}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {question.options && (
                      <motion.div 
                        key={`options-${currentQuestionIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        {Object.entries(question.options).map(([key, value]) => (
                          <motion.button 
                            key={key}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleAnswerSelect(key)}
                            className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                              selectedAnswer === key 
                                ? "bg-blue-600/20 border-blue-500 text-white" 
                                : "bg-muted/50 border-border text-gray-300 hover:border-gray-500 hover:bg-muted/70"
                            }`}
                          >
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface border border-border text-sm font-bold mr-3">
                              {key}
                            </span>
                            <span className="text-base">{value}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400">Loading question...</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleGetHint} 
                  disabled={isStreaming || !question}
                  className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-xl"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />Hint
                </Button>
                <Button 
                  onClick={handleSkip}
                  disabled={isStreaming || !question}
                  className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/50 rounded-xl"
                >
                  <SkipForward className="h-4 w-4 mr-2" />Skip
                </Button>
                <Button 
                  onClick={currentQuestionIndex < (selectedTopic?.questions || 1) - 1 ? handleNext : handleSubmitTest}
                  disabled={!selectedAnswer || isStreaming}
                  className="flex-1 lg:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestionIndex < (selectedTopic?.questions || 1) - 1 ? (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Submit Test
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="lg:w-[35%] bg-surface border-l border-border p-4 lg:p-6 sticky top-20 h-fit">
            <div className={`text-center mb-6 p-6 rounded-2xl border ${timeLeft < 300 ? "bg-red-500/10 border-red-500/30" : "bg-muted/30 border-border"}`}>
              <Clock className={`h-8 w-8 mx-auto mb-3 ${timeLeft < 300 ? "text-red-500" : "text-gray-400"}`} />
              <div className={`text-4xl font-bold ${timeLeft < 300 ? "text-red-500" : "text-white"}`}>{formatTime(timeLeft)}</div>
              <p className="text-sm text-gray-500 mt-2">Time Remaining</p>
            </div>
            <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border">
              <div className="text-sm font-medium text-gray-400 mb-3">Scoring</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-green-400"><CheckCircle className="h-4 w-4" />Correct</span><span className="text-white font-medium">+3</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-red-400"><XCircle className="h-4 w-4" />Wrong</span><span className="text-white font-medium">-1</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-gray-400"><MinusCircle className="h-4 w-4" />Skipped</span><span className="text-white font-medium">0</span></div>
              </div>
            </div>
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-400 mb-3">Questions</div>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {Array.from({ length: selectedTopic?.questions || 20 }).map((_, i) => {
                  const isAnswered = answers[i]; const isSkipped = skippedQuestions.has(i); const isCurrent = i === currentQuestionIndex
                  return (<button key={i} onClick={() => { setCurrentQuestionIndex(i); setShowHint(false) }} className={`aspect-square rounded-lg text-sm font-medium transition-all ${isCurrent ? "bg-white text-background ring-2 ring-accent" : isAnswered ? "bg-blue-600 text-white" : isSkipped ? "bg-yellow-600/50 text-white" : "bg-muted/50 text-gray-400 hover:bg-muted"}`}>{i + 1}</button>)
                })}
              </div>
            </div>
            <Button onClick={handleSubmitTest} disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-green-600/30">{isSubmitting ? (<><RefreshCw className="h-5 w-5 mr-2 animate-spin" />Submitting...</>) : (<><CheckCircle className="h-5 w-5 mr-2" />Submit Test</>)}</Button>
          </div>
        </div>
      </div>
    )
  }

  const renderResults = () => {
    const results = calculateResults()
    const attempted = results.correct + results.wrong
    const accuracy = attempted > 0 ? ((results.correct / attempted) * 100).toFixed(1) : "0"
    
    // Calculate section-wise performance for full mock
    const sectionPerformance = selectedTopic?.id === 'full' ? {
      qa: { correct: 0, wrong: 0, skipped: 0, total: 0 },
      dilr: { correct: 0, wrong: 0, skipped: 0, total: 0 },
      varc: { correct: 0, wrong: 0, skipped: 0, total: 0 }
    } : null
    
    if (sectionPerformance) {
      questions.forEach((q, index) => {
        const section = ['qa', 'dilr', 'varc'][index % 3] as keyof typeof sectionPerformance
        sectionPerformance[section].total++
        if (answers[index] === q.correct) {
          sectionPerformance[section].correct++
        } else if (answers[index]) {
          sectionPerformance[section].wrong++
        } else {
          sectionPerformance[section].skipped++
        }
      })
    }
    
    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 mb-6">
            <Trophy className="h-10 w-10 text-background" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Test Complete!</h1>
          <p className="text-gray-400 text-lg">{selectedTopic?.name} - {formatTime((selectedTopic?.time || 0) * 60 - timeLeft)} taken</p>
        </motion.div>

        {/* Section-wise Performance for Full Mock */}
        {sectionPerformance && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Section-wise Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(sectionPerformance).map(([section, data]) => {
                const sectionAccuracy = data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : "0"
                const sectionColors = {
                  qa: { bg: 'from-teal-900/40', border: 'border-teal-500/30', text: 'text-teal-400' },
                  dilr: { bg: 'from-purple-900/40', border: 'border-purple-500/30', text: 'text-purple-400' },
                  varc: { bg: 'from-blue-900/40', border: 'border-blue-500/30', text: 'text-blue-400' }
                }
                const colors = sectionColors[section as keyof typeof sectionColors]
                const sectionNames = { qa: 'Quantitative Aptitude', dilr: 'DILR', varc: 'VARC' }
                
                return (
                  <div key={section} className={`bg-gradient-to-br ${colors.bg} to-slate-900/40 border ${colors.border} rounded-2xl p-6`}>
                    <h4 className={`text-lg font-bold ${colors.text} mb-4`}>{sectionNames[section as keyof typeof sectionNames]}</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400">{data.correct}</div>
                        <div className="text-xs text-gray-400">Correct</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-400">{data.wrong}</div>
                        <div className="text-xs text-gray-400">Wrong</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-400">{data.skipped}</div>
                        <div className="text-xs text-gray-400">Skipped</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Accuracy</span>
                        <span className="text-white font-medium">{sectionAccuracy}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${sectionAccuracy}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Main Score Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/30 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-400 mb-2">Your Score</div>
            <div className="text-6xl font-bold text-white mb-2">
              {results.score}<span className="text-2xl text-gray-500">/{results.total}</span>
            </div>
            <div className="text-lg text-accent font-medium mb-6">~{results.percentile.toFixed(1)} Percentile</div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <div className="text-3xl font-bold text-green-400">{results.correct}</div>
                <div className="text-sm text-gray-400">Correct</div>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="text-3xl font-bold text-red-400">{results.wrong}</div>
                <div className="text-sm text-gray-400">Wrong</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/30">
                <div className="text-3xl font-bold text-gray-400">{results.skipped}</div>
                <div className="text-sm text-gray-400">Skipped</div>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="text-3xl font-bold text-blue-400">{accuracy}%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart - Answer Distribution */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-accent" />
              Answer Distribution
            </h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {results.correct > 0 && (
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22c55e" strokeWidth="20" 
                      strokeDasharray={`${(results.correct / questions.length) * 251.2} 251.2`} />
                  )}
                  {results.wrong > 0 && (
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="20" 
                      strokeDasharray={`${(results.wrong / questions.length) * 251.2} 251.2`} 
                      strokeDashoffset={`-${(results.correct / questions.length) * 251.2}`} />
                  )}
                  {results.skipped > 0 && (
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#6b7280" strokeWidth="20" 
                      strokeDasharray={`${(results.skipped / questions.length) * 251.2} 251.2`} 
                      strokeDashoffset={`-${((results.correct + results.wrong) / questions.length) * 251.2}`} />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{questions.length}</div>
                    <div className="text-xs text-gray-400">Questions</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-300">Correct ({results.correct})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-gray-300">Wrong ({results.wrong})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-gray-300">Skipped ({results.skipped})</span>
              </div>
            </div>
          </motion.div>

          {/* Bar Chart - Performance Metrics */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Accuracy Rate</span>
                  <span className="text-white font-medium">{accuracy}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracy}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Attempt Rate</span>
                  <span className="text-white font-medium">{((attempted / questions.length) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(attempted / questions.length) * 100}%` }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Score Percentage</span>
                  <span className="text-white font-medium">{((results.score / results.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(results.score / results.total) * 100}%` }}
                    transition={{ delay: 0.7, duration: 1 }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Analysis */}
        {testAnalysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-surface border border-border rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              AI Performance Analysis
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300">{testAnalysis.overallAnalysis}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {testAnalysis.strengths?.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-amber-400 mb-2">Areas to Improve</h4>
                  <ul className="space-y-1">
                    {testAnalysis.weaknesses?.map((w: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Answer Review Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-surface border border-border rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Answer Review</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((q, index) => {
              const userAnswer = answers[index]
              const isCorrect = userAnswer === q.correct
              const isSkipped = !userAnswer
              
              return (
                <div key={q.id} className={`p-4 rounded-xl border ${
                  isCorrect ? 'bg-green-500/10 border-green-500/30' : 
                  isSkipped ? 'bg-gray-500/10 border-gray-500/30' : 
                  'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? 'bg-green-500 text-white' : 
                      isSkipped ? 'bg-gray-500 text-white' : 
                      'bg-red-500 text-white'
                    }`}>
                      {isCorrect ? <CheckCircle className="h-5 w-5" /> : 
                       isSkipped ? <MinusCircle className="h-5 w-5" /> : 
                       <XCircle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-400">Question {index + 1}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          q.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-white text-sm mb-3">{q.question}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                          <span className="text-gray-400">Your Answer:</span> {userAnswer || 'Skipped'}
                        </div>
                        <div className="text-green-400">
                          <span className="text-gray-400">Correct Answer:</span> {q.correct}
                        </div>
                      </div>
                      {q.explanation && (
                        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-sm text-gray-300">
                            <span className="font-medium text-blue-400">Explanation:</span> {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => setTestState("active")} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold">
            <RefreshCw className="h-5 w-5 mr-2" />Review Test
          </Button>
          <Button onClick={handleRetake} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-background rounded-xl font-semibold">
            Retake Test
          </Button>
          <Button onClick={() => setTestState("selection")} variant="outline" className="px-8 py-4 border-border text-gray-300 rounded-xl font-semibold hover:bg-muted">
            <ArrowLeft className="h-5 w-5 mr-2" />Try Different Topic
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {testState !== "active" && <Navbar />}
      <AnimatePresence mode="wait">
        {testState === "selection" && (<motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderTopicSelection()}</motion.div>)}
        {testState === "active" && (<motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderActiveTest()}</motion.div>)}
        {testState === "result" && (<motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderResults()}</motion.div>)}
      </AnimatePresence>
      {testState !== "active" && <Footer />}
      {testState !== "active" && <AIChatButton />}
    </main>
  )
}

export default function MockTestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <MockTestContent />
    </Suspense>
  )
}

