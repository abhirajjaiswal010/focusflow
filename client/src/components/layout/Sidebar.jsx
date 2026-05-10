import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Map, FileText, Code2,
  Timer, BarChart3, MessageSquare, Zap, X, LogOut,
  ChevronLeft
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#7C9A7E' },
  { path: '/planner', icon: Map, label: 'Study Planner', color: '#6B8DE3' },
  { path: '/pdf-summarizer', icon: FileText, label: 'PDF Summarizer', color: '#7C9A7E' },
  { path: '/dsa-explainer', icon: Code2, label: 'DSA Explainer', color: '#C7A27C' },
  { path: '/focus-timer', icon: Timer, label: 'Focus Timer', color: '#E38484' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics', color: '#7C9A7E' },
  { path: '/ai-coach', icon: MessageSquare, label: 'AI Coach', color: '#C7A27C' },
]

function NavItem({ path, icon: Icon, label, color, onClick, isCollapsed }) {
  const location = useLocation()
  const isActive = location.pathname === path

  return (
    <NavLink to={path} onClick={onClick}>
      <div
        className={`flex items-center gap-3.5 py-5 rounded-2xl text-[0.85rem] font-bold relative group transition-all duration-500 ${isCollapsed ? 'px-0 justify-center' : 'px-5'} text-white`}
      >
        

        {/* Active Pill Indicator */}
        {isActive && (
          <div
            className="absolute left-0 w-1 h-10 rounded-full"
            style={{ background: color, boxShadow: `0 0 0px ${color}` }}
          />
        )}

        {/* Icon */}
        <span
          className={`shrink-0 transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
          style={{
            color: isActive ? color : 'inherit',
          }}
        >
          <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        </span>
        
        {!isCollapsed && (
          <span className="truncate whitespace-nowrap tracking-wide">
            {label}
          </span>
        )}
      </div>
    </NavLink>
  )
}

export default function Sidebar({ mobileOpen, onMobileClose, isCollapsed, toggleCollapse }) {
  const [isHovered, setIsHovered] = useState(false)
  const location = useLocation()
  useEffect(() => { onMobileClose?.() }, [location.pathname])
  const { user, logout } = useAuth()

  const effectiveCollapsed = isCollapsed && !isHovered
  const sidebarWidth = effectiveCollapsed ? '88px' : '260px'

  const sidebarContent = (
    <div
      className="flex flex-col h-full relative"
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand Section */}
      <div
        className={`flex items-center pt-14 pb-20 shrink-0 transition-all duration-500 ${effectiveCollapsed ? 'px-0 justify-center' : 'px-8 gap-4'}`}
      >
        <div
          className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-xl cursor-pointer hover:bg-white/20 transition-all duration-300"
          onClick={toggleCollapse}
        >
          <Zap size={20} fill="#fff" className="text-white" />
        </div>
        
        {!effectiveCollapsed && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="font-black text-[1rem] leading-tight text-white  " style={{ fontFamily: 'Manrope, sans-serif' }}>
              FOCUS<span className="text-white/40">FLOW</span>
            </p>
           
          </div>
        )}
      </div>

      {/* Desktop Collapse Toggle */}
      <button
        onClick={toggleCollapse}
        className="hidden lg:flex absolute -right-3 top-20 w-10 h-10 rounded-full bg-[#1A1719] border border-white/10 items-center justify-center shadow-2xl z-50 hover:bg-white/10 hover:scale-110 transition-all duration-300"
        style={{ color: '#fff' }}
      >
        <div className={`transition-transform duration-500 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronLeft size={12} strokeWidth={4} />
        </div>
      </button>

      

      <nav className={`flex-1 overflow-y-auto pb-6 custom-scrollbar transition-all duration-500 ${effectiveCollapsed ? 'px-3 pt-6 space-y-2' : 'px-4 space-y-4'}`}>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.path}
            {...item}
            onClick={onMobileClose}
            isCollapsed={effectiveCollapsed}
          />
        ))}
      </nav>

      {/* User Section */}
      <div
        className={`py-6 shrink-0 transition-all duration-500 ${effectiveCollapsed ? 'px-3' : 'px-4'}`}
      >
        <div
          className={`flex items-center p-2.5 rounded-2xl transition-all duration-500 bg-white/5 border border-white/5 hover:border-white/10 ${effectiveCollapsed ? 'justify-center' : 'gap-3'}`}
        >
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-xs font-black text-black shrink-0 shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          {!effectiveCollapsed && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-[0.75rem] font-black text-white truncate">{user?.name || 'User Name'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[9px] font-black tracking-widest text-white/30 uppercase">SYSTEM ACTIVE</p>
              </div>
            </div>
          )}

          {!effectiveCollapsed && (
            <button
              onClick={logout}
              className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col h-full shrink-0 sticky top-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] "
        style={{
          width: sidebarWidth,
          background: '#1A1719',
         
          borderRight: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '0 2rem 2rem 0',
          overflow: 'visible'
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onMobileClose}
      />
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col w-[280px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: '#1A1719',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
