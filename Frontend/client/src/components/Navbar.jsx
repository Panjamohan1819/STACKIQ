import { Search, Bell, ChevronDown, User as UserIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <header className="sticky top-0 z-40 nav-blur h-20 px-8 flex items-center justify-between transition-all duration-300">
            {/* ── Search Bar ────────────────────── */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search assessments, topics, or history..."
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <kbd className="hidden sm:inline-block px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-slate-500">⌘</kbd>
                        <kbd className="hidden sm:inline-block px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-slate-500">K</kbd>
                    </div>
                </div>
            </div>

            {/* ── Right Actions ─────────────────── */}
            <div className="flex items-center gap-6">
                
                {/* Notification Bell */}
                <button className="relative w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-300 group">
                    <Bell size={18} className="group-hover:animate-shake" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#050816]"></span>
                </button>

                <div className="h-8 w-px bg-white/10"></div>

                {/* User Profile */}
                <button className="flex items-center gap-4 group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                            {user?.name || 'Developer'}
                        </p>
                        <p className="text-[11px] text-indigo-400 font-medium">Pro Plan Access</p>
                    </div>
                    
                    <div className="relative">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300">
                            <div className="w-full h-full bg-[#050816] rounded-xl flex items-center justify-center overflow-hidden">
                                <UserIcon size={20} className="text-slate-400" />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#050816] flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                        </div>
                    </div>
                    
                    <ChevronDown size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
