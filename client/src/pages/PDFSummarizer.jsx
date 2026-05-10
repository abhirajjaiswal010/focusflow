import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, UploadCloud, File, X, Sparkles,
  BookOpen, List, RefreshCw, Copy, Check, AlertCircle, Zap
} from 'lucide-react'
import api from '../services/api'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'

export default function PDFSummarizer() {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const fileInputRef = useRef(null)

  // Drag & Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (selectedFile) => {
    setError(null)
    setResult(null)
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.')
      return
    }
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File is too large. Maximum size is 10MB.')
      return
    }
    setFile(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Upload & Process
  const handleSummarize = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('pdf', file)

    try {
      const response = await api.post('/api/pdf/summarize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 150000,
      })
      setResult(response.data)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Summarization failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const copySummary = () => {
    if (!result) return
    const text = `
# ${result.title}
${result.summary}

## Key Points
${result.keyPoints?.map((p) => `- ${p}`).join('\n')}

## Revision Notes
${result.revisionNotes?.map((n) => `- ${n}`).join('\n')}
    `.trim()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}
            >
              <FileText size={18} style={{ color: '#60A5FA' }} />
            </div>
            <div>
              <h2 className="font-bold text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                PDF Summarizer
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Upload notes, papers, or textbooks for instant summaries.
              </p>
            </div>
          </div>
          <Badge variant="blue" size="sm" icon={Sparkles}>Powered by Gemma 4</Badge>
        </div>

        {/* Upload Zone */}
        {!file && (
          <div
            className={`mt-6 p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all ${
              dragActive ? 'border-blue-500 bg-blue-500/5' : 'border-[var(--border)] bg-[var(--bg-elevated)]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
              <UploadCloud size={24} className="text-blue-400" />
            </div>
            <p className="font-semibold text-sm">Drag & drop your PDF here</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 mb-4">Max size: 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleFile(e.target.files[0])
              }}
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              Browse Files
            </Button>
          </div>
        )}

        {/* Selected File State */}
        {file && !result && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-6">
            <div className="p-4 rounded-xl flex items-center justify-between border border-[var(--border-blue)] bg-blue-500/5">
              <div className="flex items-center gap-3 overflow-hidden">
                <File className="text-blue-400 shrink-0" size={24} />
                <div className="truncate">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {!loading && (
                <button onClick={removeFile} className="p-2 text-[var(--text-muted)] hover:text-white transition-colors">
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="mt-4">
              <Button
                variant="primary"
                size="lg"
                icon={Zap}
                fullWidth
                loading={loading}
                onClick={handleSummarize}
              >
                {loading ? 'Reading document...' : 'Generate Summary'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3 rounded-xl flex items-start gap-3 border border-red-500/20 bg-red-500/10"
            >
              <AlertCircle size={16} className="text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400">Processing Failed</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Loading Skeleton */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="card p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles size={14} className="text-blue-400" />
                </motion.div>
                <span className="text-sm font-medium text-blue-400">Gemma 4 is analyzing the document...</span>
              </div>
              <Skeleton width="60%" height={24} />
              <Skeleton.Text lines={4} />
              <div className="divider" />
              <Skeleton width="40%" height={20} />
              <Skeleton.Text lines={3} />
            </div>
          </motion.div>
        )}

        {/* Result Panel */}
        {result && !loading && (
          <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-6">
            
            {/* Header Actions */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold font-['Poppins']">{result.title || 'Document Summary'}</h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1"><BookOpen size={12}/> {result.pages} pages</span>
                  {result.readingTime && <span className="flex items-center gap-1">⏱️ {result.readingTime} read</span>}
                  <Badge variant="teal" size="xs">{result.difficulty || 'Intermediate'}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" icon={copied ? Check : Copy} onClick={copySummary}>
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="secondary" size="sm" icon={RefreshCw} onClick={removeFile}>
                  New PDF
                </Button>
              </div>
            </div>

            <div className="divider" />

            {/* Summary */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-faint)] mb-3 flex items-center gap-2">
                <FileText size={14} /> Executive Summary
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                {result.summary}
              </p>
            </div>

            {/* Topics */}
            {result.topics && result.topics.length > 0 && (
               <div className="flex flex-wrap gap-2 pt-2">
                 {result.topics.map((t, i) => (
                   <span key={i} className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                     {t}
                   </span>
                 ))}
               </div>
            )}

            {/* Two-Column Layout for Points & Notes */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              {/* Key Points */}
              {result.keyPoints && result.keyPoints.length > 0 && (
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-faint)] mb-4 flex items-center gap-2">
                    <List size={14} /> Key Takeaways
                  </h3>
                  <ul className="space-y-3">
                    {result.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Revision Notes */}
              {result.revisionNotes && result.revisionNotes.length > 0 && (
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-faint)] mb-4 flex items-center gap-2">
                    <Sparkles size={14} /> Revision Notes
                  </h3>
                  <ul className="space-y-3">
                    {result.revisionNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
