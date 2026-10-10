import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Lock, CheckCircle2, Flame, Award, ChevronRight, Zap } from 'lucide-react';
import type { RoadmapNode } from '../types/career';

interface SkillNodeProps {
  data: {
    node: RoadmapNode;
    onOpenQuest: (node: RoadmapNode) => void;
    onMarkKnown: (node: RoadmapNode) => void;
  };
}

export const SkillNode = memo(({ data }: SkillNodeProps) => {
  const { node, onOpenQuest, onMarkKnown } = data;

  const isCompleted = node.status === 'completed';
  const isAvailable = node.status === 'available';
  const isActive = node.status === 'active';
  const isLocked = node.status === 'locked';
  const isBoss = node.category === 'boss_battle';

  const categoryLabels: Record<string, string> = {
    skill: 'Skill Discipline',
    project: 'Practical Build',
    assessment: 'Diagnostic Rigor',
    milestone: 'Milestone Gate',
    boss_battle: 'Apex Boss Battle',
  };

  return (
    <div
      className={`relative w-72 rounded-xl transition-all duration-200 select-none ${
        isBoss
          ? 'p-4 bg-gradient-to-b from-amber-950/80 to-slate-900/90 border-2 border-amber-500 shadow-lg shadow-amber-500/20'
          : isCompleted
          ? 'p-3.5 bg-slate-900/90 border border-emerald-500/60 shadow-md shadow-emerald-950/40'
          : isAvailable
          ? 'p-3.5 bg-slate-900/95 border border-sky-400/80 shadow-md shadow-sky-500/20 hover:border-sky-300'
          : isActive
          ? 'p-3.5 bg-slate-900/95 border border-amber-400 shadow-md shadow-amber-500/20'
          : 'p-3.5 bg-slate-950/80 border border-slate-800 opacity-65'
      }`}
    >
      {/* Target input handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-slate-400"
      />

      {/* Top Header: Category & Tier */}
      <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium tracking-tight">
        <span
          className={
            isBoss
              ? 'text-amber-400 font-bold uppercase tracking-wider'
              : isCompleted
              ? 'text-emerald-400'
              : isAvailable
              ? 'text-sky-400'
              : 'text-slate-400'
          }
        >
          {categoryLabels[node.category] || node.category}
        </span>
        <span className="text-slate-400 tabular-nums">
          Tier {node.tier} · {node.estimatedHours}h est.
        </span>
      </div>

      {/* Title */}
      <div className="mb-1">
        <h4
          className={`text-sm font-semibold leading-snug line-clamp-2 ${
            isBoss
              ? 'text-amber-200 text-base font-display font-bold'
              : isCompleted
              ? 'text-slate-200'
              : isAvailable
              ? 'text-white'
              : 'text-slate-400'
          }`}
        >
          {node.title}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
          {node.subtitle}
        </p>
      </div>

      {/* Status Bar / Metadata */}
      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5">
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </span>
          )}
          {isAvailable && (
            <span className="inline-flex items-center gap-1 text-sky-400 font-medium text-[11px]">
              <Flame className="w-3.5 h-3.5" />
              Ready to Forge
            </span>
          )}
          {isActive && (
            <span className="inline-flex items-center gap-1 text-amber-400 font-medium text-[11px]">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              In Progress
            </span>
          )}
          {isLocked && (
            <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
              <Lock className="w-3 h-3" />
              {node.prerequisites.length} Prereq{node.prerequisites.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 font-mono text-[11px] text-amber-300 font-semibold tabular-nums">
          <Award className="w-3 h-3 text-amber-400" />
          +{node.quest.xpReward} XP
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1.5">
        <button
          onClick={() => onOpenQuest(node)}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
            isCompleted
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              : isAvailable || isActive
              ? isBoss
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-sm'
              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400'
          }`}
        >
          {isCompleted ? 'Review Deliverable' : isBoss ? 'Challenge Boss' : 'Open Quest'}
          <ChevronRight className="w-3 h-3" />
        </button>

        {/* Quick Fast-Track Action (Adaptive Engine feature) */}
        {!isCompleted && !isBoss && (
          <button
            onClick={() => onMarkKnown(node)}
            title="Mark as already known (prior experience) to fast-track"
            className="py-1.5 px-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded text-[11px] font-medium transition-colors"
          >
            I Know This
          </button>
        )}
      </div>

      {/* Source output handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-700 !border-2 !border-slate-400"
      />
    </div>
  );
});

SkillNode.displayName = 'SkillNode';
