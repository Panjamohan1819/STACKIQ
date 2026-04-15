import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Redux/Slices/authSlice";

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(registerUser(formData));
        if (registerUser.fulfilled.match(result)) {
            navigate('/login');
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-6" style={{ background: '#050816' }}>

            {/* ── Grid Background ────────────────── */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
            }} />

            {/* ── Glow Orbs ─────────────────────── */}
            <div className="absolute top-[-8%] left-[-5%] w-[550px] h-[550px] rounded-full animate-pulse-glow pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)' }} />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full animate-pulse-glow pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', animationDelay: '1.5s' }} />
            <div className="absolute top-[40%] right-[25%] w-[300px] h-[300px] rounded-full animate-pulse-glow pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', animationDelay: '3s' }} />

            {/* ── Particles ────────────────────── */}
            <div className="absolute top-[25%] right-[10%] w-1 h-1 bg-purple-400/40 rounded-full animate-float" />
            <div className="absolute top-[70%] left-[15%] w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />

            {/* ── Register Card ─────────────────── */}
            <div className="glass-card w-full max-w-lg p-10 animate-scale-in relative z-10 group">

                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />

                <div className="relative z-10">
                    {/* Brand */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-xl shadow-purple-600/25 mb-6 group-hover:scale-110 transition-all duration-500">
                            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="8" x2="19" y2="14" />
                                <line x1="22" y1="11" x2="16" y2="11" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight gradient-text mb-2">
                            Create Account
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">
                            Join the interview preparation network
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-sm animate-shake">
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span className="font-medium">
                                {typeof error === 'string' ? error : error.message || 'Validation failed'}
                            </span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Full Name</label>
                            <div className="relative group/input">
                                <input name="name" type="text" placeholder="John Doe" className="input-field pl-12" onChange={handleChange} value={formData.name} required />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Email Address</label>
                            <div className="relative group/input">
                                <input name="email" type="email" placeholder="name@stackiq.dev" className="input-field pl-12" onChange={handleChange} value={formData.email} required />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Password</label>
                            <div className="relative group/input">
                                <input name="password" type="password" placeholder="••••••••" className="input-field pl-12" onChange={handleChange} value={formData.password} required />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center pt-6 border-t border-white/5">
                        <p className="text-slate-600 text-sm">
                            Already have an account?{' '}
                            <button onClick={() => navigate('/login')} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors ml-1 underline underline-offset-4 decoration-indigo-500/30">
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;