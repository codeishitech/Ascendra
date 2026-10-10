import { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Target, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import type { User, CareerDNA, CareerWorldData } from '../types/career';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, profile: CareerDNA, roadmap: CareerWorldData) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('AI Research Engineer');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await api.signup({
          name,
          email,
          password,
          targetRole,
        });
        onAuthSuccess(res.user, res.profile, res.roadmap);
      } else {
        const res = await api.login({
          email,
          password,
        });
        onAuthSuccess(res.user, res.profile, res.roadmap);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setName('Alex Vance');
    setEmail('alex@ascendra.dev');
    setPassword('demo1234');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-xs">
                A
              </div>
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                Ascendra Identity Vault
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              {mode === 'signup' ? 'Create Your Career Twin' : 'Welcome Back, Engineer'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {mode === 'signup'
                ? 'Save your RPG skill tree, evidence artifacts, and boss progress.'
                : 'Access your persistent Career World and mentor dialogues.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-slate-950 rounded-lg border border-slate-800 mb-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              mode === 'signup'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              mode === 'login'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-rose-950/60 border border-rose-500/40 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="email"
                required
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Career Goal</label>
              <div className="relative">
                <Target className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="AI Research Engineer">AI Research Engineer</option>
                  <option value="Distributed Systems Architect">Distributed Systems Architect</option>
                  <option value="Cloud Infrastructure Maestro">Cloud Infrastructure Maestro</option>
                  <option value="Autonomous Systems Engineer">Autonomous Systems Engineer</option>
                  <option value="Cyber Threat Defense Engineer">Cyber Threat Defense Engineer</option>
                </select>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-sky-500/20"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-slate-950" />
              )}
              {mode === 'signup' ? 'Forge Account & Launch Career' : 'Authenticate & Enter World'}
            </button>
          </div>
        </form>

        {/* Demo Fast Account Helper */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            Evaluating the demo?{' '}
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="text-sky-400 hover:underline font-semibold"
            >
              Autofill test credentials
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
