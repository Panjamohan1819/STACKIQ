import { LayoutDashboard, BookOpen, BarChart2, FileText, Settings, LogOut, Code, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Redux/Slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Practice', icon: Code, path: '/practice' },
        { name: 'Assessments', icon: BookOpen, path: '/attempt' },
        { name: 'Performance', icon: BarChart2, path: '/results' },
        { name: 'Reports', icon: FileText, path: '/reports' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 glass-sidebar flex flex-col z-50">
            {/* ── Logo ──────────────────────────── */}
            <div className="p-7 pb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <Code className="text-white" size={22} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#050816]" />
                    </div>
                    <div>
                        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            STACKIQ
                        </span>
                        <p className="text-[10px] text-slate-600 font-semibold tracking-widest uppercase">Interview Prep</p>
                    </div>
                </div>
            </div>

            {/* ── Divider ───────────────────────── */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

            {/* ── Navigation ─────────────────────── */}
            <nav className="flex-1 mt-4 px-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                                    isActive
                                    ? 'bg-indigo-500/10 text-white border border-indigo-500/15'
                                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full shadow-lg shadow-indigo-500/50" />
                                    )}
                                    <span className={`transition-all duration-300 ${isActive ? 'text-indigo-400' : 'group-hover:scale-110'}`}>
                                        <Icon size={20} />
                                    </span>
                                    <span className="font-semibold text-sm">{item.name}</span>
                                    {isActive && (
                                        <Sparkles size={12} className="ml-auto text-indigo-500/50" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* ── Pro Banner ────────────────────── */}
            <div className="mx-4 mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/10 relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl" />
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-indigo-300 mb-1">✨ AI Powered</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Generate unlimited practice questions with LLaMA AI
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Bottom Actions ─────────────────── */}
            <div className="p-4 pt-0 space-y-1">
                <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-3" />
                <button className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-all duration-300 text-sm font-medium">
                    <Settings size={18} />
                    <span>Settings</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-red-500/70 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 text-sm font-medium"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
