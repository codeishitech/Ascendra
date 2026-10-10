import { Compass, Swords, Users, ShieldCheck, LogIn, LogOut, Sparkles, Trophy } from 'lucide-react';
import type { User } from '../types/career';
import { ThemeDropdown } from './ThemeDropdown';

interface HeaderProps {
  activeTab: 'world' | 'boss' | 'mentors' | 'passport';
  onTabChange: (tab: 'world' | 'boss' | 'mentors' | 'passport') => void;
  onOpenOnboarding: () => void;
  onOpenJudgeDeck: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export function Header({
  activeTab,
  onTabChange,
  onOpenOnboarding,
  onOpenJudgeDeck,
  currentUser,
  onOpenAuth,
  onLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-3.5">
        {/* Zone 1: Single wordmark in display face */}
        <div
          onClick={() => onTabChange('world')}
          className="text-xl font-bold tracking-tight text-white font-display cursor-pointer select-none whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-sm">
            A
          </div>
          <span>Ascendra</span>
        </div>

        {/* Zone 2: 4 clear single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => onTabChange('world')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'world'
                ? 'text-sky-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Career World
          </button>

          <button
            onClick={() => onTabChange('boss')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'boss'
                ? 'text-amber-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            Boss Arena
          </button>

          <button
            onClick={() => onTabChange('mentors')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'mentors'
                ? 'text-sky-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Mentor Connect
          </button>

          <button
            onClick={() => onTabChange('passport')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'passport'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Career Passport
          </button>
        </nav>

        {/* Zone 3: 1 primary action or authenticated user account controls */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeDropdown />

          <button
            onClick={onOpenJudgeDeck}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Judge Pitch Deck</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTabChange('passport')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{currentUser.name}</span>
              </button>
              <button
                onClick={onLogout}
                title="Log Out"
                className="flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors text-xs font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-400" />
              <span>Log In</span>
            </button>
          )}

          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Calibrate DNA</span>
          </button>
        </div>
      </div>
    </header>
  );
}
