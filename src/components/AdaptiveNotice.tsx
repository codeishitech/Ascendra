import { Sparkles, ArrowRight, X } from 'lucide-react';
import type { AdaptiveChangeLog } from '../types/career';

interface AdaptiveNoticeProps {
  notice: AdaptiveChangeLog;
  onDismiss: () => void;
}

export function AdaptiveNotice({ notice, onDismiss }: AdaptiveNoticeProps) {
  return (
    <div className="relative p-4 bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-500/40 rounded-2xl shadow-xl flex items-start justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider mb-0.5">
            <span>Adaptive Career Engine Update</span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400 font-normal">
              {notice.unlockedCount} Downstream Path{notice.unlockedCount !== 1 ? 's' : ''} Unlocked
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {notice.reason}
          </p>
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
