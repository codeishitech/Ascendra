import { useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import { SkillNode } from './SkillNode';
import type { RoadmapNode, RoadmapEdge } from '../types/career';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  Flame,
  Award,
  Clock,
  Lock,
  ChevronRight,
  Zap,
  LayoutGrid,
  GitBranch,
} from 'lucide-react';

interface CareerWorldGraphProps {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  onOpenQuest: (node: RoadmapNode) => void;
  onMarkKnown: (node: RoadmapNode) => void;
  targetRole: string;
}

const nodeTypes = {
  skillNode: SkillNode,
};

export function CareerWorldGraph({
  nodes: initialNodes,
  edges: initialEdges,
  onOpenQuest,
  onMarkKnown,
  targetRole,
}: CareerWorldGraphProps) {
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const [filter, setFilter] = useState<'all' | 'available' | 'completed' | 'boss'>('all');

  // Transform RoadmapNode to ReactFlow Node
  const flowNodes: Node[] = useMemo(() => {
    return initialNodes.map((n) => {
      let isVisible = true;
      if (filter === 'available') {
        isVisible = n.status === 'available' || n.status === 'active';
      } else if (filter === 'completed') {
        isVisible = n.status === 'completed';
      } else if (filter === 'boss') {
        isVisible = n.category === 'boss_battle';
      }

      return {
        id: n.id,
        type: 'skillNode',
        position: n.position || { x: 100, y: 100 },
        data: {
          node: n,
          onOpenQuest,
          onMarkKnown,
        },
        hidden: !isVisible,
      };
    });
  }, [initialNodes, filter, onOpenQuest, onMarkKnown]);

  const flowEdges: Edge[] = useMemo(() => {
    const validNodeIds = new Set(initialNodes.map((n) => n.id));
    return initialEdges
      .filter((e) => validNodeIds.has(e.source) && validNodeIds.has(e.target))
      .map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: true,
        style: { stroke: '#38bdf8', strokeWidth: 2 },
      }));
  }, [initialEdges, initialNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  // Node stats for the header overview
  const totalCount = initialNodes.length;
  const completedCount = initialNodes.filter((n) => n.status === 'completed').length;
  const availableCount = initialNodes.filter((n) => n.status === 'available' || n.status === 'active').length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredListNodes = initialNodes.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'available') return n.status === 'available' || n.status === 'active';
    if (filter === 'completed') return n.status === 'completed';
    if (filter === 'boss') return n.category === 'boss_battle';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight font-display">
                {targetRole} World Map
              </h3>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-emerald-400 font-mono tabular-nums font-semibold">
                {completedCount}/{totalCount} Cleared ({progressPercent}%)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive branching skill tree. Click nodes to open quest instructions, deliverables, and rubrics.
            </p>
          </div>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'graph'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Skill Tree</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Quest Cards</span>
            </button>
          </div>

          {/* Filter controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                filter === 'available'
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Available ({availableCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                filter === 'completed'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setFilter('boss')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                filter === 'boss'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Boss
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'graph' ? (
        <div className="relative w-full h-[620px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
          {/* Visual Tier Stage Markers */}
          <div className="grid grid-cols-4 px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono tracking-wider text-slate-400 uppercase select-none z-10">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              Tier 1: Foundations
            </div>
            <div className="flex items-center gap-1.5 text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              Tier 2: Core Engineering
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Tier 3: Advanced Systems
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Tier 4: Capstone Apex
            </div>
          </div>

          {/* React Flow Canvas */}
          <div className="relative flex-1 w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.3}
              maxZoom={1.6}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#1e293b" gap={24} size={1.5} />
              <Controls position="top-right" />
              <MiniMap
                position="bottom-left"
                nodeColor={(n: any) => {
                  const nodeData = n.data?.node as RoadmapNode | undefined;
                  if (nodeData?.category === 'boss_battle') return '#f59e0b';
                  if (nodeData?.status === 'completed') return '#10b981';
                  if (nodeData?.status === 'available') return '#38bdf8';
                  return '#475569';
                }}
                maskColor="rgba(2, 6, 23, 0.75)"
                className="!rounded-lg !border !border-slate-800 !bg-slate-900"
              />
            </ReactFlow>
          </div>
        </div>
      ) : (
        /* List Mode: Tactical Quest Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredListNodes.map((node) => {
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
                    ? 'bg-slate-900/90 border-sky-500/50 hover:border-sky-400'
                    : 'bg-slate-950/50 border-slate-800/80 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
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
                    <span className="font-mono text-amber-300 text-xs font-semibold tabular-nums">
                      +{node.quest.xpReward} XP
                    </span>
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

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    {node.estimatedHours}h est. · {node.status.toUpperCase()}
                  </span>

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
      )}
    </div>
  );
}
