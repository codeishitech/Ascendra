import { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Award,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileCode,
  Send,
  Loader2,
  Check,
  ShieldCheck,
  Wand2,
} from 'lucide-react';
import type { RoadmapNode } from '../types/career';
import { api } from '../services/api';

interface QuestModalProps {
  node: RoadmapNode;
  onClose: () => void;
  onQuestCompleted: (updatedNode: RoadmapNode, xpGained: number, leveledUp: boolean) => void;
}

export function QuestModal({ node, onClose, onQuestCompleted }: QuestModalProps) {
  const quest = node.quest;
  const isCompleted = node.status === 'completed';

  // Submission form state
  const [evidenceUrl, setEvidenceUrl] = useState(
    node.evidenceSubmitted?.url || `https://github.com/developer/${node.id}-deliverable`
  );
  const [notes, setNotes] = useState(
    node.evidenceSubmitted?.note || 'Implemented according to architectural specification and validated against rubric test criteria.'
  );
  const [verificationType, setVerificationType] = useState<'project_evidence' | 'assessed' | 'self_reported'>('project_evidence');
  const [rubricScores, setRubricScores] = useState<Record<string, number>>(
    node.evidenceSubmitted?.rubricScores ||
      quest.rubric.reduce((acc, r) => ({ ...acc, [r.id]: 90 }), {})
  );

  const [submitting, setSubmitting] = useState(false);
  const [aiAsking, setAiAsking] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');

  const handleRubricScoreChange = (id: string, val: number) => {
    setRubricScores((prev) => ({ ...prev, [id]: val }));
  };

  const handleAskAI = async () => {
    try {
      setAiAsking(true);
      const res = await api.getAIHint(node.id, aiQuestion);
      setAiAdvice(res.advice);
    } catch (err) {
      console.error(err);
      setAiAdvice('Ensure clean modular separation of concerns, defensive error handling, and repeatable benchmarks with variance measurements.');
    } finally {
      setAiAsking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-normalize URL
    let finalUrl = evidenceUrl.trim();
    if (!finalUrl) {
      finalUrl = `https://github.com/developer/${node.id}-deliverable`;
    } else if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    try {
      setSubmitting(true);
      const result = await api.completeQuest(node.id, {
        evidenceUrl: finalUrl,
        note: notes.trim() || 'Verified deliverable with automated test suite.',
        rubricScores,
        verificationType,
      });

      // Victory fanfare
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.55 },
          colors: ['#38bdf8', '#f59e0b', '#10b981'],
        });
      } catch (e) {}

      onQuestCompleted(result.node, result.xpGained, result.leveledUp);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
              <span>TIER {node.tier}</span>
              <span>·</span>
              <span className="uppercase">{node.category.replace('_', ' ')}</span>
              <span>·</span>
              <span className="text-slate-400 tabular-nums flex items-center gap-1">
                <Clock className="w-3 h-3" /> {node.estimatedHours} Hours Required
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">
              {node.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{node.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-amber-950/40 border border-amber-500/40 rounded-lg text-amber-300 font-mono text-xs font-bold tabular-nums">
              <Award className="w-4 h-4 text-amber-400" />
              +{quest.xpReward} XP
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm">
          {/* Objective & Brief */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
            <h3 className="text-xs font-bold font-mono text-sky-400 uppercase tracking-wider mb-1">
              Quest Objective
            </h3>
            <p className="text-slate-200 font-medium">{quest.objective}</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{quest.brief}</p>
          </div>

          {/* Actionable Steps */}
          <div>
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-2.5">
              Execution Roadmap (Definition of Done)
            </h3>
            <div className="space-y-2">
              {quest.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 text-xs leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tangible Deliverable Box */}
          <div className="p-4 bg-gradient-to-r from-sky-950/30 to-indigo-950/30 border border-sky-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-sky-300 font-semibold text-xs uppercase tracking-wider mb-1">
              <FileCode className="w-4 h-4" /> Required Deliverable Artifact
            </div>
            <p className="text-slate-200 text-sm font-medium">{quest.tangibleDeliverable}</p>
            <div className="mt-2 text-xs text-slate-400">
              Deliverable Category: <span className="font-mono text-slate-300 capitalize">{quest.deliverableType.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Completion Rubric */}
          <div>
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-2.5">
              Evaluation Rubric Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {quest.rubric.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                      <span>{r.name}</span>
                      <span className="text-sky-400 font-mono text-[11px] tabular-nums">
                        {r.weight}% Weight
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">{r.description}</p>
                  </div>

                  {/* Self assessment score selector */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Graded Score:</span>
                      <span className="font-mono text-white font-bold tabular-nums">
                        {rubricScores[r.id] ?? 90}/100
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="100"
                      step="5"
                      value={rubricScores[r.id] ?? 90}
                      onChange={(e) => handleRubricScoreChange(r.id, Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Resources & Interview Challenge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resources */}
            <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" /> Curated Resources
              </div>
              <div className="space-y-2">
                {quest.curatedResources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs text-sky-400 hover:text-sky-300 transition-colors group"
                  >
                    <span className="truncate pr-2">{res.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-sky-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            {/* Technical Interview Questions */}
            <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Technical Interview Questions
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                {quest.interviewQuestions.map((q, i) => (
                  <div key={i} className="p-2 rounded bg-slate-900/40 border border-slate-800/60">
                    <span className="font-semibold text-amber-400">Q{i + 1}: </span>
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Coach Hint Panel (Google Gemini API Powered) */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold font-mono uppercase text-slate-300">
                  Google Gemini 3.8 Flash Technical Advisor
                </span>
              </div>
              <button
                type="button"
                onClick={handleAskAI}
                disabled={aiAsking}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {aiAsking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                {aiAsking ? 'Consulting Gemini...' : 'Ask Gemini for Hints'}
              </button>
            </div>

            <input
              type="text"
              placeholder="Ask a technical architecture question (e.g., 'How do I optimize memory during inference?')..."
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />

            {aiAdvice && (
              <div className="mt-3 p-3 bg-slate-900/80 border border-amber-500/30 rounded-lg text-xs text-slate-200 leading-relaxed whitespace-pre-line animate-in fade-in">
                {aiAdvice}
              </div>
            )}
          </div>

          {/* Submission / Verification Area */}
          <form onSubmit={handleSubmit} className="p-5 bg-slate-950 border border-sky-500/30 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {isCompleted ? 'Completed Evidence Record' : 'Submit Tangible Deliverable & Claim XP'}
              </h3>
              {isCompleted && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Verified on {node.completedAt?.split('T')[0]}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Deliverable Artifact URL / Code Link
                </label>
                <button
                  type="button"
                  onClick={() => setEvidenceUrl(`https://github.com/developer/${node.id}-implementation`)}
                  className="text-[11px] text-sky-400 hover:underline"
                >
                  Prefill Demo Repo URL
                </button>
              </div>
              <input
                type="text"
                placeholder="https://github.com/your-username/quest-deliverable or local benchmark notes"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Engineering Notes & Benchmark Summary
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary of implementation choices, trade-offs, test results, and rubric compliance..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Evidence Classification Level (Career DNA)
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setVerificationType('project_evidence')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    verificationType === 'project_evidence'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ● Project Evidence (Highest Rigor)
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationType('assessed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    verificationType === 'assessed'
                      ? 'bg-sky-950/80 border-sky-500 text-sky-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ● Assessed Benchmark
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationType('self_reported')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    verificationType === 'self_reported'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ● Self-Reported
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shadow-md shadow-sky-500/20"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isCompleted ? 'Update Evidence' : `Submit & Claim +${quest.xpReward} XP`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
