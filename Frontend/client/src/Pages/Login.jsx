import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../Redux/Slices/authSlice'

const features = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'AI-Powered Questions',
    desc: 'Adaptive questions tailored to your skill level and tech stack.',
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Real-Time Analytics',
    desc: 'Track your progress with detailed performance dashboards.',
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Mock Interviews',
    desc: 'Simulate real interviews with instant AI-driven feedback.',
  },
]

const stats = [
  { value: '10K+', label: 'Questions' },
  { value: '95%', label: 'Success Rate' },
  { value: '50+', label: 'Tech Stacks' },
]

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(formData))
    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex" style={{ background: '#050816' }}>

      {/* ── Animated Grid Background ──────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* ── Animated Glow Orbs ────────────────── */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full animate-pulse-glow pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full animate-pulse-glow pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', animationDelay: '1.5s' }} />
      <div className="absolute top-[50%] left-[30%] w-[300px] h-[300px] rounded-full animate-pulse-glow pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', animationDelay: '3s' }} />

      {/* ── Floating Particles ───── */}
      <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-indigo-400/40 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-[60%] right-[20%] w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[35%] right-[35%] w-1 h-1 bg-cyan-400/30 rounded-full animate-float" style={{ animationDelay: '4s' }} />

      {/* ═══════════════════════════════════════════
          LEFT PANEL — Branding & Info
          ═══════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-16 xl:px-24 animate-fade-in-up">

        {/* Decorative vertical line */}
        <div className="absolute right-0 top-[10%] bottom-[10%] w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.25), transparent)' }} />

        {/* Brand */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-lg shadow-indigo-600/25">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
                <line x1="12" y1="2" x2="12" y2="22" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-400 tracking-wider uppercase">StackIQ</span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-black leading-tight mb-4">
            <span className="text-white">Crack your next</span><br />
            <span className="gradient-text">tech interview.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            AI-powered practice platform that adapts to your level. Build confidence, track progress, and land the role you deserve.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-5 mb-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-4 group animate-fade-in-up"
              style={{ animationDelay: `${0.2 + i * 0.15}s` }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all duration-300">
                {f.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-0.5">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black gradient-text">{s.value}</div>
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <div className="glass-card p-5 max-w-md" style={{ borderRadius: '1rem' }}>
            <p className="text-slate-400 text-sm italic leading-relaxed mb-3">
              "StackIQ transformed my prep. The AI feedback pinpointed exactly where I was weak — landed my dream offer in 3 weeks."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">A</div>
              <div>
                <div className="text-white text-xs font-semibold">Arjun M.</div>
                <div className="text-slate-500 text-[11px]">SDE II @ Google</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          RIGHT PANEL — Login Form
          ═══════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="glass-card w-full max-w-md p-10 animate-scale-in relative group">

          {/* Hover glow effect */}
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />

          <div className="relative z-10">
            {/* ── Brand ─────────────────────────── */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-xl shadow-indigo-600/25 mb-6 group-hover:scale-110 group-hover:shadow-indigo-600/40 transition-all duration-500">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                </svg>
              </div>
              <h1 className="text-4xl font-black tracking-tight gradient-text mb-3">
                STACKIQ
              </h1>
              <p className="text-slate-500 text-sm font-medium tracking-wide">
                Master your narrative. Elevate your edge.
              </p>
            </div>

            {/* ── Error ─────────────────────────── */}
            {error && (
              <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-sm animate-shake">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="font-medium">
                  {typeof error === 'string' ? error : error.message || 'Verification failed'}
                </span>
              </div>
            )}

            {/* ── Form ──────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Email Address</label>
                <div className="relative group/input">
                  <input
                    name="email"
                    type="email"
                    placeholder="dev@stackiq.ai"
                    className="input-field pl-12"
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Password</label>
                <div className="relative group/input">
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="input-field pl-12"
                    onChange={handleChange}
                    value={formData.password}
                    required
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base mt-2"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* ── Footer ────────────────────────── */}
            <div className="mt-8 text-center pt-6 border-t border-white/5">
              <p className="text-slate-600 text-sm">
                New to STACKIQ?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors ml-1 underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-400/50"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login