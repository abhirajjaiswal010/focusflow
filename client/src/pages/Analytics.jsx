import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts'
import {
  TrendingUp, Clock, Target, Zap, Calendar, ArrowUpRight, Flame
} from 'lucide-react'
import Badge from '../components/ui/Badge'
import { useAuth } from '../context/AuthContext'

/* ── Mock Data ───────────────────────────────────── */
const WEEKLY_DATA = [
  { day: 'Mon', hours: 2.5, sessions: 4 },
  { day: 'Tue', hours: 3.8, sessions: 6 },
  { day: 'Wed', hours: 1.5, sessions: 2 },
  { day: 'Thu', hours: 4.2, sessions: 8 },
  { day: 'Fri', hours: 5.0, sessions: 9 },
  { day: 'Sat', hours: 6.5, sessions: 12 },
  { day: 'Sun', hours: 3.0, sessions: 5 },
]

const MONTHLY_TREND = [
  { date: '1st', score: 65 }, { date: '5th', score: 68 },
  { date: '10th', score: 75 }, { date: '15th', score: 72 },
  { date: '20th', score: 85 }, { date: '25th', score: 88 },
  { date: '30th', score: 92 },
]

/* ── Components ──────────────────────────────────── */

function StatCard({ title, value, subtext, icon: Icon, trend, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-5"
    >
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-opacity-10 border"
          style={{ backgroundColor: `${color}15`, borderColor: `${color}30`, color }}
        >
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-400">
          <ArrowUpRight size={12} />
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold font-['Poppins'] text-[var(--text-primary)] mb-1">{value}</h3>
        <p className="text-sm text-[var(--text-primary)] font-medium">{title}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">{subtext}</p>
      </div>
    </motion.div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-elevated)] border border-[var(--border)] p-3 rounded-lg shadow-xl">
        <p className="font-bold text-[var(--text-primary)] mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[var(--text-muted)]">{entry.name}:</span>
            <span className="font-semibold text-[var(--text-primary)]">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

/* ── Main Page ───────────────────────────────────── */
export default function Analytics() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('7d')
  const [realSessions, setRealSessions] = useState(0)
  const [realStreak, setRealStreak] = useState(0)
  const [weeklyData, setWeeklyData] = useState(WEEKLY_DATA)

  useEffect(() => {
    // Fetch real data saved by the Focus Timer
    const savedSessions = parseInt(localStorage.getItem('ff_sessions') || '0', 10)
    const savedStreak = parseInt(localStorage.getItem('ff_streak') || '0', 10)
    
    setRealSessions(savedSessions)
    setRealStreak(savedStreak)

    // Calculate real hours based on Pomodoro sessions (25 mins each)
    const realHoursToday = (savedSessions * 25) / 60

    // Inject today's real data into the chart (Assuming today is Sunday for demo)
    const updatedWeeklyData = [...WEEKLY_DATA]
    updatedWeeklyData[6] = { day: 'Today', hours: Number(realHoursToday.toFixed(1)), sessions: savedSessions }
    setWeeklyData(updatedWeeklyData)
  }, [])

  const totalStudyHours = (26.5 + (realSessions * 25) / 60).toFixed(1)

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16 pt-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold font-['Poppins'] mb-3">
            {user ? `${user.name.split(' ')[0]}'s Analytics` : 'Productivity Analytics'}
          </h1>
          <p className="text-[var(--text-muted)]">Track your deep work and learning velocity.</p>
        </div>
        <div className="flex bg-[var(--bg-elevated)] p-1 rounded-lg border border-[var(--border)]">
          {['7d', '30d', 'All Time'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range 
                  ? 'bg-[#8B5CF6] text-white' 
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Study Hours" value={totalStudyHours} subtext="Includes today's focus" icon={Clock} trend="+45%" color="#8B5CF6" />
        <StatCard title="Focus Sessions" value={46 + realSessions} subtext="Pomodoros completed" icon={Zap} trend="+12%" color="#3B82F6" />
        <StatCard title="Goals Completed" value="12" subtext="Tasks marked as done" icon={Target} trend="+3" color="#10B981" />
        <StatCard title="Current Streak" value={`${realStreak} Days`} subtext="Active daily streak" icon={Flame} trend="Active" color="#F97316" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart: Study Hours */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg font-['Poppins']">Study Hours Over Time</h2>
              <p className="text-sm text-[var(--text-muted)]">Daily deep work tracking</p>
            </div>
            <Badge variant="purple" icon={TrendingUp}>Highly Productive</Badge>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="hours" name="Hours" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Summary AI Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="card p-6 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="text-blue-400" size={20} />
            <h2 className="font-bold text-lg font-['Poppins']">Weekly Summary</h2>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2"><Badge variant="blue" size="xs">AI Insight</Badge></div>
              <p className="text-sm leading-relaxed text-[var(--text-primary)] mt-4">
                You peaked on Saturday with <strong>6.5 hours</strong> of deep work. 
                Your focus velocity is increasing steadily compared to last week. Keep it up!
              </p>
            </div>

            <div className="space-y-3 mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">Top Subjects</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-muted)]">Data Structures</span>
                  <span className="font-medium text-[var(--text-primary)]">45%</span>
                </div>
                <div className="w-full bg-[var(--bg-elevated)] rounded-full h-1.5"><div className="bg-brand-sage h-1.5 rounded-full" style={{ width: '45%', backgroundColor: 'var(--accent-1)' }}></div></div>

                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-[var(--text-muted)]">React Native</span>
                  <span className="font-medium text-[var(--text-primary)]">30%</span>
                </div>
                <div className="w-full bg-[var(--bg-elevated)] rounded-full h-1.5"><div className="bg-brand-blue h-1.5 rounded-full" style={{ width: '30%', backgroundColor: 'var(--accent-2)' }}></div></div>

                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-[var(--text-muted)]">System Design</span>
                  <span className="font-medium text-[var(--text-primary)]">25%</span>
                </div>
                <div className="w-full bg-[var(--bg-elevated)] rounded-full h-1.5"><div className="bg-brand-sand h-1.5 rounded-full" style={{ width: '25%', backgroundColor: 'var(--warning)' }}></div></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Focus Sessions Line Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="card p-6 lg:col-span-3"
        >
          <div className="mb-6">
            <h2 className="font-bold text-lg font-['Poppins']">Focus Consistency Score</h2>
            <p className="text-sm text-[var(--text-muted)]">Aggregated score based on session completion rates</p>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="Score" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
