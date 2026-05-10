import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
}

export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden  lg:gap-6" style={{ background: 'var(--bg-primary)' }}>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            className="sidebar-backdrop lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — desktop fixed, mobile drawer */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        isCollapsed={desktopCollapsed}
        toggleCollapse={() => setDesktopCollapsed(!desktopCollapsed)}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto relative">
          <Topbar onMenuClick={() => setMobileSidebarOpen(true)} />
          
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              {...PAGE_TRANSITION}
              className="py-6 px-8 md:px-16 lg:px-24 xl:px-32 min-h-full max-w-[1600px] mx-auto w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
