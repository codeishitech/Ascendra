import { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Zap,
  Target,
  Swords,
  Users,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Play,
} from 'lucide-react';

interface JudgeTourBannerProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  onOpenDeck: () => void;
  onSimulateQuestWin: () => void;
  onSimulateAdaptiveReplanning: () => void;
}

export function JudgeTourBanner({
  currentStep,
  onSelectStep,
  onOpenDeck,
  onSimulateQuestWin,
  onSimulateAdaptiveReplanning,
}: JudgeTourBannerProps) {
  const [collapsed, setCollapsed] = useState(false);

  const steps = [
    { num: 1, label: '1. DNA Profile', tab: 'world', action: () => onSelectStep(1) },
    { num: 2, label: '2. Branching Tree', tab: 'world', action: () => onSelectStep(2) },
    { num: 3, label: '3. Adaptive Engine', tab: 'world', action: () => onSelectStep(3) },
    { num: 4, label: '4. Boss Battle', tab: 'boss', action: () => onSelectStep(4) },
    { num: 5, label: '5. Mentors & Passport', tab: 'mentors', action: () => onSelectStep(5) },
  ];

  return (
    <div className="w-full bg-slate-900/90 border-b border-amber-500/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Badge & Steps */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDeck}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-amber-300 font-mono font-bold text-[11px] transition-colors shrink-0"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Judge Pitch Tour</span>
          </button>

          {!collapsed && (
            <div className="hidden sm:flex items-center gap-1.5 font-medium">
              {steps.map((st) => (
                <button
                  key={st.num}
                  onClick={st.action}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap text-[11px] ${
                    currentStep === st.num
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Live Demo Actions */}
        <div className="flex items-center gap-2">
          {!collapsed && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onSimulateQuestWin}
                title="Simulate submitting a quest deliverable and unlocking nodes with confetti"
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-md text-[11px] font-semibold transition-colors shrink-0"
              >
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Simulate Quest Win (+600 XP)</span>
              </button>

              <button
                onClick={onSimulateAdaptiveReplanning}
                title="Simulate marking a node known to demonstrate AI adaptive re-planning"
                className="flex items-center gap-1 px-2.5 py-1 bg-sky-950/80 hover:bg-sky-900 border border-sky-500/40 text-sky-300 rounded-md text-[11px] font-semibold transition-colors shrink-0"
              >
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>Test Adaptive Replanning</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors ml-1"
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
