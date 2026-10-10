import { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Target,
  Clock,
  Code2,
  FolderGit2,
  Loader2,
  Plus,
  Trash2,
  Wand2,
  Layers,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Building,
  Calendar,
  Zap,
  HelpCircle,
  Award,
  BookOpen,
  FileCode,
} from 'lucide-react';
import type { CareerDNA, SkillItem, StudentProject } from '../types/career';

interface CareerDNAOnboardingProps {
  initialProfile: CareerDNA;
  onClose: () => void;
  onSaveAndGenerate: (params: {
    targetRole: string;
    weeklyHours: number;
    experienceLevel: string;
    currentSkills: SkillItem[];
    currentProjects: StudentProject[];
    specializationSubTrack?: string;
    timelineMonths?: number;
    learningStyle?: string;
    preferredDeliverable?: string;
    targetCompanyTier?: string;
    masteredTopicsToSkip?: string[];
    priorityWeaknesses?: string[];
  }) => Promise<void>;
}

const PRESET_ROLES = [
  {
    role: 'AI Research Engineer',
    desc: 'Deep learning architectures, transformer models, evaluation rigor & low-latency inference pipelines.',
    subTracks: [
      'LLM Fine-Tuning & Quantization (LoRA / vLLM)',
      'Multimodal Vision-Language Architectures',
      'Reinforcement Learning & Reasoning Chains',
      'AI Systems & Inference Kernels',
    ],
    defaultSkills: [
      { name: 'Python', category: 'Programming', verification: 'project_evidence' as const, rating: 4 },
      { name: 'Linear Algebra & Calculus', category: 'Mathematics', verification: 'assessed' as const, rating: 3 },
      { name: 'PyTorch', category: 'Deep Learning', verification: 'project_evidence' as const, rating: 3 },
    ],
    skipOptions: ['Python Basics', 'Git / GitHub', 'Linear Algebra 101', 'NumPy & Pandas'],
    weaknessOptions: ['Custom CUDA Kernels', 'Distributed FSDP Training', 'Scientific pass@k Rigor', 'KV-Cache Memory Tuning'],
  },
  {
    role: 'Autonomous Systems Engineer',
    desc: 'Robotics autonomy, sensor fusion, Kalman filters, SLAM & real-time ROS 2 control loops.',
    subTracks: [
      'Sensor Fusion & State Estimation (EKF)',
      '3D LiDAR SLAM & Point-Cloud Mapping',
      'Real-Time ROS 2 C++20 Middleware',
      'Kinodynamic Path Planning & MPC',
    ],
    defaultSkills: [
      { name: 'C++20 & Modern CMake', category: 'Programming', verification: 'project_evidence' as const, rating: 4 },
      { name: 'ROS 2 Middleware', category: 'Robotics', verification: 'assessed' as const, rating: 3 },
      { name: 'Extended Kalman Filter (EKF)', category: 'Mathematics', verification: 'project_evidence' as const, rating: 3 },
    ],
    skipOptions: ['C++ Syntax Basics', 'Linux Commands', 'Linear State Space Intro'],
    weaknessOptions: ['Point-Cloud NDT/ICP Matching', 'Real-Time Thread Scheduling', 'Model Predictive Control', 'Hardware-in-the-Loop Sim'],
  },
  {
    role: 'Cyber Threat Defense Engineer',
    desc: 'Binary exploitation, kernel security, cryptosystems, threat modeling & zero-trust architectures.',
    subTracks: [
      'Binary Exploitation & Reverse Engineering',
      'Linux Kernel eBPF Telemetry Sensors',
      'Applied Cryptography & Zero-Trust',
      'Memory-Safe Rust Systems Isolation',
    ],
    defaultSkills: [
      { name: 'C & x86_64 Assembly', category: 'Systems', verification: 'project_evidence' as const, rating: 4 },
      { name: 'Reverse Engineering (Ghidra)', category: 'Security', verification: 'assessed' as const, rating: 3 },
      { name: 'Applied Cryptography', category: 'Mathematics', verification: 'project_evidence' as const, rating: 3 },
    ],
    skipOptions: ['Basic Networking (TCP/IP)', 'Linux CLI', 'Basic Python Scripting'],
    weaknessOptions: ['Kernel eBPF Verifier Rules', 'Return-Oriented Programming (ROP)', 'Cryptographic Timing Side-Channels', 'SPIFFE Workload Attestation'],
  },
  {
    role: 'Cloud Infrastructure Maestro',
    desc: 'Kubernetes orchestration, Terraform IaC, multi-region observability & automated GitOps CI/CD.',
    subTracks: [
      'Custom Kubernetes Operators in Go',
      'Multi-Region Declarative Terraform IaC',
      'eBPF Observability & SRE Metrics',
      'Chaos Engineering & Disaster Recovery',
    ],
    defaultSkills: [
      { name: 'Kubernetes & Docker', category: 'Containers', verification: 'project_evidence' as const, rating: 4 },
      { name: 'Terraform IaC', category: 'Cloud', verification: 'assessed' as const, rating: 3 },
      { name: 'Linux Kernel & eBPF', category: 'Systems', verification: 'self_reported' as const, rating: 3 },
    ],
    skipOptions: ['Docker Basics', 'YAML / Helm Charts', 'Basic CI/CD'],
    weaknessOptions: ['controller-runtime Idempotency', 'Terratest Automated Go Harnesses', 'Multi-Burn-Rate PromQL Alerts', 'Multi-Cloud Active-Active Failover'],
  },
  {
    role: 'Full-Stack Web Architect',
    desc: 'High-performance interactive canvases, WebAssembly graphics runtimes, CRDT collaborative sync & edge serverless.',
    subTracks: [
      'Collaborative Real-Time CRDT State Sync',
      'High-Performance Canvas / WebAssembly Renderers',
      'Edge Serverless Streaming Gateways',
      'Zero-Latency WebSockets & Binary Protocols',
    ],
    defaultSkills: [
      { name: 'TypeScript Advanced Types', category: 'Languages', verification: 'project_evidence' as const, rating: 4 },
      { name: 'React & Frontend Architecture', category: 'Frontend', verification: 'project_evidence' as const, rating: 4 },
      { name: 'WebSockets & Networking', category: 'Networking', verification: 'assessed' as const, rating: 3 },
    ],
    skipOptions: ['HTML/CSS Layouts', 'Basic REST APIs', 'JavaScript Fundamentals'],
    weaknessOptions: ['CRDT Vector Clocks & Yjs', 'WebAssembly Rust OffscreenCanvas', 'V8 Edge Isolate Streaming', 'Core Web Vitals INP Optimization'],
  },
  {
    role: 'Distributed Systems Architect',
    desc: 'Consensus algorithms, event streaming, microservice topologies & high-throughput distributed DBs.',
    subTracks: [
      'Distributed Consensus Engines (Raft / Paxos)',
      'High-Throughput Event Streaming & Storage',
      'Distributed Transactions (2PC / Saga)',
      'Vector Database Index Partitioning',
    ],
    defaultSkills: [
      { name: 'Go / Rust Systems', category: 'Programming', verification: 'project_evidence' as const, rating: 4 },
      { name: 'Raft Consensus Protocol', category: 'Distributed', verification: 'assessed' as const, rating: 3 },
      { name: 'gRPC & Protocol Buffers', category: 'Networking', verification: 'project_evidence' as const, rating: 4 },
    ],
    skipOptions: ['Basic SQL Queries', 'Git Version Control', 'Basic Multithreading'],
    weaknessOptions: ['Split-Brain Leader Election', 'Log Compaction & Snapshotting', 'Distributed Two-Phase Commit', 'Jepsen Chaos Verification'],
  },
];

