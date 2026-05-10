import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import PageLoader from '../components/ui/PageLoader'
import { useAuth } from '../context/AuthContext'

// Lazy-loaded pages for code splitting
const Landing       = lazy(() => import('../pages/Landing'))
const Dashboard     = lazy(() => import('../pages/Dashboard'))
const StudyPlanner  = lazy(() => import('../pages/StudyPlanner'))
const PDFSummarizer = lazy(() => import('../pages/PDFSummarizer'))
const DSAExplainer  = lazy(() => import('../pages/DSAExplainer'))
const FocusTimer    = lazy(() => import('../pages/FocusTimer'))
const Analytics     = lazy(() => import('../pages/Analytics'))
const AICoach       = lazy(() => import('../pages/AICoach'))
const Login         = lazy(() => import('../pages/Login'))
const Register      = lazy(() => import('../pages/Register'))

// Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  return user ? children : <Navigate to="/login" />
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App shell with sidebar (Protected) */}
        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route path="/dashboard"      element={<Dashboard />} />
          <Route path="/planner"        element={<StudyPlanner />} />
          <Route path="/pdf-summarizer" element={<PDFSummarizer />} />
          <Route path="/dsa-explainer"  element={<DSAExplainer />} />
          <Route path="/focus-timer"    element={<FocusTimer />} />
          <Route path="/analytics"      element={<Analytics />} />
          <Route path="/ai-coach"       element={<AICoach />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
