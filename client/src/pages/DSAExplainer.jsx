import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2, Sparkles, Terminal, Play, Check, Copy,
  AlertCircle, AlertTriangle, Zap, Lightbulb, Activity, GitBranch
} from 'lucide-react'
import { useAI } from '../hooks/useAI'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'

/* ── Constants ───────────────────────────────────── */
const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
]

const TABS = [
  { id: 'intuition', label: 'Intuition', icon: Lightbulb, color: '#F59E0B' },
  { id: 'brute', label: 'Brute Force', icon: GitBranch, color: '#EF4444' },
  { id: 'optimal', label: 'Optimal', icon: Zap, color: '#10B981' },
  { id: 'dryRun', label: 'Dry Run', icon: Activity, color: '#3B82F6' },
  { id: 'mistakes', label: 'Mistakes', icon: AlertTriangle, color: '#F97316' },
]

/* ── Result Component ────────────────────────────── */
function ExplainerResult({ data }) {
  const [activeTab, setActiveTab] = useState('intuition')
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    if (!data.optimal?.code) return
    navigator.clipboard.writeText(data.optimal.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Content renderers for each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'intuition':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-sm font-bold text-[#F59E0B] uppercase tracking-wider">The Core Idea</h3>
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">{data.intuition}</p>
          </motion.div>
        )
      case 'brute':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex gap-4">
              <Badge variant="pink">Time: {data.bruteForce?.timeComplexity}</Badge>
              <Badge variant="blue">Space: {data.bruteForce?.spaceComplexity}</Badge>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">{data.bruteForce?.approach}</p>
          </motion.div>
        )
      case 'optimal':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex gap-4 mb-2">
              <Badge variant="success">Time: {data.optimal?.timeComplexity}</Badge>
              <Badge variant="success">Space: {data.optimal?.spaceComplexity}</Badge>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">{data.optimal?.approach}</p>
            <div className="relative mt-4 group">
              <button
                onClick={copyCode}
                className="absolute right-2 top-2 p-1.5 rounded-md bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white" />}
              </button>
              <pre className="code-block m-0 font-['JetBrains_Mono',monospace]">
                <code>{data.optimal?.code}</code>
              </pre>
            </div>
          </motion.div>
        )
      case 'dryRun':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-sm font-bold text-[#3B82F6] uppercase tracking-wider">Step-by-step Trace</h3>
            <p className="text-sm leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap">{data.dryRun}</p>
          </motion.div>
        )
      case 'mistakes':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-sm font-bold text-[#F97316] uppercase tracking-wider">Watch out for these</h3>
            <ul className="space-y-3">
              {data.commonMistakes?.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                  <AlertTriangle size={14} className="text-orange-400 mt-1 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )
      default: return null
    }
  }

  return (
    <div className="card h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="purple">{data.category || 'Algorithms'}</Badge>
          <Badge variant="blue">{data.language}</Badge>
        </div>
        <h2 className="text-xl font-bold font-['Poppins']">{data.problemTitle}</h2>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-[var(--border)] bg-[var(--bg-primary)] px-2 no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                isActive ? 'text-white border-[var(--accent-1)]' : 'text-[var(--text-faint)] border-transparent hover:text-[var(--text-muted)]'
              }`}
            >
              <Icon size={15} style={{ color: isActive ? tab.color : 'currentColor' }} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 overflow-y-auto bg-[var(--bg-card)] min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}>
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Similar Problems */}
      {data.similarProblems?.length > 0 && (
        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elevated)]">
          <p className="text-xs text-[var(--text-faint)] mb-2 uppercase tracking-wide font-bold">Similar Problems</p>
          <div className="flex flex-wrap gap-2">
            {data.similarProblems.map((prob, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                {prob}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main Page ───────────────────────────────────── */
export default function DSAExplainer() {
  const [problem, setProblem] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [result, setResult] = useState(null)

  const { call, loading, error } = useAI('/api/dsa/explain', {
    onSuccess: (data) => setResult(data)
  })

  const handleExplain = () => {
    if (!problem.trim()) return
    setResult(null)
    call({ problem, code, language })
  }

  const isReady = problem.trim().length > 10

  return (
    <div className="h-[calc(100vh-80px)] -mt-6 -mx-6 p-6 overflow-hidden flex flex-col md:flex-row gap-6">
      
      {/* ── Left Pane (Input) ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-[45%] lg:w-[40%] flex flex-col gap-4 h-full overflow-y-auto pr-2 custom-scrollbar"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold font-['Poppins'] flex items-center gap-2">
              <Code2 className="text-blue-400" />
              DSA Explainer
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Paste a LeetCode problem, and Gemma will explain the optimal intuition.
            </p>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          {/* Problem Statement */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-muted)] flex items-center justify-between">
              Problem Description *
            </label>
            <Textarea
              placeholder="e.g. Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={6}
              className="font-sans"
            />
          </div>

          {/* User's Code Attempt (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-muted)] flex items-center justify-between">
              <span>Your Code Attempt <span className="text-xs font-normal opacity-60">(Optional)</span></span>
            </label>
            <div className="relative">
              <Terminal size={14} className="absolute left-3 top-3 text-[var(--text-faint)]" />
              <Textarea
                placeholder="Paste your brute-force or buggy code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={8}
                className="font-['JetBrains_Mono',monospace] text-sm pl-9 bg-[#0d1117] border-[var(--border)] focus:border-blue-500"
              />
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-muted)]">Target Language</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={`p-2 text-sm rounded-lg border transition-all ${
                    language === lang.value 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                      : 'border-[var(--border)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 flex gap-3 text-sm text-red-400">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="primary"
          size="lg"
          icon={Play}
          loading={loading}
          disabled={!isReady}
          onClick={handleExplain}
          className="mt-auto w-full sticky bottom-0"
        >
          {loading ? 'Analyzing Complexity...' : 'Explain Problem'}
        </Button>
      </motion.div>

      {/* ── Right Pane (Result) ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-[55%] lg:w-[60%] h-full"
      >
        <AnimatePresence mode="wait">
          {/* Empty State */}
          {!loading && !result && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full border-2 border-dashed border-[var(--border)] rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-blue-500/5">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Terminal size={32} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-bold">Awaiting Problem</h3>
              <p className="text-sm text-[var(--text-muted)] mt-2 max-w-sm">
                Paste a LeetCode problem on the left. Gemma 4 will break it down into intuition, optimal code, and a step-by-step dry run.
              </p>
            </motion.div>
          )}

          {/* Loading Skeleton */}
          {loading && !result && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full card p-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles size={16} className="text-blue-400" />
                </motion.div>
                <span className="text-sm font-medium text-blue-400">Gemma 4 is crafting an explanation...</span>
              </div>
              <Skeleton width="40%" height={32} rounded="lg" />
              <div className="flex gap-2"><Skeleton width={80} height={36} /><Skeleton width={80} height={36} /><Skeleton width={80} height={36} /></div>
              <Skeleton.Text lines={6} />
              <Skeleton height={200} rounded="xl" />
            </motion.div>
          )}

          {/* Render Result */}
          {result && !loading && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <ExplainerResult data={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  )
}
