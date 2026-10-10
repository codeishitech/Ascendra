import { useState } from 'react';
import {
  ShieldCheck,
  FolderGit2,
  ExternalLink,
  Plus,
  CheckCircle2,
  Award,
  Filter,
  FileText,
  Copy,
  Check,
  Share2,
  Sparkles,
  Zap,
  Target,
  Clock,
  User as UserIcon,
  Trash2,
} from 'lucide-react';
import type { InventoryItem, CareerDNA, User } from '../types/career';
import { api } from '../services/api';

interface CareerPassportViewProps {
  inventory: InventoryItem[];
  profile: CareerDNA;
  currentUser: User | null;
  onItemAdded: (item: InventoryItem) => void;
  onEditProfile: () => void;
  onOpenAuth: () => void;
}

export function CareerPassportView({
  inventory,
  profile,
  currentUser,
  onItemAdded,
  onEditProfile,
  onOpenAuth,
}: CareerPassportViewProps) {
  const [filter, setFilter] = useState<'all' | 'project_evidence' | 'assessed' | 'self_reported'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // New item form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Capstone Project');
  const [verification, setVerification] = useState<'project_evidence' | 'assessed' | 'self_reported'>('project_evidence');
  const [artifactUrl, setArtifactUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [deliverableType, setDeliverableType] = useState('github_repo');

  const filteredItems = inventory.filter((item) => {
    if (filter === 'all') return true;
    return item.verification === filter;
  });

  const verifiedCount = inventory.filter((i) => i.verification === 'project_evidence').length;
  const assessedCount = inventory.filter((i) => i.verification === 'assessed').length;
  const selfReportedCount = inventory.filter((i) => i.verification === 'self_reported').length;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      let finalUrl = artifactUrl.trim() || 'https://github.com/developer/project-artifact';
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = `https://${finalUrl}`;
      }

      const newItem = await api.addInventoryItem({
        title,
        category,
        verification,
        artifactUrl: finalUrl,
        notes: notes.trim() || 'Verified deliverable artifact.',
        deliverableType,
        xpEarned: verification === 'project_evidence' ? 400 : 200,
      });
      onItemAdded(newItem);
      setShowAddModal(false);
      setTitle('');
      setArtifactUrl('');
      setNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  const copyPassportText = () => {
    const text = `ASCENDRA VERIFIED CAREER PASSPORT
Candidate: ${currentUser?.name || 'Engineer'} (${profile.title})
Target Role: ${profile.targetRole}
Competence Level: Level ${profile.level} · Total Career XP: ${profile.xp}
Verification Ledger: ${verifiedCount} Project-Verified | ${assessedCount} Assessed Diagnostics

PROOF ARTIFACTS:
${inventory
  .map(
    (item, idx) =>
      `${idx + 1}. ${item.title} [${item.verification.toUpperCase()}]
   Artifact: ${item.artifactUrl}
   Notes: ${item.notes}`
  )
  .join('\n\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Executive Summary Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Verified Career Passport & Competence Ledger
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Evidence-Based Portfolio for {currentUser?.name || profile.targetRole}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real competence is demonstrated through reproducible benchmarks, public repositories, and diagnostic scores—ready to export for recruiters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            Export Passport
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Proof Link
          </button>
        </div>
      </div>

      {/* Career Twin Identity & Grounded Skills Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Identity Card */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider mb-2">
              <UserIcon className="w-4 h-4" />
              Career Twin Profile
            </div>

            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-sky-400/80 shadow-md shrink-0 bg-slate-950">
                <img
                  src="/src/assets/images/avatar_career_twin_1791608601452.jpg"
                  alt="Career Twin Avatar"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="text-base font-bold text-white font-display">{profile.title}</div>
                <div className="text-xs text-slate-400 font-mono">Level {profile.level} · {profile.xp} XP</div>
                <div className="text-[11px] text-amber-300 font-semibold">{profile.weeklyHours}h weekly pacing</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Target role: <strong className="text-white">{profile.targetRole}</strong>. Route is tailored to weekly time constraints and verified evidence.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              {verifiedCount} Verified · {assessedCount} Assessed
            </span>
            <button
              onClick={onEditProfile}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              <span>Edit DNA</span>
              <Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Skill Grounding Breakdown */}
        <div className="lg:col-span-2 p-5 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
              Career DNA Grounded Skill Matrix
            </div>
            <span className="text-[11px] text-slate-400">
              {profile.currentSkills.length} skills in profile
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {profile.currentSkills.map((sk) => (
              <div
                key={sk.id}
                className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{sk.name}</div>
                  <div className="text-[11px] text-slate-400">{sk.category}</div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold ${
                    sk.verification === 'project_evidence'
                      ? 'text-emerald-400'
                      : sk.verification === 'assessed'
                      ? 'text-sky-400'
                      : 'text-amber-400'
                  }`}
                >
                  ● {sk.verification.toUpperCase().replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Level Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/80 border border-emerald-500/30 rounded-xl">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-mono font-bold uppercase mb-1">
            <span>Project-Verified</span>
            <span className="text-base tabular-nums font-display">{verifiedCount}</span>
          </div>
          <p className="text-xs text-slate-400">
            Backed by public GitHub repos, live deployments, or benchmark reports. Highest hiring trust.
          </p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-sky-500/30 rounded-xl">
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono font-bold uppercase mb-1">
            <span>Diagnostic Assessed</span>
            <span className="text-base tabular-nums font-display">{assessedCount}</span>
          </div>
          <p className="text-xs text-slate-400">
            Validated through interactive challenge evaluations and peer scoring rubrics.
          </p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-amber-500/30 rounded-xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-bold uppercase mb-1">
            <span>Self-Reported</span>
            <span className="text-base tabular-nums font-display">{selfReportedCount}</span>
          </div>
          <p className="text-xs text-slate-400">
            Fast-tracked prior knowledge awaiting future capstone or boss battle confirmation.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Evidence ({inventory.length})
          </button>
          <button
            onClick={() => setFilter('project_evidence')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filter === 'project_evidence'
                ? 'bg-emerald-950 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Project Evidence ({verifiedCount})
          </button>
          <button
            onClick={() => setFilter('assessed')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filter === 'assessed'
                ? 'bg-sky-950 text-sky-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Assessed ({assessedCount})
          </button>
          <button
            onClick={() => setFilter('self_reported')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filter === 'self_reported'
                ? 'bg-amber-950 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Self-Reported ({selfReportedCount})
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredItems.length} artifact{filteredItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Inventory Item Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span
                  className={`font-mono font-semibold text-[11px] ${
                    item.verification === 'project_evidence'
                      ? 'text-emerald-400'
                      : item.verification === 'assessed'
                      ? 'text-sky-400'
                      : 'text-amber-400'
                  }`}
                >
                  ● {item.verification.toUpperCase().replace('_', ' ')}
                </span>
                <span className="text-slate-400 text-[11px] tabular-nums">{item.dateAdded}</span>
              </div>

              <h4 className="text-base font-bold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                {item.notes}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 font-mono text-amber-400 font-semibold tabular-nums">
                <Award className="w-3.5 h-3.5" /> +{item.xpEarned} XP
              </div>

              {item.artifactUrl && item.artifactUrl.startsWith('http') ? (
                <a
                  href={item.artifactUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium hover:underline text-xs"
                >
                  Inspect Deliverable <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400 text-xs italic">{item.artifactUrl || 'Self-Validated'}</span>
              )}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
            No evidence artifacts in this category yet. Complete quests in the Career World to earn verified portfolio artifacts!
          </div>
        )}
      </div>

      {/* Add External Evidence Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-white font-display mb-1">
              Add External Proof of Competence
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add an external project repo, benchmark report, or diagnostic assessment result to your ledger.
            </p>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed KV Store with Raft Consensus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Verification Type
                  </label>
                  <select
                    value={verification}
                    onChange={(e) => setVerification(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="project_evidence">Project Evidence</option>
                    <option value="assessed">Assessed Score</option>
                    <option value="self_reported">Self-Reported</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Artifact Link (GitHub, Demo, Paper)
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/... or project link"
                  value={artifactUrl}
                  onChange={(e) => setArtifactUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Engineering Notes
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="What was built, metrics achieved, and architecture highlights..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold"
                >
                  Record into Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Career Passport Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Ascendra Career Passport
                </h3>
                <p className="text-xs text-slate-400">
                  Verified proof of competence ready for recruiters and engineering managers
                </p>
              </div>
              <button
                onClick={copyPassportText}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-2 max-h-80 overflow-y-auto">
              <div className="text-amber-400 font-bold">
                CANDIDATE SPECIALIZATION: {profile.targetRole}
              </div>
              <div className="text-slate-400">
                Level {profile.level} · {profile.title} · {profile.xp} XP
              </div>
              <div className="text-emerald-400 font-semibold pt-2">
                VERIFIED DELIVERABLES ({inventory.length}):
              </div>
              {inventory.map((item, i) => (
                <div key={item.id} className="pt-1 border-t border-slate-800/80 text-[11px]">
                  <div>{i + 1}. {item.title} ({item.verification})</div>
                  <div className="text-sky-400">{item.artifactUrl}</div>
                  <div className="text-slate-400">{item.notes}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
