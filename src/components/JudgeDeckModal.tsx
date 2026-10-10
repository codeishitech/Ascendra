import { X, Trophy, Sparkles, Target, ShieldCheck, Flame, Cpu, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface JudgeDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStep: (stepNumber: number) => void;
}

export function JudgeDeckModal({ isOpen, onClose, onSelectStep }: JudgeDeckModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Ascendra — Hackathon Pitch & Judge Overview
              </h2>
              <p className="text-xs text-slate-400">
                Forge your skills. Unlock your future. · 3-Minute Demo Cheat Sheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-xs text-slate-300">
          {/* Executive Summary */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
              1. Problem & Core Value Proposition
            </h3>
            <p className="text-slate-200 leading-relaxed">
              <strong>The Problem:</strong> Career advice for technology students is broad, ungrounded, and difficult to act on. Telling a student to “learn AI” or “build projects” doesn't teach <em>which</em> skills matter, what order to tackle them in, or how to demonstrate hiring-grade proof.
            </p>
            <p className="text-slate-200 leading-relaxed">
              <strong>The Ascendra Solution:</strong> Transforms a student's dream tech role into a living, personalized RPG-style career world. Combines <strong>Living Career DNA</strong>, <strong>branching skill trees</strong>, <strong>AI quests with rubrics</strong>, <strong>adaptive prerequisite replanning</strong>, and <strong>industry mentor advisory</strong>.
            </p>
          </div>

          {/* Key Differentiators Matrix */}
          <div>
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2.5">
              2. What Makes Ascendra Different
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
                <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-sky-400" /> Living Career DNA
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Reflects the student's real skills, verified artifacts, weekly study time, and goals. Distinguishes self-reported claims from assessed and project-verified proof.
                </p>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
                <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-400" /> AI Quest Engine
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Converts milestones into concrete challenges with step-by-step instructions, tangible deliverables (repos, reports), and multi-criteria rubrics.
                </p>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
                <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Adaptive Career Engine
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Deterministic graph logic re-calculates eligibility when skills are fast-tracked or goals change, while Gemini explains the tactical adjustment.
                </p>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
                <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Career Passport & Mentors
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Evidence ledger exportable for recruiters, with direct messaging to industry staff engineers at DeepMind, Netflix, and Stripe with code advisory.
                </p>
              </div>
            </div>
          </div>

          {/* 3-Minute Demo Script */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Recommended 3-Minute Judge Demo Script
              </h3>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => {
                  onSelectStep(1);
                  onClose();
                }}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-lg cursor-pointer transition-colors flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="font-mono text-sky-400 font-bold">0:00–0:30 · Career DNA Calibration</div>
                  <div className="text-slate-300 mt-0.5">Show target career role selection, weekly hours budget, and verified vs self-reported skills.</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 shrink-0 mt-1" />
              </div>

              <div
                onClick={() => {
                  onSelectStep(2);
                  onClose();
                }}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-lg cursor-pointer transition-colors flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="font-mono text-sky-400 font-bold">0:30–1:15 · Career World & AI Quest Engine</div>
                  <div className="text-slate-300 mt-0.5">Explore the interactive branching tree. Open a node to show concrete deliverable & grading rubric.</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 shrink-0 mt-1" />
              </div>

              <div
                onClick={() => {
                  onSelectStep(3);
                  onClose();
                }}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-lg cursor-pointer transition-colors flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="font-mono text-sky-400 font-bold">1:15–2:00 · Adaptive Fast-Track Demonstration</div>
                  <div className="text-slate-300 mt-0.5">Click "I Know This" on a prerequisite node to trigger real-time graph recalculation and Gemini career advice!</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 shrink-0 mt-1" />
              </div>

              <div
                onClick={() => {
                  onSelectStep(4);
                  onClose();
                }}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-lg cursor-pointer transition-colors flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="font-mono text-sky-400 font-bold">2:00–2:40 · Capstone Boss Battle</div>
                  <div className="text-slate-300 mt-0.5">Show multi-skill integration challenge (Titan Neural Core) with HP bar and multi-phase deliverables.</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 shrink-0 mt-1" />
              </div>

              <div
                onClick={() => {
                  onSelectStep(5);
                  onClose();
                }}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-lg cursor-pointer transition-colors flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="font-mono text-sky-400 font-bold">2:40–3:00 · Verified Passport & Mentor Advisory</div>
                  <div className="text-slate-300 mt-0.5">Showcase recruiter-ready Career Passport with verified links, and live code review chat with industry mentors.</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 shrink-0 mt-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Backend: Node/Express + SQLite & Python FastAPI</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs transition-colors"
          >
            Close Cheat Sheet
          </button>
        </div>
      </div>
    </div>
  );
}