export function CareerDNAOnboarding({
  initialProfile,
  onClose,
  onSaveAndGenerate,
}: CareerDNAOnboardingProps) {
  // Wizard Step (1: Goal & Track, 2: Time & Modality, 3: Skills & Evidence, 4: Knowledge Frontier)
  const [step, setStep] = useState(1);

  // Step 1: Goal & Ambition
  const [targetRole, setTargetRole] = useState(initialProfile.targetRole);
  const [specializationSubTrack, setSpecializationSubTrack] = useState(
    initialProfile.specializationSubTrack ||
      PRESET_ROLES.find((p) => p.role === initialProfile.targetRole)?.subTracks[0] ||
      ''
  );
  const [targetCompanyTier, setTargetCompanyTier] = useState<string>(
    initialProfile.targetCompanyTier || 'tier1_bigtech'
  );
  const [timelineMonths, setTimelineMonths] = useState<number>(
    initialProfile.timelineMonths || 6
  );

  // Step 2: Time & Modality
  const [weeklyHours, setWeeklyHours] = useState(initialProfile.weeklyHours || 15);
  const [experienceLevel, setExperienceLevel] = useState(initialProfile.experienceLevel || 'intermediate');
  const [learningStyle, setLearningStyle] = useState<string>(
    initialProfile.learningStyle || 'code_first'
  );
  const [preferredDeliverable, setPreferredDeliverable] = useState<string>(
    initialProfile.preferredDeliverable || 'github_repo'
  );

  // Step 3: Skills & Evidence
  const [skills, setSkills] = useState<SkillItem[]>(initialProfile.currentSkills || []);
  const [projects, setProjects] = useState<StudentProject[]>(initialProfile.currentProjects || []);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Core Tech');
  const [newSkillVerification, setNewSkillVerification] = useState<'self_reported' | 'assessed' | 'project_evidence'>('project_evidence');
  const [newSkillEvidenceUrl, setNewSkillEvidenceUrl] = useState('');

  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjLink, setNewProjLink] = useState('');

  // Step 4: Knowledge Frontier & Fast-Track
  const [masteredTopicsToSkip, setMasteredTopicsToSkip] = useState<string[]>(
    initialProfile.masteredTopicsToSkip || ['Git / GitHub', 'Python Basics']
  );
  const [priorityWeaknesses, setPriorityWeaknesses] = useState<string[]>(
    initialProfile.priorityWeaknesses || ['Custom CUDA Kernels']
  );
  const [customSkipInput, setCustomSkipInput] = useState('');
  const [customWeaknessInput, setCustomWeaknessInput] = useState('');

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [genPhase, setGenPhase] = useState('Initiating Google Gemini 3.8 Flash model...');

  const activePreset = PRESET_ROLES.find((p) => p.role === targetRole);

  useEffect(() => {
    if (!generating) return;
    const phases = [
      'Querying Google Gemini 3.8 Flash model...',
      'Synthesizing personalized DAG skill tree for ' + targetRole + '...',
      'Mapping verified baseline skills into completed nodes...',
      'Formulating actionable quests with rubrics and deliverables...',
      'Calibrating Capstone Boss Battle to your ' + timelineMonths + '-month horizon...',
      'Finalizing Career World dependency matrix...',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setGenPhase(phases[idx]);
    }, 1800);
    return () => clearInterval(interval);
  }, [generating, targetRole, timelineMonths]);

  const handleSelectPresetRole = (preset: typeof PRESET_ROLES[0]) => {
    setTargetRole(preset.role);
    setSpecializationSubTrack(preset.subTracks[0] || '');
    const newSkills: SkillItem[] = preset.defaultSkills.map((s, i) => ({
      id: `skill-pre-${Date.now()}-${i}`,
      name: s.name,
      category: s.category,
      verification: s.verification,
      rating: s.rating,
      evidenceUrl: 'https://github.com/developer/' + s.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    }));
    setSkills(newSkills);
    setMasteredTopicsToSkip(preset.skipOptions.slice(0, 2));
    setPriorityWeaknesses(preset.weaknessOptions.slice(0, 2));
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      verification: newSkillVerification,
      rating: 3,
      evidenceUrl: newSkillEvidenceUrl.trim() || undefined,
    };
    setSkills([...skills, newSkill]);
    setNewSkillName('');
    setNewSkillEvidenceUrl('');
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const handleAddProject = () => {
    if (!newProjTitle.trim()) return;
    setProjects([
      ...projects,
      { title: newProjTitle.trim(), description: newProjDesc.trim(), link: newProjLink.trim() || undefined },
    ]);
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjLink('');
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const toggleSkipTopic = (topic: string) => {
    if (masteredTopicsToSkip.includes(topic)) {
      setMasteredTopicsToSkip(masteredTopicsToSkip.filter((t) => t !== topic));
    } else {
      setMasteredTopicsToSkip([...masteredTopicsToSkip, topic]);
    }
  };

  const addCustomSkip = () => {
    if (customSkipInput.trim() && !masteredTopicsToSkip.includes(customSkipInput.trim())) {
      setMasteredTopicsToSkip([...masteredTopicsToSkip, customSkipInput.trim()]);
      setCustomSkipInput('');
    }
  };

  const toggleWeakness = (weakness: string) => {
    if (priorityWeaknesses.includes(weakness)) {
      setPriorityWeaknesses(priorityWeaknesses.filter((w) => w !== weakness));
    } else {
      setPriorityWeaknesses([...priorityWeaknesses, weakness]);
    }
  };

  const addCustomWeakness = () => {
    if (customWeaknessInput.trim() && !priorityWeaknesses.includes(customWeaknessInput.trim())) {
      setPriorityWeaknesses([...priorityWeaknesses, customWeaknessInput.trim()]);
      setCustomWeaknessInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGenerating(true);
      await onSaveAndGenerate({
        targetRole,
        weeklyHours,
        experienceLevel,
        currentSkills: skills,
        currentProjects: projects,
        specializationSubTrack,
        timelineMonths,
        learningStyle,
        preferredDeliverable,
        targetCompanyTier,
        masteredTopicsToSkip,
        priorityWeaknesses,
      });
      onClose();
    } catch (err) {
      console.error(err);
      onClose();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header with Step Tracker */}
        <div className="flex flex-col border-b border-slate-800 bg-slate-950/70 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white font-display">
                    Career DNA Personalization Engine
                  </h2>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded">
                    Gemini 3.8 Flash Powered
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Calibrate your personalized constraints, sub-track specialization, and baseline competence.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={generating}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 4-Step Progress Navigation */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
            {[
              { num: 1, title: '1. Target & Track' },
              { num: 2, title: '2. Time & Modality' },
              { num: 3, title: '3. Skills & Evidence' },
              { num: 4, title: '4. Knowledge Frontier' },
            ].map((st) => (
              <button
                key={st.num}
                type="button"
                onClick={() => setStep(st.num)}
                disabled={generating}
                className={`py-1.5 px-2 rounded-lg text-left transition-all border ${
                  step === st.num
                    ? 'bg-sky-500/10 border-sky-500 text-sky-300 font-bold'
                    : step > st.num
                    ? 'bg-slate-900 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="truncate">{st.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {generating ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-sky-400 animate-spin" />
                <Sparkles className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="text-base font-bold text-white font-display">
                  Forging Personalized Career World
                </h3>
                <p className="text-xs text-sky-400 font-mono animate-pulse">
                  {genPhase}
                </p>
                <p className="text-[11px] text-slate-400 pt-2">
                  Building branching DAG skill nodes tailored to your {weeklyHours}h/week dedication, existing skills, and Capstone Boss Battle.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Goal & Ambition */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in">
                  <div>
                    <label className="block text-slate-200 font-bold mb-1 text-sm font-display">
                      Select or Customize Target Role
                    </label>
                    <p className="text-slate-400 text-xs mb-3">
                      Choose an industry specialization preset or type your custom dream tech role.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-3">
                      {PRESET_ROLES.map((preset) => (
                        <button
                          key={preset.role}
                          type="button"
                          onClick={() => handleSelectPresetRole(preset)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            targetRole === preset.role
                              ? 'bg-sky-950/60 border-sky-400 text-white shadow-md shadow-sky-950/40 ring-1 ring-sky-400/50'
                              : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <div className="font-bold text-xs flex items-center justify-between mb-1">
                            <span>{preset.role}</span>
                            {targetRole === preset.role && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {preset.desc}
                          </p>
                        </button>
                      ))}
                    </div>

                    <div className="mt-3">
                      <label className="block text-slate-400 text-[11px] font-mono uppercase mb-1">
                        Or enter custom target role title:
                      </label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. Quantitative ML Trading Engineer"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:outline-none focus:border-sky-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Specialization Sub-Track */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <label className="block text-slate-200 font-bold text-xs flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-sky-400" />
                      Specialization Sub-Track Focus
                    </label>
                    <p className="text-slate-400 text-xs">
                      What exact sub-discipline within {targetRole} should your curriculum and capstone emphasize?
                    </p>

                    {activePreset && (
                      <div className="flex flex-wrap gap-2">
                        {activePreset.subTracks.map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setSpecializationSubTrack(st)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              specializationSubTrack === st
                                ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-semibold'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    )}

                    <input
                      type="text"
                      value={specializationSubTrack}
                      onChange={(e) => setSpecializationSubTrack(e.target.value)}
                      placeholder="e.g. Distributed Memory Profiling & CUDA Extensions"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Target Company Tier & Timeline Horizon */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <label className="block text-slate-200 font-bold text-xs flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-amber-400" />
                        Target Employer Tier
                      </label>
                      <select
                        value={targetCompanyTier}
                        onChange={(e) => setTargetCompanyTier(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                      >
                        <option value="tier1_bigtech">Tier 1 Big Tech (Google, Meta, Apple, Microsoft)</option>
                        <option value="frontier_lab">Frontier Research Labs (DeepMind, OpenAI, Anthropic)</option>
                        <option value="growth_startup">High-Growth Tech Startup (Series A-C)</option>
                        <option value="opensource_core">Open Source Core Maintainer & Research</option>
                      </select>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <label className="block text-slate-200 font-bold text-xs flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        Preparation Timeline Horizon
                      </label>
                      <select
                        value={timelineMonths}
                        onChange={(e) => setTimelineMonths(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                      >
                        <option value={3}>3 Months (Rapid Sprint, High Weekly Density)</option>
                        <option value={6}>6 Months (Balanced Engineering Arc - Recommended)</option>
                        <option value={12}>12 Months (Comprehensive Mastery & Capstone)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Time & Modality */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  {/* Dedicated Weekly Hours Slider */}
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <span className="font-bold text-sm text-white font-display">
                          Realistic Weekly Commitment
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-sky-950 border border-sky-500/40 rounded-lg text-sky-300 font-mono font-bold text-sm">
                        {weeklyHours} Hours / Week
                      </div>
                    </div>

                    <input
                      type="range"
                      min={5}
                      max={35}
                      step={1}
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />

                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>5h (Casual Explorer)</span>
                      <span>15h (Consistent Builder)</span>
                      <span>35h (Intensive Forge)</span>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed pt-1">
                      Ascendra will calibrate node estimated effort and quest milestones to match your realistic schedule so you never burn out.
                    </p>
                  </div>

                  {/* Experience Level & Learning Modality */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <label className="block text-slate-200 font-bold text-xs">
                        Current Experience Baseline
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                      >
                        <option value="beginner">Beginner / Bootcamp Graduate (Foundations first)</option>
                        <option value="intermediate">Intermediate Tech Student (Ready for core systems)</option>
                        <option value="advanced">Advanced Practitioner (Skipping intro, straight to frontier)</option>
                      </select>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <label className="block text-slate-200 font-bold text-xs">
                        Primary Learning Modality
                      </label>
                      <select
                        value={learningStyle}
                        onChange={(e) => setLearningStyle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                      >
                        <option value="code_first">Code-First Practical Implementation (Build & Benchmark)</option>
                        <option value="research_deep_dive">Research & Whitepaper Ablations (Papers + Reproducibility)</option>
                        <option value="architecture_rfc">Systems Architecture RFCs (System Design & Scalability)</option>
                        <option value="hackathon_deliverables">Competitive Hackathon Deliverables (Working Live Prototypes)</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Deliverable Format */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <label className="block text-slate-200 font-bold text-xs flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-emerald-400" />
                      Preferred Evidence Deliverable Format
                    </label>
                    <p className="text-slate-400 text-xs">
                      What tangible artifact do you want quests to produce for your Career Passport?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {[
                        { id: 'github_repo', label: 'GitHub Repository with Automated CI Suite' },
                        { id: 'live_demo', label: 'Public Live Demo / Deployed API Endpoint' },
                        { id: 'benchmark_report', label: 'Reproducible Benchmark & Latency Profiling Report' },
                        { id: 'architecture_diagram', label: 'System Design Diagram & Written RFC' },
                      ].map((del) => (
                        <button
                          key={del.id}
                          type="button"
                          onClick={() => setPreferredDeliverable(del.id)}
                          className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-colors ${
                            preferredDeliverable === del.id
                              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {del.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Skills & Evidence */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-200 font-bold text-sm font-display">
                        Current Competencies & Proof Verification
                      </label>
                      <span className="text-slate-400 text-xs">
                        Distinguish self-reported claims from verified evidence
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-white text-xs">{skill.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({skill.category})</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                skill.verification === 'project_evidence'
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                  : skill.verification === 'assessed'
                                  ? 'bg-sky-950/80 text-sky-300 border border-sky-500/40'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {skill.verification.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-amber-400 font-mono text-xs">Rating: {skill.rating}/5</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill.id)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Skill Form */}
                    <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                      <div className="font-bold text-xs text-slate-300">Add Existing Competency</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Skill Name (e.g. PyTorch, Rust)"
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                        />
                        <select
                          value={newSkillCategory}
                          onChange={(e) => setNewSkillCategory(e.target.value)}
                          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                        >
                          <option value="Core Tech">Core Tech</option>
                          <option value="Programming">Programming</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Systems">Systems</option>
                          <option value="Deep Learning">Deep Learning</option>
                        </select>
                        <select
                          value={newSkillVerification}
                          onChange={(e) => setNewSkillVerification(e.target.value as any)}
                          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                        >
                          <option value="project_evidence">Project Evidence (GitHub/Demo)</option>
                          <option value="assessed">Diagnostic Assessment Passed</option>
                          <option value="self_reported">Self-Reported Claim</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Optional Artifact / Repo URL for verification"
                          value={newSkillEvidenceUrl}
                          onChange={(e) => setNewSkillEvidenceUrl(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Skill
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Existing Projects */}
                  <div>
                    <label className="block text-slate-200 font-bold mb-2 text-sm font-display">
                      Existing Projects & Repositories
                    </label>
                    <div className="space-y-2 mb-3">
                      {projects.map((proj, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between gap-3"
                        >
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-2">
                              <span>{proj.title}</span>
                              {proj.link && (
                                <a
                                  href={proj.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-sky-400 hover:underline"
                                >
                                  {proj.link}
                                </a>
                              )}
                            </div>
                            <p className="text-slate-400 text-xs mt-0.5">{proj.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Project Title (e.g. Reverse-Mode Autodiff)"
                          value={newProjTitle}
                          onChange={(e) => setNewProjTitle(e.target.value)}
                          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                        />
                        <input
                          type="text"
                          placeholder="Link / GitHub URL"
                          value={newProjLink}
                          onChange={(e) => setNewProjLink(e.target.value)}
                          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Short description of what you implemented and verified"
                          value={newProjDesc}
                          onChange={(e) => setNewProjDesc(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddProject}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Project
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Knowledge Frontier & Fast-Track */}
              {step === 4 && (
                <div className="space-y-5 animate-in fade-in">
                  {/* Mastered Topics to Fast-Track/Skip */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-200 font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Topics I Already Master & Want to Fast-Track / Skip
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Will appear completed on your map
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Select prerequisites you have already mastered so Ascendra marks them as completed and opens downstream systems right away:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {activePreset?.skipOptions.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleSkipTopic(topic)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            masteredTopicsToSkip.includes(topic)
                              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {topic} {masteredTopicsToSkip.includes(topic) ? '✓' : '+'}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add another topic you already know..."
                        value={customSkipInput}
                        onChange={(e) => setCustomSkipInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkip(); } }}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={addCustomSkip}
                        className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded-lg text-xs hover:bg-slate-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Priority Weaknesses & Focus Areas */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-200 font-bold text-xs flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Priority Technical Blocker / Growth Areas
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Receives deep practical quests
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      What specific areas are currently your biggest bottlenecks? Ascendra will place priority challenge nodes on your critical path:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {activePreset?.weaknessOptions.map((weakness) => (
                        <button
                          key={weakness}
                          type="button"
                          onClick={() => toggleWeakness(weakness)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            priorityWeaknesses.includes(weakness)
                              ? 'bg-amber-950/80 border-amber-400 text-amber-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {weakness} {priorityWeaknesses.includes(weakness) ? '★' : '+'}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add another blocker topic..."
                        value={customWeaknessInput}
                        onChange={(e) => setCustomWeaknessInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomWeakness(); } }}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={addCustomWeakness}
                        className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded-lg text-xs hover:bg-slate-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Configuration Summary Card */}
                  <div className="p-4 bg-sky-950/30 border border-sky-500/30 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-sky-300 font-display flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-400" />
                      Personalization Blueprint Ready
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300 pt-1">
                      <div>
                        <span className="text-slate-500 block">Goal:</span>
                        <span className="font-bold text-white truncate block">{targetRole}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Pacing:</span>
                        <span className="font-bold text-sky-400">{weeklyHours}h/wk ({timelineMonths}mo)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Fast-Track:</span>
                        <span className="font-bold text-emerald-400">{masteredTopicsToSkip.length} topics skipped</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Deep Focus:</span>
                        <span className="font-bold text-amber-400">{priorityWeaknesses.length} priority nodes</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Wizard Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous Step
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-sky-500/20"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={generating}
                      className="px-6 py-2.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 hover:opacity-95 shadow-lg shadow-sky-500/30 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      Forge Personalized Career World
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
