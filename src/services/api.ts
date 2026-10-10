import type {
  CareerDNA,
  CareerWorldData,
  RoadmapNode,
  InventoryItem,
  BossBattle,
  AdaptiveChangeLog,
  User,
  AuthResponse,
  Mentor,
  MentorMessage,
} from '../types/career';

const TOKEN_KEY = 'ascendra_auth_token';
const USER_KEY = 'ascendra_auth_user';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function setStoredAuth(token: string, user: User) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {}
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {}
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Authentication
  async signup(data: { email: string; password: string; name: string; targetRole?: string }): Promise<AuthResponse> {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to sign up');
    }
    const result: AuthResponse = await res.json();
    setStoredAuth(result.token, result.user);
    return result;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid email or password');
    }
    const result: AuthResponse = await res.json();
    setStoredAuth(result.token, result.user);
    return result;
  },

  async getMe(): Promise<{ user: User | null; profile: CareerDNA; roadmap: CareerWorldData }> {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load session');
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST', headers: getAuthHeaders() }).catch(() => {});
    clearStoredAuth();
  },

  // Career DNA & Profile
  async getProfile(): Promise<CareerDNA> {
    const res = await fetch('/api/profile', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },

  async updateProfile(profile: Partial<CareerDNA>): Promise<CareerDNA> {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Roadmap
  async getRoadmap(): Promise<CareerWorldData> {
    const res = await fetch('/api/roadmap', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load roadmap');
    return res.json();
  },

  async generateRoadmap(params: {
    targetRole: string;
    weeklyHours: number;
    experienceLevel: string;
    currentSkills: any[];
    currentProjects: any[];
    specializationSubTrack?: string;
    timelineMonths?: number;
    learningStyle?: string;
    preferredDeliverable?: string;
    targetCompanyTier?: string;
    masteredTopicsToSkip?: string[];
    priorityWeaknesses?: string[];
  }): Promise<{ roadmap: CareerWorldData; profile: CareerDNA; bossBattles: BossBattle[] }> {
    const res = await fetch('/api/roadmap/generate', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate roadmap');
    return res.json();
  },

  async markNodeKnown(nodeId: string, reason?: string): Promise<{
    success: boolean;
    roadmap: CareerWorldData;
    profile: CareerDNA;
    adaptiveNotice: AdaptiveChangeLog;
  }> {
    const res = await fetch('/api/roadmap/node/mark-known', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ nodeId, reason }),
    });
    if (!res.ok) throw new Error('Failed to mark node as known');
    return res.json();
  },

  async completeQuest(
    nodeId: string,
    payload: {
      evidenceUrl: string;
      note: string;
      rubricScores?: Record<string, number>;
      verificationType?: 'self_reported' | 'assessed' | 'project_evidence';
    }
  ): Promise<{
    success: boolean;
    node: RoadmapNode;
    xpGained: number;
    leveledUp: boolean;
    newLevel: number;
    newlyUnlockedIds: string[];
    inventoryItem: InventoryItem;
    roadmap: CareerWorldData;
    profile: CareerDNA;
  }> {
    const res = await fetch(`/api/quest/${nodeId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit quest deliverable');
    return res.json();
  },

  async getAIHint(nodeId: string, question?: string): Promise<{ advice: string }> {
    const res = await fetch(`/api/quest/${nodeId}/ai-hint`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error('Failed to retrieve AI mentor advice');
    return res.json();
  },

  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    const res = await fetch('/api/inventory', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load inventory');
    return res.json();
  },

  async addInventoryItem(item: Partial<InventoryItem>): Promise<InventoryItem> {
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to add evidence item');
    return res.json();
  },

  // Boss Arena
  async getBossBattles(): Promise<BossBattle[]> {
    const res = await fetch('/api/boss-battles', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load boss battles');
    return res.json();
  },

  async strikeBoss(payload: {
    bossId: string;
    phaseId: string;
    evidenceUrl?: string;
    notes?: string;
  }): Promise<{ success: boolean; boss: BossBattle; profile: CareerDNA }> {
    const res = await fetch('/api/boss-battles/strike', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to complete boss battle phase');
    return res.json();
  },

  // Mentor Connect
  async getMentors(query?: { search?: string; role?: string }): Promise<(Mentor & { isConnected?: boolean })[]> {
    const params = new URLSearchParams();
    if (query?.search) params.set('search', query.search);
    if (query?.role) params.set('role', query.role);
    const res = await fetch(`/api/mentors?${params.toString()}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load mentors');
    return res.json();
  },

  async connectMentor(mentorId: string): Promise<{ success: boolean; connectedMentors: string[] }> {
    const res = await fetch(`/api/mentors/${mentorId}/connect`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to connect with mentor');
    return res.json();
  },

  async getMentorMessages(mentorId: string): Promise<MentorMessage[]> {
    const res = await fetch(`/api/mentors/${mentorId}/messages`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load messages');
    return res.json();
  },

  async sendMentorMessage(
    mentorId: string,
    payload: {
      text: string;
      attachedDeliverable?: {
        nodeTitle: string;
        artifactUrl: string;
        rubricNote?: string;
      };
    }
  ): Promise<{ userMessage: MentorMessage; mentorMessage: MentorMessage }> {
    const res = await fetch(`/api/mentors/${mentorId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to send message to mentor');
    return res.json();
  },
};
