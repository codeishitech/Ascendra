import { useState } from 'react';
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
} from 'lucide-react';
import { api } from '../services/api';
import type { User, CareerDNA, CareerWorldData } from '../types/career';
import avatarCareerTwin from '../assets/images/avatar_career_twin_1791608601452.jpg';

interface LoginPageProps {
  onAuthSuccess: (user: User, profile: CareerDNA, roadmap: CareerWorldData) => void;
}

export function LoginPage({ onAuthSuccess }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('AI Research Engineer');
  const [customRole, setCustomRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predefinedRoles = [
    'AI Research Engineer',
    'Autonomous Systems & Robotics Lead',
    'Distributed Systems Architect',
    'Cloud Infrastructure & MLOps Lead',
    'Cyber Threat Defense & Systems',
    'Full-Stack WebAssembly Architect',
    'Other / Custom Track',
  ];

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

        const effectiveRole = targetRole === 'Other / Custom Track' && customRole.trim()
          ? customRole.trim()
          : targetRole;

        const res = await api.signup({
          name: name.trim(),
          email: email.trim(),
          password,
          targetRole: effectiveRole,
        });
        onAuthSuccess(res.user, res.profile, res.roadmap);
      } else {
        if (!email.trim() || !password) {
          throw new Error('Please enter your email and password');
        }
        const res = await api.login({
          email: email.trim(),
          password,
        });
        onAuthSuccess(res.user, res.profile, res.roadmap);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Showcase Login
  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.login({
        email: 'alex@ascendra.dev',
        password: 'demo1234',
      });
      onAuthSuccess(res.user, res.profile, res.roadmap);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize demo session.');
    } finally {
      setLoading(false);
    }
  };

  // Fast Guest Explorer Entry
  const handleGuestEntry = async () => {
    setError(null);
    setLoading(true);
    try {
      // Create guest session
      const guestId = `guest_${Date.now()}`;
      const guestUser: User = {
        id: guestId,
        name: 'Guest Explorer',
        email: 'guest@ascendra.dev',
        targetRole: 'AI Research Engineer',
        createdAt: new Date().toISOString(),
      };
      const res = await api.signup({
        name: guestUser.name,
        email: `guest_${Date.now()}@ascendra.dev`,
        password: 'guest-session',
        targetRole: 'AI Research Engineer',
      });
      onAuthSuccess(res.user, res.profile, res.roadmap);
    } catch (err: any) {
      // Fallback: login to demo if signup guest hits conflict
      handleDemoLogin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

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

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="text-xs font-mono text-slate-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Demo Access</span>
        </button>
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

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white font-display">
                {mode === 'login' ? 'Welcome back, Engineer' : 'Initialize Your Career Twin'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'login'
                  ? 'Access your saved skill tree, artifact proofs, and mentor sessions.'
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
                    onChange={(e) => setEmail(e.target.value)}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Verifying Credentials...</span>
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
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5">
              <div className="text-[11px] font-mono text-center text-slate-500 uppercase tracking-wider">
                Instant Access Options
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Demo Showcase (Alex Vance · Lvl 4)</span>
              </button>

              <button
                type="button"
                onClick={handleGuestEntry}
                disabled={loading}
                className="w-full py-2 bg-transparent hover:bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/60 rounded-xl text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Continue as Fresh Guest (Lvl 1 Initiate)</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-900 z-10">
        <div>
          Ascendra Career Operating System · Offline & Cloud Resilient
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Non-linear Skill Trees</span>
          <span>·</span>
          <span>Proof-of-Work Portfolios</span>
          <span>·</span>
          <span>Zero Slop</span>
        </div>
      </footer>
    </div>
  );
}
