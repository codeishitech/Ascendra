import { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Swords,
  ShieldAlert,
  Trophy,
  CheckCircle2,
  ExternalLink,
  Flame,
  Award,
  Lock,
  ChevronRight,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { BossBattle, BossPhase, CareerDNA } from '../types/career';
import { api } from '../services/api';
import bossBattleImg from '../assets/images/boss_battle_neural_core_1791608591104.jpg';

interface BossBattleArenaProps {
  boss: BossBattle;
  profile: CareerDNA;
  onBossUpdated: (updatedBoss: BossBattle, updatedProfile: CareerDNA) => void;
}

export function BossBattleArena({ boss, profile, onBossUpdated }: BossBattleArenaProps) {
  const [activePhase, setActivePhase] = useState<BossPhase | null>(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [demoBypass, setDemoBypass] = useState(false);

  const isDefeated = boss.status === 'defeated' || boss.hpCurrent === 0;
  const isLocked = boss.status === 'locked' && !demoBypass;
  const hpPercent = Math.round((boss.hpCurrent / boss.hpTotal) * 100);

  const handleOpenStrike = (phase: BossPhase) => {
    if (phase.completed) return;
    setActivePhase(phase);
    setEvidenceUrl(`https://github.com/developer/${boss.codename.toLowerCase()}-${phase.id}`);
    setNotes(`Completed ${phase.deliverable} with automated test suite and verified throughput.`);
  };

  const handleExecuteStrike = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePhase) return;

    let finalUrl = evidenceUrl.trim();
    if (!finalUrl) {
      finalUrl = `https://github.com/developer/${boss.codename.toLowerCase()}-${activePhase.id}`;
    } else if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    try {
      setSubmitting(true);
      const res = await api.strikeBoss({
        bossId: boss.id,
        phaseId: activePhase.id,
        evidenceUrl: finalUrl,
        notes: notes.trim() || 'Verified milestone deliverable.',
      });

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#ef4444', '#38bdf8'],
        });
      } catch (err) {}

      onBossUpdated(res.boss, res.profile);
      setActivePhase(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Boss Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-slate-950 shadow-2xl">
        <div className="relative h-72 md:h-80 w-full overflow-hidden">
          <img
            src={bossBattleImg}
            alt="Boss Battle Neural Core"
            className="w-full h-full object-cover object-center filter brightness-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          {/* Overlay Content */}
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-widest">
              <Swords className="w-4 h-4" />
              <span>Career Capstone Boss Battle</span>
              <span>·</span>
              <span className="text-slate-300">{boss.codename}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display text-balance">
              {boss.title}
            </h2>

            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              {boss.description}
            </p>

            {/* Boss HP Bar */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 max-w-xl">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5 font-bold">
                <span className="text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Boss Integrity (HP)
                </span>
                <span className="text-white tabular-nums">
                  {boss.hpCurrent} / {boss.hpTotal} HP ({hpPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isDefeated
                      ? 'bg-emerald-500'
                      : hpPercent < 40
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  }`}
                  style={{ width: `${hpPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Callout Strip */}
        <div className="px-6 py-3 bg-slate-900/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Battle Status:</span>
            {isDefeated ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Trophy className="w-4 h-4" /> DEFEATED & HARVESTED
              </span>
            ) : isLocked ? (
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Lock className="w-4 h-4 text-slate-500" /> Locked (Prerequisites required)
                </span>
                <button
                  type="button"
                  onClick={() => setDemoBypass(true)}
                  className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-mono font-bold transition-colors"
                >
                  ⚡ Unlock for Demo / Review
                </button>
              </div>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" /> ARENA ENGAGED — READY TO STRIKE
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-amber-300 font-semibold tabular-nums">
            <Award className="w-4 h-4 text-amber-400" />
            Victory Reward: +{boss.xpReward} XP & Career Passport Artifact
          </div>
        </div>
      </div>

      {/* Required Competencies Grid */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
          Prerequisite Skill Matrix Required for Victory
        </h4>
        <div className="flex flex-wrap gap-2">
          {boss.requiredSkills.map((sk, i) => (
            <div
              key={i}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-medium flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              {sk}
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Phase Deliverable Road */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white font-display tracking-tight flex items-center gap-2">
          <span>Boss Phases & Practical Deliverables</span>
          <span className="text-xs font-mono font-normal text-slate-400">
            ({boss.phases.filter((p) => p.completed).length}/{boss.phases.length} Phases Cleared)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boss.phases.map((phase, idx) => (
            <div
              key={phase.id}
              className={`p-4 rounded-xl border transition-all ${
                phase.completed
                  ? 'bg-slate-950/80 border-emerald-500/50 shadow-md shadow-emerald-950/30'
                  : isLocked
                  ? 'bg-slate-950/40 border-slate-800/80 opacity-60'
                  : 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400 shadow-md shadow-amber-950/20'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className={phase.completed ? 'text-emerald-400' : 'text-amber-400'}>
                  PHASE 0{idx + 1}
                </span>
                <span className="font-semibold text-amber-300 font-mono tabular-nums">
                  +{phase.xp} XP
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{phase.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {phase.deliverable}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                {phase.completed ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Phase Conquered
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenStrike(phase)}
                    disabled={isLocked}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      isLocked
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                    }`}
                  >
                    Strike Phase Deliverable
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strike Modal */}
      {activePhase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <h3 className="text-base font-bold text-white font-display mb-1">
              Submit Phase Deliverable: {activePhase.title}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Deliverable Target: {activePhase.deliverable}
            </p>

            <form onSubmit={handleExecuteStrike} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Deliverable Artifact URL (GitHub, Demo, or Benchmark Doc)
                </label>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Technical Architecture Notes & Findings
                </label>
                <textarea
                  rows={3}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain architecture decisions, performance benchmarks, and challenges resolved..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePhase(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Flame className="w-3.5 h-3.5" />}
                  {submitting ? 'Executing Strike...' : `Execute Strike (+${activePhase.xp} XP)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
