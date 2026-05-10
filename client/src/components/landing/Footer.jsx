import { Link } from 'react-router-dom'
import { Zap, Code2, MessageCircle, ExternalLink } from 'lucide-react'

const FOOTER_LINKS = {
  Product: [
    { label: 'Study Planner',   path: '/planner'        },
    { label: 'PDF Summarizer',  path: '/pdf-summarizer' },
    { label: 'DSA Explainer',   path: '/dsa-explainer'  },
    { label: 'Focus Timer',     path: '/focus-timer'    },
    { label: 'Analytics',       path: '/analytics'      },
    { label: 'AI Coach',        path: '/ai-coach'       },
  ],
  Resources: [
    { label: 'Documentation',   href: '#' },
    { label: 'API Reference',   href: '#' },
    { label: 'Changelog',       href: '#' },
  ],
  Company: [
    { label: 'About',   href: '#' },
    { label: 'Blog',    href: '#' },
    { label: 'Contact', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer
      className="relative px-4 pt-16 pb-8"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Zap size={17} color="#fff" />
              </div>
              <div>
                <span className="font-bold text-sm block" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  FocusFlow <span className="gradient-text">AI</span>
                </span>
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Powered by Gemma 4</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              An AI-powered productivity platform for students, developers,
              and deep-work practitioners. Built for the Gemma 4 Challenge 2026.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 mt-5">
              {[
                { icon: Code2,          label: 'GitHub',    href: '#' },
                { icon: MessageCircle,  label: 'Twitter',   href: '#' },
                { icon: ExternalLink,   label: 'Live Demo', href: '/dashboard' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2 rounded-xl transition-colors"
                  style={{ color: 'var(--text-faint)', border: '1px solid var(--border)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.borderColor = 'var(--border-accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-faint)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                  title={label}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: 'var(--text-faint)' }}
              >
                {section}
              </p>
              <div className="flex flex-col gap-2.5">
                {links.map(({ label, path, href }) =>
                  path ? (
                    <Link
                      key={label}
                      to={path}
                      className="text-sm transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      key={label}
                      href={href}
                      className="text-sm transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      {label}
                    </a>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs text-center sm:text-left" style={{ color: 'var(--text-faint)' }}>
            © 2026 FocusFlow AI. Built with ❤️ for the{' '}
            <span style={{ color: '#A78BFA' }}>Gemma 4 Challenge</span>.
          </p>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.15)',
              color: '#A78BFA',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Gemma 4 · OpenRouter · Live
          </div>
        </div>
      </div>
    </footer>
  )
}
