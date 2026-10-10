import { ShieldCheck, Award, Zap, Clock, Target, Sparkles, TrendingUp } from 'lucide-react';
import type { CareerDNA } from '../types/career';

interface CareerTwinCardProps {
  profile: CareerDNA;
  onEditProfile: () => void;
}

export function CareerTwinCard({ profile, onEditProfile }: CareerTwinCardProps) {
  // XP level calculation (600 XP per level)
  const currentLevelBaseXP = (profile.level - 1) * 600;
  const nextLevelXP = profile.level * 600;
  const levelProgressXP = profile.xp - currentLevelBaseXP;
  const levelProgressPercent = Math.min(
    100,
    Math.max(0, Math.round((levelProgressXP / 600) * 100))
  );

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Left Avatar + Core Identity */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-sky-400/80 shadow-lg shadow-sky-500/20 shrink-0 bg-slate-950">
          <img
            src="/src/assets/images/avatar_career_twin_1791608601452.jpg"
            alt="Career Twin Avatar"
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs py-0.5 text-center text-[10px] font-mono text-sky-300 font-bold">
            LVL {profile.level}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
              Career Twin Profile
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs font-mono text-amber-300 font-semibold">
              {profile.title}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight">
            Target: {profile.targetRole}
          </h3>

          {/* Personalization Criteria Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {profile.specializationSubTrack && (
              <span className="px-2 py-0.5 bg-sky-950/80 border border-sky-500/40 rounded text-[10px] font-mono font-bold text-sky-300">
                Track: {profile.specializationSubTrack}
              </span>
            )}
            {profile.timelineMonths && (
              <span className="px-2 py-0.5 bg-indigo-950/80 border border-indigo-500/40 rounded text-[10px] font-mono text-indigo-300">
                {profile.timelineMonths}mo Horizon
              </span>
            )}
            {profile.targetCompanyTier && (
              <span className="px-2 py-0.5 bg-amber-950/80 border border-amber-500/40 rounded text-[10px] font-mono text-amber-300">
                {profile.targetCompanyTier === 'tier1_bigtech' ? 'FAANG / Tier 1' : profile.targetCompanyTier.replace('_', ' ')}
              </span>
            )}
            {profile.learningStyle && (
              <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 rounded text-[10px] font-mono text-emerald-300">
                {profile.learningStyle.replace('_', ' ')}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-2 max-w-md line-clamp-2 leading-relaxed">
            {profile.targetRoleDescription ||
              'Adaptive learning route configured to maximize portfolio impact and technical rigor.'}
          </p>

          {/* XP Progress Bar */}
          <div className="mt-3 max-w-sm">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-slate-300">
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <Zap className="w-3 h-3 text-amber-400" /> {profile.xp} Total XP
              </span>
              <span className="text-slate-400 tabular-nums">
                {levelProgressXP} / 600 to Level {profile.level + 1}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${levelProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Stats & Calibration CTA */}
      <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center min-w-[100px]">
            <div className="text-emerald-400 font-bold text-base tabular-nums font-display">
              {profile.competenciesVerifiedCount}
            </div>
            <div className="text-[10px] text-slate-400 uppercase mt-0.5">
              Verified Proofs
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center min-w-[100px]">
            <div className="text-amber-400 font-bold text-base tabular-nums font-display">
              {profile.weeklyHours}h
            </div>
            <div className="text-[10px] text-slate-400 uppercase mt-0.5">
              Weekly Pacing
            </div>
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className="w-full md:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          Re-calibrate Career DNA
        </button>
      </div>
    </div>
  );
}
