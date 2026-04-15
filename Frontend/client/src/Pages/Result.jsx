import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { 
    CheckCircle, XCircle, ChevronLeft, Target, 
    Award, Brain, MessageSquare, Code2, ShieldAlert
} from 'lucide-react';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results || [];

    const correctCount = results.filter(r => r.isCorrect === true).length;
    const total = results.length;
    const accuracy = total === 0 ? 0 : Math.round((correctCount / total) * 100);

    return (
        <div className="min-h-screen bg-[#050816] ml-72 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <Sidebar />
            <Navbar />
            
            <main className="relative z-10 p-8 lg:p-10">
                {/* ── Header ────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in-up">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            AI Evaluation Complete
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                            Intelligence <span className="gradient-text">Report</span>
                        </h1>
                        <p className="text-slate-400 text-lg">Review your performance telemetry and AI-driven feedback</p>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="btn-primary group flex items-center gap-3 shrink-0 uppercase tracking-widest text-[11px]"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Return to Dashboard</span>
                    </button>
                </div>

                {/* ── Performance HUD ───────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up delay-100">
                    <div className="glass-card stat-card p-8 flex flex-col items-center justify-center text-center group" style={{ '--stat-color': 'var(--indigo)' }}>
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-indigo-500/20">
                            <Target className="text-indigo-400" size={32} />
                        </div>
                        <h3 className="text-6xl font-black text-white mb-2 tracking-tighter">{accuracy} <span className="text-2xl text-indigo-400 ml-[-8px]">%</span></h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Global Accuracy</p>
                    </div>

                    <div className="glass-card stat-card p-8 flex flex-col items-center justify-center text-center group" style={{ '--stat-color': 'var(--emerald)' }}>
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-emerald-500/20">
                            <CheckCircle className="text-emerald-400" size={32} />
                        </div>
                        <h3 className="text-6xl font-black text-white mb-2 tracking-tighter">
                            {correctCount}
                            <span className="text-2xl text-slate-500 mx-2">/</span>
                            <span className="text-4xl text-slate-400">{total}</span>
                        </h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Targets Hit</p>
                    </div>

                    <div className="glass-card stat-card p-8 flex flex-col items-center justify-center text-center group" style={{ '--stat-color': 'var(--amber)' }}>
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-amber-500/20">
                            <Award className="text-amber-400" size={32} />
                        </div>
                        <h3 className="text-3xl font-black text-white my-4 tracking-tight">
                            {accuracy >= 80 ? 'Mastery Tier' : accuracy >= 60 ? 'Competent Tier' : 'Training Required'}
                        </h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Performance Rating</p>
                    </div>
                </div>

                {/* ── Detailed Telemetry Logs ───────── */}
                <div className="glass-card p-8 lg:p-10 animate-fade-in-up delay-200">
                    <h3 className="text-2xl font-black text-white tracking-tight mb-8 flex items-center gap-3">
                        <span className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
                            <MessageSquare size={24} className="text-indigo-400" />
                        </span>
                        Response Telemetry Logs
                    </h3>

                    {results.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                            <ShieldAlert className="mx-auto text-slate-600 mb-4" size={48} />
                            <h4 className="text-xl font-bold text-white mb-2">No logs found</h4>
                            <p className="text-slate-500">Return to the dashboard to initiate a test sequence.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {results.map((r, i) => (
                                <div 
                                    key={i} 
                                    className={`relative p-8 rounded-3xl border-2 transition-all duration-300 ${
                                        r.isCorrect 
                                        ? 'border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.03] to-transparent hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5' 
                                        : 'border-red-500/20 bg-gradient-to-br from-red-500/[0.03] to-transparent hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/5'
                                    }`}
                                >
                                    {/* Question Header */}
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="mt-1">
                                            {r.isCorrect 
                                                ? <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/20"><CheckCircle size={28} /></div> 
                                                : <div className="p-2 rounded-xl bg-red-500/10 text-red-400 ring-1 ring-red-500/50 shadow-lg shadow-red-500/20"><XCircle size={28} /></div>
                                            }
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-white/5 py-1 px-3 rounded-lg border border-white/10">MISSION {i+1}</span>
                                                <span className={`badge ${r.type === 'coding' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                                    {r.type === 'coding' ? 'CODE SNIPPET' : 'MULTIPLE CHOICE'}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-white text-xl leading-relaxed">{r.title}</h4>
                                        </div>
                                    </div>
                                    
                                    {/* Code/Answer Box */}
                                    <div className="bg-[#050816]/80 p-5 rounded-2xl mb-6 border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                            <Code2 size={40} className="text-slate-500" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> User Payload
                                        </p>
                                        <p className="text-slate-300 whitespace-pre-wrap font-mono text-sm pl-4 border-l-2 border-indigo-500/30 overflow-x-auto">
                                            {r.userAnswer || <span className="text-slate-600 italic">No output received</span>}
                                        </p>
                                    </div>

                                    {/* AI Feedback */}
                                    <div className={`p-6 rounded-2xl border ${r.isCorrect ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                                        <p className={`text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${r.isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                                            <Brain size={16} /> AI Evaluation Output
                                        </p>
                                        
                                        <div className="space-y-4">
                                            {r.correctAnswer && !r.isCorrect && (
                                                <div>
                                                    <span className="text-xs font-semibold text-slate-400 uppercase">Correct Hash: </span>
                                                    <span className="text-sm font-bold text-emerald-400">{r.correctAnswer}</span>
                                                </div>
                                            )}

                                            {r.feedback && (
                                                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                                    {r.feedback}
                                                </p>
                                            )}
                                            
                                            {r.suggestion && (
                                                <div className="mt-4 pt-4 border-t border-white/5 flex gap-3 items-start">
                                                    <div className="w-8 h-8 shrink-0 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 ring-1 ring-indigo-500/20">
                                                        <span className="text-sm">💡</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Optimization Note</p>
                                                        <p className="text-sm text-indigo-200/80 italic font-medium">{r.suggestion}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Results;