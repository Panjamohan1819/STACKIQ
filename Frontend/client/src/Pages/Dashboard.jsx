import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { fetchDashboard, fetchRecentAttempts } from "../Redux/Slices/dashboardSlice";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  TrendingUp, Users, Award, BookOpen, ArrowUpRight, 
  Calendar, ChevronRight, Play, Star, Clock, Zap, Target, Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data, loading, error, recentAttempts } = useSelector((state) => state.dashboard);
    const { user } = useSelector((state) => state.auth);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(fetchDashboard());
        dispatch(fetchRecentAttempts());
        const timer = setTimeout(() => setIsLoaded(true), 150);
        return () => clearTimeout(timer);
    }, [dispatch]);

    // Sample data for visualization (fallback)
    const performanceData = data?.performanceTrend || [
        { name: 'Mon', score: 65 },
        { name: 'Tue', score: 59 },
        { name: 'Wed', score: 80 },
        { name: 'Thu', score: 81 },
        { name: 'Fri', score: 56 },
        { name: 'Sat', score: 95 },
        { name: 'Sun', score: 91 },
    ];

    const radarData = data?.topics?.map(t => ({ 
        subject: t.topic.toUpperCase(), 
        A: t.accuracy, 
        fullMark: 100 
    })) || [
        { subject: 'DSA', A: 75, fullMark: 100 },
        { subject: 'DBMS', A: 60, fullMark: 100 },
        { subject: 'OS', A: 85, fullMark: 100 },
        { subject: 'NETWORKS', A: 45, fullMark: 100 },
        { subject: 'ALGO', A: 90, fullMark: 100 },
    ];

    const stats = [
        { label: 'MCQ Solved', value: data?.totalMCQ || '0', icon: <BookOpen className="text-blue-400" size={24} />, trend: '+12%', color: 'blue' },
        { label: 'Code Snippets', value: data?.totalCoding || '0', icon: <Target className="text-emerald-400" size={24} />, trend: '+5.4%', color: 'emerald' },
        { label: 'Global Accuracy', value: `${data?.overallAccuracy || '0'}%`, icon: <Award className="text-amber-400" size={24} />, trend: 'Top 1%', color: 'amber' },
        { label: 'Hours Practiced', value: data?.totalCorrect || '0', icon: <Clock className="text-purple-400" size={24} />, trend: '+8h', color: 'purple' },
    ];

    const isNewUser = data && 
    data.totalMCQ === 0 && 
    data.totalCoding === 0;

    if (loading && !data) return (
        <div className="flex items-center justify-center min-h-screen bg-[#050816] ml-72">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full animate-pulse-glow"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050816] ml-72 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

            <Sidebar />
            <Navbar />
            
            <main className={`relative z-10 p-8 lg:p-10 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                
                {/* ── Welcome Header ──────────────── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            Dashboard Overview
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                            Welcome back, <span className="gradient-text">{user?.name || 'Developer'}</span> 👋
                        </h1>
                        <p className="text-slate-400 text-lg">Your intelligence report is ready. Let's elevate your game today.</p>
                    </div>
                    <button onClick={() => navigate('/attempt')} className="btn-primary flex items-center gap-3 shrink-0 uppercase tracking-widest text-[11px]">
                        <Zap size={16} className="fill-current text-white" />
                        <span>Launch Assessment</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* ── Stats Grid ──────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div 
                            key={i} 
                            className="glass-card stat-card p-6 flex flex-col justify-between"
                            style={{ '--stat-color': `var(--${stat.color})`, animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${stat.color}-500/10 border border-${stat.color}-500/20 shadow-inner overflow-hidden relative group-hover:scale-110 transition-transform duration-500`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                    {stat.icon}
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400 flex items-center gap-1.5 border border-${stat.color}-500/20`}>
                                    <ArrowUpRight size={14} /> {stat.trend}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</h3>
                                <p className="text-sm text-slate-400 font-semibold">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── New User Banner ─────────────── */}
                {isNewUser && (
                    <div className="glass-card p-12 mb-12 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
                        
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl p-[2px] mb-6 shadow-2xl shadow-indigo-500/40">
                                <div className="w-full h-full bg-[#050816] rounded-[22px] flex items-center justify-center">
                                    <Zap size={32} className="text-indigo-400 fill-current" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                                Zero Data Detected. Let's Fix That.
                            </h3>
                            <p className="text-slate-400 leading-relaxed mb-8 text-lg">
                                Your skills radar is completely empty. Generate your first AI-driven assessment to unlock personalized metrics, skill gaps, and intelligence insights.
                            </p>
                            <button onClick={() => navigate('/attempt')} className="btn-primary text-lg px-8 py-3.5">
                                Initiate First Sequence
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Charts Row ──────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Performance Line Chart */}
                    <div className="lg:col-span-2 glass-card p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Weekly Performance</h3>
                                <p className="text-sm text-slate-400 font-medium">Your accuracy trajectory over time</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 p-1 rounded-xl flex">
                                <button className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/30">7d</button>
                                <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">30d</button>
                            </div>
                        </div>
                        
                        <div className="flex-1 min-h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.06)" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}}
                                        dy={15}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', padding: '12px 20px'}}
                                        itemStyle={{color: '#818cf8', fontWeight: 700, fontSize: '16px'}}
                                        cursor={{ stroke: 'rgba(99,102,241,0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="score" 
                                        stroke="#818cf8" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorScore)" 
                                        animationDuration={1500}
                                        animationEasing="ease-out"
                                        activeDot={{ r: 8, fill: '#818cf8', stroke: '#0f172a', strokeWidth: 4, transform: 'scale(1.2)' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Skill Radar Chart */}
                    <div className="glass-card p-8 flex flex-col relative overflow-hidden text-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl pointer-events-none" />
                        
                        <h3 className="text-xl font-bold text-white tracking-tight">Competency Matrix</h3>
                        <p className="text-sm text-slate-400 font-medium mb-6">Topic-wise proficiency analysis</p>
                        
                        <div className="flex-1 w-full min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                                    <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700, letterSpacing: '1px'}} />
                                    <Radar
                                        name="Proficiency"
                                        dataKey="A"
                                        stroke="#a855f7"
                                        strokeWidth={3}
                                        fill="#a855f7"
                                        fillOpacity={0.35}
                                        animationDuration={1500}
                                    />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(168,85,247,0.3)'}}
                                        itemStyle={{color: '#c084fc', fontWeight: 'bold'}}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 text-left relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 text-indigo-500/10"><Star size={64} fill="currentColor"/></div>
                            <div className="flex items-center gap-2 mb-2 relative z-10">
                                <Sparkles className="text-indigo-400" size={16} />
                                <span className="text-sm font-bold text-slate-200 uppercase tracking-widest text-[11px]">AI Insight</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium relative z-10">
                                Prioritize <span className="text-indigo-300 font-bold border-b border-indigo-500/30">Computer Networks</span> to balance your overall architecture score.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Assessment History Table ────────── */}
                <div className="glass-card p-0 overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white tracking-tight">Assessment History Logs</h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <Clock size={12} className="text-indigo-400" />
                            Latest 15 Logs
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto hidden-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#0a0e1a]/90 backdrop-blur-md z-10 border-b border-white/10">
                                <tr>
                                    <th className="py-4 px-8 font-bold text-slate-500 text-[11px] uppercase tracking-widest">Assessment Mission</th>
                                    <th className="py-4 px-8 font-bold text-slate-500 text-[11px] uppercase tracking-widest">Category</th>
                                    <th className="py-4 px-8 font-bold text-slate-500 text-[11px] uppercase tracking-widest">Type</th>
                                    <th className="py-4 px-8 font-bold text-slate-500 text-[11px] uppercase tracking-widest">Date & Time</th>
                                    <th className="py-4 px-8 font-bold text-slate-500 text-[11px] uppercase tracking-widest text-right">Outcome</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentAttempts && recentAttempts.length > 0 ? (
                                    recentAttempts.map((row, idx) => (
                                        <tr key={idx} className="group hover:bg-white/[0.04] transition-colors">
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                                        <BookOpen size={18} className="text-slate-400" />
                                                    </div>
                                                    <span className="font-bold text-slate-200 truncate max-w-[250px]">{row.questionId?.title || 'System Check Sequence'}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <span className="inline-flex py-1 px-3 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-slate-400">
                                                    {row.topic || row.questionId?.topic || 'General'}
                                                </span>
                                            </td>
                                            <td className="py-5 px-8">
                                                <span className={`badge ${
                                                    row.type === 'coding' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                    {row.type || 'MCQ'}
                                                </span>
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-300">
                                                        {new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-medium">
                                                        {new Date(row.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8 text-right">
                                                {row.isCorrect ? (
                                                    <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Correct
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 text-red-400 font-bold text-sm bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 shadow-lg shadow-red-500/10">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> Incorrect
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-500 font-medium">
                                            No logs detected in the system archive.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
