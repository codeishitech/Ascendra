import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Clock,
  Award,
  ChevronRight,
  Flame,
  Zap,
  Filter,
} from 'lucide-react';
import type { RoadmapNode } from '../types/career';

interface QuestLogViewProps {
  nodes: RoadmapNode[];
  onOpenQuest: (node: RoadmapNode) => void;
  onMarkKnown: (node: RoadmapNode) => void;
}

export function QuestLogView({ nodes, onOpenQuest, onMarkKnown }: QuestLogViewProps) {
  const [filter, setFilter] = useState<'all' | 'available' | 'completed' | 'locked'>('all');

  const filteredNodes = nodes.filter((node) => {
    if (filter === 'all') return true;
    if (filter === 'available') return node.status === 'available' || node.status === 'active';
    return node.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            Tactical Quest Log
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Active Challenges & Deliverable Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            All career milestones converted into practical engineering tasks with concrete definitions of done.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Quests ({nodes.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'available'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Available ({nodes.filter((n) => n.status === 'available' || n.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'completed'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed ({nodes.filter((n) => n.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'locked'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Locked ({nodes.filter((n) => n.status === 'locked').length})
          </button>
        </div>
      </div>

      {/* Quest Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNodes.map((node) => {
          const isCompleted = node.status === 'completed';
          const isAvailable = node.status === 'available';
          const isActive = node.status === 'active';
          const isLocked = node.status === 'locked';
          const isBoss = node.category === 'boss_battle';

          return (
            <div
              key={node.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                isBoss
                  ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/50 shadow-lg shadow-amber-950/30'
                  : isCompleted
                  ? 'bg-slate-900/80 border-emerald-500/40'
                  : isAvailable
                  ? 'bg-slate-900/90 border-sky-500/50 hover:border-sky-400 shadow-md shadow-sky-950/20'
                  : isActive
                  ? 'bg-slate-900/90 border-amber-400 shadow-md shadow-amber-950/20'
                  : 'bg-slate-950/50 border-slate-800/80 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        isBoss
                          ? 'text-amber-400'
                          : isCompleted
                          ? 'text-emerald-400'
                          : isAvailable
                          ? 'text-sky-400'
                          : 'text-slate-400'
                      }`}
                    >
                      TIER {node.tier} · {node.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {node.estimatedHours}h
                    </span>
                  </div>

                  <div className="font-mono text-amber-300 font-semibold text-xs tabular-nums flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> +{node.quest.xpReward} XP
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{node.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-1 mb-2.5">{node.subtitle}</p>

                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs mb-4">
                  <div className="text-[11px] font-mono text-sky-400 font-semibold mb-0.5 uppercase">
                    Deliverable:
                  </div>
                  <div className="text-slate-200 line-clamp-2 leading-relaxed">
                    {node.quest.tangibleDeliverable}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  {isCompleted && (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Cleared
                    </span>
                  )}
                  {isAvailable && (
                    <span className="text-sky-400 font-medium flex items-center gap-1">
                      <Flame className="w-4 h-4" /> Ready to Forge
                    </span>
                  )}
                  {isActive && (
                    <span className="text-amber-400 font-medium flex items-center gap-1">
                      <Zap className="w-4 h-4" /> In Progress
                    </span>
                  )}
                  {isLocked && (
                    <span className="text-slate-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Requires {node.prerequisites.length} Prereqs
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isCompleted && !isBoss && (
                    <button
                      onClick={() => onMarkKnown(node)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                    >
                      I Know This
                    </button>
                  )}
                  <button
                    onClick={() => onOpenQuest(node)}
                    className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        : isBoss
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                        : 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold'
                    }`}
                  >
                    {isCompleted ? 'Inspect' : 'Open Quest'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
