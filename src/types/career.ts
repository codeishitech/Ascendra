export type SkillVerificationStatus = 'self_reported' | 'assessed' | 'project_evidence';

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  verification: SkillVerificationStatus;
  rating: number; // 1 to 5
  evidenceUrl?: string;
}

export interface StudentProject {
  title: string;
  description: string;
  link?: string;
}

export interface CareerDNA {
  targetRole: string;
  targetRoleDescription: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  weeklyHours: number;
  currentSkills: SkillItem[];
  currentProjects: StudentProject[];
  xp: number;
  level: number;
  title: string;
  competenciesVerifiedCount: number;
  // Deep personalization parameters
  specializationSubTrack?: string;
  timelineMonths?: number;
  learningStyle?: 'code_first' | 'research_deep_dive' | 'architecture_rfc' | 'hackathon_deliverables';
  preferredDeliverable?: 'github_repo' | 'live_demo' | 'benchmark_report' | 'architecture_diagram';
  targetCompanyTier?: 'tier1_bigtech' | 'frontier_lab' | 'growth_startup' | 'opensource_core';
  masteredTopicsToSkip?: string[];
  priorityWeaknesses?: string[];
}

export type NodeCategory = 'skill' | 'project' | 'assessment' | 'milestone' | 'boss_battle';
export type NodeStatus = 'locked' | 'available' | 'active' | 'completed';

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number;
  description: string;
  maxScore: number;
}

export interface CuratedResource {
  title: string;
  url: string;
  type: 'documentation' | 'paper' | 'guide';
}

export interface QuestData {
  objective: string;
  brief: string;
  steps: string[];
  tangibleDeliverable: string;
  deliverableType: 'github_repo' | 'live_demo' | 'benchmark_report' | 'architecture_diagram' | 'code_review';
  rubric: RubricCriterion[];
  curatedResources: CuratedResource[];
  interviewQuestions: string[];
  xpReward: number;
  estimatedHours: number;
}

export interface EvidenceSubmission {
  url: string;
  note: string;
  rubricScores?: Record<string, number>;
  submittedAt: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  subtitle: string;
  tier: number;
  category: NodeCategory;
  prerequisites: string[];
  estimatedHours: number;
  status: NodeStatus;
  position: { x: number; y: number };
  quest: QuestData;
  completedAt?: string;
  evidenceSubmitted?: EvidenceSubmission;
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface AdaptiveChangeLog {
  reason: string;
  timestamp: string;
  affectedNodes: string[];
  unlockedCount: number;
}

export interface CareerWorldData {
  targetRole: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  lastAdaptiveChange?: AdaptiveChangeLog;
}

export interface InventoryItem {
  id: string;
  nodeId?: string;
  title: string;
  category: string;
  verification: SkillVerificationStatus;
  deliverableType: string;
  artifactUrl: string;
  notes: string;
  dateAdded: string;
  xpEarned: number;
}

export interface BossPhase {
  id: string;
  title: string;
  deliverable: string;
  completed: boolean;
  xp: number;
}

export interface BossBattle {
  id: string;
  title: string;
  codename: string;
  description: string;
  hpTotal: number;
  hpCurrent: number;
  requiredSkills: string[];
  phases: BossPhase[];
  status: 'locked' | 'unlocked' | 'defeated';
  lootSummary: string;
  xpReward: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  targetRole: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  profile: CareerDNA;
  roadmap: CareerWorldData;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  roleSpecialty: string; // e.g. "AI Research", "Distributed Systems", "Cloud Infrastructure"
  bio: string;
  experienceYears: number;
  avatarUrl: string;
  rating: number; // e.g. 4.9
  reviewCount: number;
  availability: 'Accepting Mentees' | 'Limited Slots' | 'Booked';
  skills: string[];
  verifiedCompany: boolean;
}

export interface MentorMessage {
  id: string;
  senderId: string;
  recipientId: string;
  mentorId: string;
  senderRole: 'student' | 'mentor';
  text: string;
  timestamp: string;
  attachedDeliverable?: {
    nodeTitle: string;
    artifactUrl: string;
    rubricNote?: string;
  };
}

export interface MentorConversation {
  mentorId: string;
  mentor: Mentor;
  lastMessage?: MentorMessage;
  unreadCount: number;
  status: 'connected' | 'pending';
}
