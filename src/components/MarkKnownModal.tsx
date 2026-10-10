import { useState } from 'react';
import { X, Check, FastForward, Loader2, Sparkles } from 'lucide-react';
import type { RoadmapNode } from '../types/career';

interface MarkKnownModalProps {
  node: RoadmapNode;
  onClose: () => void;
  onConfirm: (nodeId: string, reason: string) => Promise<void>;
}

export function MarkKnownModal({ node, onClose, onConfirm }: MarkKnownModalProps) {
  const [reason, setReason] = useState('Demonstrated in prior academic coursework or production project.');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onConfirm(node.id, reason);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FastForward className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Fast-Track: {node.title}
              </h3>
              <p className="text-xs text-slate-400">
                Adaptive Career Engine · Skill Acceleration
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

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Marking this skill as already mastered will satisfy it as a prerequisite for all advanced downstream nodes. The Adaptive Career Engine will re-calculate eligibility and preserve your previous progress.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Prior Experience / Validation Note
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Mastered during undergraduate Machine Learning course and built PyTorch project..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg flex items-start gap-2 text-xs text-amber-200/90">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              You will receive baseline XP (+{Math.round(node.quest.xpReward * 0.5)} XP) and an item in your Career Inventory marked as <strong className="text-amber-300">Self-Reported / Prior Competence</strong>.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {loading ? 'Re-calculating Roadmap...' : 'Confirm Mastery & Unlock Path'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
