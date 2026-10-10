import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { CareerWorldGraph } from './components/CareerWorldGraph';
import { QuestModal } from './components/QuestModal';
import { MarkKnownModal } from './components/MarkKnownModal';
import { CareerDNAOnboarding } from './components/CareerDNAOnboarding';
import { BossBattleArena } from './components/BossBattleArena';
import { CareerPassportView } from './components/CareerPassportView';
import { CareerTwinCard } from './components/CareerTwinCard';
import { AdaptiveNotice } from './components/AdaptiveNotice';
import { MentorConnectView } from './components/MentorConnectView';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { JudgeTourBanner } from './components/JudgeTourBanner';
import { JudgeDeckModal } from './components/JudgeDeckModal';
import { api, getStoredUser, clearStoredAuth } from './services/api';
import type {
  CareerDNA,
  CareerWorldData,
  RoadmapNode,
  InventoryItem,
  BossBattle,
  AdaptiveChangeLog,
  SkillItem,
  StudentProject,
  User,
} from './types/career';
import {
  Compass,
  Sparkles,
  Zap,
  Target,
  Trophy,
  ShieldCheck,
  Loader2,
  Users,
  Award,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showJudgeDeck, setShowJudgeDeck] = useState(false);
  const [judgeStep, setJudgeStep] = useState(1);

  const [profile, setProfile] = useState<CareerDNA | null>(null);
  const [roadmap, setRoadmap] = useState<CareerWorldData | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [bossBattles, setBossBattles] = useState<BossBattle[]>([]);

  // Simplified 4-tab navigation
  const [activeTab, setActiveTab] = useState<'world' | 'boss' | 'mentors' | 'passport'>('world');

  const [selectedQuestNode, setSelectedQuestNode] = useState<RoadmapNode | null>(null);
  const [selectedMarkKnownNode, setSelectedMarkKnownNode] = useState<RoadmapNode | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [adaptiveNotice, setAdaptiveNotice] = useState<AdaptiveChangeLog | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all data on mount or after login
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [profData, roadData, invData, bossData, meData] = await Promise.all([
        api.getProfile(),
        api.getRoadmap(),
        api.getInventory(),
        api.getBossBattles(),
        api.getMe().catch(() => ({ user: null, profile: null, roadmap: null })),
      ]);

      if (meData?.user) {
        setCurrentUser(meData.user);
      }

      setProfile(profData);
      setRoadmap(roadData);
      setInventory(invData);
      setBossBattles(bossData);
      if (roadData.lastAdaptiveChange) {
        setAdaptiveNotice(roadData.lastAdaptiveChange);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Authentication Success
  const handleAuthSuccess = (user: User, userProfile: CareerDNA, userRoadmap: CareerWorldData) => {
    setCurrentUser(user);
    setProfile(userProfile);
    setRoadmap(userRoadmap);
    loadData();
  };

  // Handle Logout
  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    clearStoredAuth();
    loadData();
  };

  // Reset demo / guest progress to Level 1
  const handleResetGuestProgress = async () => {
    const res = await api.resetGuestProgress();
    setProfile(res.profile);
    setRoadmap(res.roadmap);
    setInventory([]);
    const freshBoss = await api.getBossBattles();
    setBossBattles(freshBoss);
  };

  // Handle quest completed
  const handleQuestCompleted = (
    updatedNode: RoadmapNode,
    xpGained: number,
    leveledUp: boolean
  ) => {
    if (!roadmap || !profile) return;
    loadData();
    setSelectedQuestNode(null);
  };

  // Handle mark node known (Adaptive Engine)
  const handleMarkKnownConfirm = async (nodeId: string, reason: string) => {
    const res = await api.markNodeKnown(nodeId, reason);
    setRoadmap(res.roadmap);
    setProfile(res.profile);
    setAdaptiveNotice(res.adaptiveNotice);
    const updatedInv = await api.getInventory();
    setInventory(updatedInv);
  };

  // Live Demo action: Simulate completing an available quest with fanfare!
  const handleSimulateQuestWin = async () => {
    if (!roadmap) return;
    const targetNode = roadmap.nodes.find((n) => n.status === 'available') || roadmap.nodes[0];
    if (!targetNode) return;

    try {
      const res = await api.completeQuest(targetNode.id, {
        evidenceUrl: 'https://github.com/alex-vance/pytorch-custom-cuda-ops',
        note: 'Optimized focal loss with CUDA kernel and verified gradcheck numerical precision (eps=1e-6).',
        rubricScores: { r1: 95, r2: 90, r3: 95 },
        verificationType: 'project_evidence',
      });

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#38bdf8', '#f59e0b', '#10b981'],
        });
      } catch (e) {}

      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Live Demo action: Simulate adaptive replanning
  const handleSimulateAdaptiveReplanning = async () => {
    if (!roadmap) return;
    const uncompletedNode = roadmap.nodes.find((n) => n.status !== 'completed' && n.category !== 'boss_battle') || roadmap.nodes[0];
    if (!uncompletedNode) return;

    await handleMarkKnownConfirm(
      uncompletedNode.id,
      'Verified via prior academic coursework and production internship.'
    );
  };

  // Handle Step selection from Judge Tour
  const handleSelectJudgeStep = (stepNumber: number) => {
    setJudgeStep(stepNumber);
    if (stepNumber === 1) {
      setShowOnboarding(true);
    } else if (stepNumber === 2) {
      setActiveTab('world');
    } else if (stepNumber === 3) {
      setActiveTab('world');
      // trigger mark known on first available node
      const nodeToTest = roadmap?.nodes.find((n) => n.status === 'available');
      if (nodeToTest) setSelectedMarkKnownNode(nodeToTest);
    } else if (stepNumber === 4) {
      setActiveTab('boss');
    } else if (stepNumber === 5) {
      setActiveTab('mentors');
    }
  };

  // Handle generation from Onboarding
  const handleSaveAndGenerate = async (params: {
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
  }) => {
    const res = await api.generateRoadmap(params);
    setRoadmap(res.roadmap);
    setProfile(res.profile);
    setBossBattles(res.bossBattles);
    if (res.roadmap.lastAdaptiveChange) {
      setAdaptiveNotice(res.roadmap.lastAdaptiveChange);
    }
  };

  // If not logged in, show dedicated Login / Create Account page
  if (!currentUser) {
    return <LoginPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        <span className="font-mono text-xs tracking-wider uppercase text-slate-300">
          Initializing Ascendra Career World...
        </span>
      </div>
    );
  }

  const currentBoss = bossBattles[0] || {
    id: 'boss-neural-core',
    title: 'Titan Neural Core: The Autonomous Model Nexus',
    codename: 'OP: SYNAPSE-TITAN',
    description: 'A multi-phase trial synthesizing data curation, distributed LoRA fine-tuning, automated evaluation rigor, and low-latency quantization serving.',
    hpTotal: 4000,
    hpCurrent: 4000,
    requiredSkills: ['PyTorch CUDA Extensions', 'Transformer Architecture', 'FSDP Distributed Training'],
    phases: [],
    status: 'locked' as const,
    lootSummary: 'Verified AI Research Engineer Passport Badge, Titan Architecture Blueprint Artifact, +2000 Career XP',
    xpReward: 2000,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Judge Pitch Tour & Live Presentation Shortcuts */}
      <JudgeTourBanner
        currentStep={judgeStep}
        onSelectStep={handleSelectJudgeStep}
        onOpenDeck={() => setShowJudgeDeck(true)}
        onSimulateQuestWin={handleSimulateQuestWin}
        onSimulateAdaptiveReplanning={handleSimulateAdaptiveReplanning}
      />

      {/* Top Bar (adheres to Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenJudgeDeck={() => setShowJudgeDeck(true)}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Adaptive Notice if route changed */}
        {adaptiveNotice && (
          <AdaptiveNotice
            notice={adaptiveNotice}
            onDismiss={() => setAdaptiveNotice(null)}
          />
        )}

        {/* Global Career Twin Banner */}
        {profile && (
          <CareerTwinCard
            profile={profile}
            onEditProfile={() => setShowOnboarding(true)}
            currentUser={currentUser}
            onOpenAuth={() => setShowAuthModal(true)}
            onResetProgress={handleResetGuestProgress}
          />
        )}

        {/* Tab 1: Career World (Interactive Skill Tree & Quest Cards) */}
        {activeTab === 'world' && roadmap && (
          <div className="space-y-6">
            <CareerWorldGraph
              nodes={roadmap.nodes}
              edges={roadmap.edges}
              onOpenQuest={(node) => setSelectedQuestNode(node)}
              onMarkKnown={(node) => setSelectedMarkKnownNode(node)}
              targetRole={roadmap.targetRole}
            />

            {/* Quick Strategic Guidance Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider mb-1">
                  <Target className="w-4 h-4" /> Recommended Next Action
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {roadmap.nodes.find((n) => n.status === 'available')
                    ? `Focus on "${roadmap.nodes.find((n) => n.status === 'available')?.title}" to unlock downstream systems.`
                    : 'All foundational nodes unlocked! Review your quest ledger to proceed.'}
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <Trophy className="w-4 h-4" /> Capstone Boss Readiness
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentBoss.status === 'defeated'
                    ? 'Titan Core defeated! Your portfolio credentials are fully verified.'
                    : currentBoss.status === 'unlocked'
                    ? 'Prerequisites satisfied! Boss Battle arena is now unlocked for attack.'
                    : `Complete Tier 3 distributed systems milestones to unlock ${currentBoss.title}.`}
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" /> Evidence Ledger Status
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {inventory.filter((i) => i.verification === 'project_evidence').length} public deliverables verified in your career passport.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Boss Arena */}
        {activeTab === 'boss' && profile && (
          <BossBattleArena
            boss={currentBoss}
            profile={profile}
            onBossUpdated={(updatedBoss, updatedProfile) => {
              setBossBattles([updatedBoss]);
              setProfile(updatedProfile);
              loadData();
            }}
          />
        )}

        {/* Tab 3: Mentor Connect */}
        {activeTab === 'mentors' && profile && roadmap && (
          <MentorConnectView
            profile={profile}
            roadmapNodes={roadmap.nodes}
          />
        )}

        {/* Tab 4: Career Passport (Unified Evidence Ledger & Career Twin) */}
        {activeTab === 'passport' && profile && (
          <CareerPassportView
            inventory={inventory}
            profile={profile}
            currentUser={currentUser}
            onItemAdded={(newItem) => {
              setInventory([newItem, ...inventory]);
              loadData();
            }}
            onEditProfile={() => setShowOnboarding(true)}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Ascendra</span>
            <span>·</span>
            <span>Forge your skills. Unlock your future.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setShowJudgeDeck(true)}
              className="text-amber-400 hover:underline font-semibold"
            >
              3-Minute Judge Pitch Deck
            </button>
            <span>·</span>
            <span>Powered by Gemini 3.8 Flash & Deterministic Graph Logic</span>
          </div>
        </div>
      </footer>

      {/* Quest Modal */}
      {selectedQuestNode && (
        <QuestModal
          node={selectedQuestNode}
          onClose={() => setSelectedQuestNode(null)}
          onQuestCompleted={handleQuestCompleted}
        />
      )}

      {/* Fast-Track / Mark Known Modal */}
      {selectedMarkKnownNode && (
        <MarkKnownModal
          node={selectedMarkKnownNode}
          onClose={() => setSelectedMarkKnownNode(null)}
          onConfirm={handleMarkKnownConfirm}
        />
      )}

      {/* Onboarding / Tuning Modal */}
      {showOnboarding && profile && (
        <CareerDNAOnboarding
          initialProfile={profile}
          onClose={() => setShowOnboarding(false)}
          onSaveAndGenerate={handleSaveAndGenerate}
        />
      )}

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Judge Pitch Deck & Demo Script Modal */}
      <JudgeDeckModal
        isOpen={showJudgeDeck}
        onClose={() => setShowJudgeDeck(false)}
        onSelectStep={handleSelectJudgeStep}
      />
    </div>
  );
}
