import { useState, useEffect } from 'react';
import {
  Compass,
  Swords,
  Users,
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Zap,
  Eye,
  EyeOff,
  Briefcase,
  PlayCircle,
  HelpCircle,
  Trash2,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import {
  api,
  getSavedAccounts,
  saveSavedAccount,
  removeSavedAccount,
  type SavedAccount,
} from '../services/api';
import type { User, CareerDNA, CareerWorldData } from '../types/career';
import { ThemeDropdown } from './ThemeDropdown';
import { AnimatedBackground } from './AnimatedBackground';

interface LoginPageProps {
  onAuthSuccess: (user: User, profile: CareerDNA, roadmap: CareerWorldData) => void;
}

export function LoginPage({ onAuthSuccess }: LoginPageProps) {
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('AI Research Engineer');
  const [customRole, setCustomRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved accounts on mount
  useEffect(() => {
    const list = getSavedAccounts();
    setSavedAccounts(list);
    if (list.length > 0) {
      // Pre-fill with the most recently used account
      setEmail(list[0].email);
      if (list[0].password) {
        setPassword(list[0].password);
      }
    }
  }, []);

  const predefinedRoles = [
    'AI Research Engineer',
    'Autonomous Systems & Robotics Lead',
    'Distributed Systems Architect',
    'Cloud Infrastructure & MLOps Lead',
    'Cyber Threat Defense & Systems',
    'Full-Stack WebAssembly Architect',
    'Other / Custom Track',
  ];

  // When email input changes, check if we have a saved password for it
  const handleEmailChange = (val: string) => {
    setEmail(val);
    const matched = savedAccounts.find((a) => a.email.toLowerCase() === val.toLowerCase().trim());
    if (matched && matched.password) {
      setPassword(matched.password);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        if (!email.trim() || !password) {
          throw new Error('Please enter a valid email and password');
        }

        const effectiveRole =
          targetRole === 'Other / Custom Track' && customRole.trim()
            ? customRole.trim()
            : targetRole;

        const res = await api.signup({
          name: name.trim(),
          email: email.trim(),
          password,
          targetRole: effectiveRole,
        });

        if (rememberMe) {
          saveSavedAccount({
            email: res.user.email,
            name: res.user.name,
            targetRole: res.user.targetRole,
            password,
            lastUsed: new Date().toISOString(),
          });
          setSavedAccounts(getSavedAccounts());
        }

        onAuthSuccess(res.user, res.profile, res.roadmap);
      } else {
        if (!email.trim() || !password) {
          throw new Error('Please enter your email and password');
        }
        const res = await api.login({
          email: email.trim(),
          password,
        });

        if (rememberMe) {
          saveSavedAccount({
            email: res.user.email,
            name: res.user.name,
            targetRole: res.user.targetRole,
            password,
            lastUsed: new Date().toISOString(),
          });
          setSavedAccounts(getSavedAccounts());
        }

        onAuthSuccess(res.user, res.profile, res.roadmap);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Instant 1-Click Login from a Saved Account
  const handleQuickAccountLogin = async (acc: SavedAccount) => {
    setError(null);
    setLoading(true);
    setEmail(acc.email);
    if (acc.password) setPassword(acc.password);

    try {
      const res = await api.login({
        email: acc.email,
        password: acc.password || 'demo1234',
      });
      onAuthSuccess(res.user, res.profile, res.roadmap);
    } catch (err: any) {
      setError(err.message || `Failed to sign in as ${acc.name}.`);
    } finally {
      setLoading(false);
    }
  };

  // Remove saved account from this device
  const handleRemoveAccount = (emailToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSavedAccount(emailToRemove);
    const updated = getSavedAccounts();
    setSavedAccounts(updated);
    if (email.toLowerCase() === emailToRemove.toLowerCase()) {
      setEmail(updated.length > 0 ? updated[0].email : '');
      setPassword(updated.length > 0 ? updated[0].password || '' : '');
    }
  };

  // Fast Guest Explorer Entry
  const handleGuestEntry = async () => {
    setError(null);
    setLoading(true);
    try {
      const guestId = `guest_${Date.now()}`;
      const guestEmail = `guest_${Date.now()}@ascendra.dev`;
      const res = await api.signup({
        name: 'Guest Explorer',
        email: guestEmail,
        password: 'guest-session',
        targetRole: 'AI Research Engineer',
      });
      onAuthSuccess(res.user, res.profile, res.roadmap);
    } catch (err: any) {
      // Fallback: login to demo if signup guest hits conflict
      handleQuickAccountLogin({
        email: 'alex@ascendra.dev',
        name: 'Alex Vance',
        targetRole: 'AI Research Engineer',
        password: 'demo1234',
        lastUsed: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
      <AnimatedBackground />

      {/* Top Simple Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-sky-500/20">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-display">
              Ascendra
            </h1>
            <p className="text-[10px] font-mono text-sky-400 font-medium tracking-wide">
              CAREER WORLD RPG
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeDropdown />

          {savedAccounts.length > 0 && (
            <button
              onClick={() => handleQuickAccountLogin(savedAccounts[0])}
              disabled={loading}
              className="text-xs font-mono text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Continue as {savedAccounts[0].name.split(' ')[0]}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Dual-Column Content */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left Column: World & Value Narrative */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              RPG-Style Career Development Engine
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-display leading-[1.1] text-balance">
              Forge your skills. <br />
              <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                Unlock your future.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Step into an adaptive RPG world. Progress through non-linear skill trees, submit verified project evidence, battle capstone technical bosses, and connect with industry staff engineers.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-sky-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2.5">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white font-display">Interactive 4-Tier World</h4>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Visual dependency graph with unlockable prerequisites, adaptive pruning, and fast-track routing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2.5">
                <Swords className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white font-display">Capstone Boss Battles</h4>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Multi-phase synthesis trials with real benchmarks, damage meters, and verified credential loot.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white font-display">Staff Engineer Mentors</h4>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Direct code reviews and architectural critiques from DeepMind, Netflix, and Stripe engineers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white font-display">Career Passport & Proofs</h4>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Replace self-reported resumes with cryptographic artifact links and rubric scorecards.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="p-6 sm:p-8 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500"></div>

            {/* Form Mode Toggle */}
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* SAVED ACCOUNTS SELECTOR (Prevents having to re-create accounts) */}
            {mode === 'login' && savedAccounts.length > 0 && (
              <div className="mb-6 pb-5 border-b border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2.5">
                  <span className="flex items-center gap-1 text-sky-400 font-bold">
                    <KeyRound className="w-3.5 h-3.5" /> Saved Accounts On This Device
                  </span>
                  <span className="text-[10px] text-slate-500">{savedAccounts.length} saved</span>
                </div>

                <div className="space-y-2">
                  {savedAccounts.map((acc) => {
                    const isSelected = email.toLowerCase() === acc.email.toLowerCase();
                    return (
                      <div
                        key={acc.email}
                        onClick={() => {
                          setEmail(acc.email);
                          if (acc.password) setPassword(acc.password);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-sky-950/40 border-sky-500/50 shadow-sm'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                            {acc.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                              <span>{acc.name}</span>
                              {acc.email === 'singhishita7784@gmail.com' && (
                                <span className="px-1.5 py-0.2 bg-emerald-950 border border-emerald-500/40 text-[9px] text-emerald-300 rounded font-mono">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              {acc.email}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAccountLogin(acc);
                            }}
                            disabled={loading}
                            className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
                          >
                            1-Click Login
                          </button>
                          {acc.email !== 'alex@ascendra.dev' && (
                            <button
                              type="button"
                              onClick={(e) => handleRemoveAccount(acc.email, e)}
                              title="Forget account on this device"
                              className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-5">
              <h3 className="text-xl font-bold text-white font-display">
                {mode === 'login' ? 'Or Sign In with Email' : 'Initialize Your Career Twin'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'login'
                  ? 'Enter your credentials. They will be securely saved on this device for instant access.'
                  : 'Start at Level 1 Initiate and unlock your personal tech trajectory.'}
              </p>
            </div>

            {error && (
              <div className="p-3 mb-5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ishita Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Career Specialization
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      {predefinedRoles.map((role) => (
                        <option key={role} value={role} className="bg-slate-950 text-white">
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {targetRole === 'Other / Custom Track' && (
                    <input
                      type="text"
                      placeholder="Specify custom role (e.g. Quantum Algorithms Engineer)"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      className="w-full mt-2 px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  )}
                </div>
              )}

              {/* Remember Credentials Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-sky-500 focus:ring-sky-500"
                  />
                  <span>Remember login on this device</span>
                </label>
                <span className="text-[11px] font-mono text-emerald-400">
                  Auto-sync active
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In & Enter World' : 'Create Career Twin & Enter'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo & Guest Shortcuts */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
              <button
                type="button"
                onClick={handleGuestEntry}
                disabled={loading}
                className="w-full py-2 bg-transparent hover:bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/60 rounded-xl text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Continue as Temporary Guest</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-900 z-10">
        <div>
          Ascendra Career Operating System · Persistent Identity
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Saved Accounts</span>
          <span>·</span>
          <span>Proof-of-Work Portfolios</span>
          <span>·</span>
          <span>Zero Data Loss</span>
        </div>
      </footer>
    </div>
  );
}
