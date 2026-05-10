import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Bot, User as UserIcon, Sparkles, Flame, Target, MessageSquare
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const SYSTEM_PROMPT = `
You are FocusFlow AI, an elite, highly-disciplined productivity and learning coach. 
Your tone is direct, motivational, and pragmatic—similar to a supportive but strict mentor.
You do not give fluff. You provide actionable advice, psychological frameworks for focus, and algorithmic study strategies.
Keep responses concise, punchy, and highly relevant. Format answers using markdown.
`.trim()

export default function AICoach() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome back${user ? `, ${user.name.split(' ')[0]}` : ''}. I'm your FocusFlow coach. What's blocking your progress today?`
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Local stats for context
  const streak = localStorage.getItem('ff_streak') || '0'
  const sessions = localStorage.getItem('ff_sessions') || '0'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMsg = { id: Date.now().toString(), role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Build context-aware prompt
    const contextStr = `[User Context: Active Streak: ${streak} days. Pomodoro Sessions Completed: ${sessions}.]`
    const fullPrompt = `${contextStr}\n\nUser: ${userMsg.content}`

    try {
      const response = await fetch('http://localhost:5000/api/ai/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ff_token')}`
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          systemPrompt: SYSTEM_PROMPT,
        })
      })

      if (!response.body) throw new Error('ReadableStream not supported.')

      // Prepare empty assistant message
      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          const chunkStr = decoder.decode(value, { stream: true })
          const lines = chunkStr.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ') && !line.includes('[DONE]')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.token) {
                  setMessages((prev) => 
                    prev.map(msg => 
                      msg.id === assistantId 
                        ? { ...msg, content: msg.content + data.token }
                        : msg
                    )
                  )
                }
              } catch (e) {
                // Ignore partial JSON chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error)
      setMessages((prev) => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: '⚠️ Connection lost. Let\'s try that again.' 
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="h-[calc(100vh-80px)] -mt-6 -mx-6 p-6 flex flex-col md:flex-row gap-6">
      
      {/* ── Left Sidebar: Stats & Context ──────────────────────── */}
      <div className="w-full md:w-[300px] flex flex-col gap-4">
        <div className="mb-2">
          <h1 className="text-2xl font-bold font-['Poppins'] flex items-center gap-2">
            <MessageSquare className="text-orange-400" />
            AI Coach
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Elite guidance for extreme productivity.
          </p>
        </div>

        <div className="card p-5 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">Current Status</h3>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Flame size={18} className="text-orange-400" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">{streak} Days</p>
              <p className="text-xs text-[var(--text-muted)]">Active Streak</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Target size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">{sessions} Sessions</p>
              <p className="text-xs text-[var(--text-muted)]">Deep Work Blocks</p>
            </div>
          </div>
        </div>

        <div className="card p-5 bg-[var(--bg-elevated)] border-dashed hidden md:block">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">
            "Your stats are automatically injected into the coach's context window. It knows exactly how hard you're working."
          </p>
        </div>
      </div>

      {/* ── Right Pane: Chat Interface ─────────────────────── */}
      <div className="flex-1 card flex flex-col h-full overflow-hidden relative">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isUser = msg.role === 'user'
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser ? 'bg-blue-500 text-white' : 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
                  }`}>
                    {isUser ? <UserIcon size={14} /> : <Bot size={16} />}
                  </div>
                  
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm'
                  }`}>
                    <span className="whitespace-pre-wrap font-sans">{msg.content}</span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 mr-auto max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-orange-400" />
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center gap-1 rounded-tl-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-primary)]">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. I'm losing focus on System Design today..."
              className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              disabled={isTyping}
            />
            <Button
              variant="primary"
              className="!px-4 !py-4 absolute right-1.5 top-1.5 bottom-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 border-none"
              type="submit"
              disabled={!input.trim() || isTyping}
            >
              <Send size={16} />
            </Button>
          </form>
        </div>

      </div>
    </div>
  )
}
