import { useState, useEffect, useRef } from 'react';
import {
  Users,
  Search,
  MessageSquare,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Building,
  Award,
  Star,
  FileCode,
  Paperclip,
  X,
  ChevronRight,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { api } from '../services/api';
import type { Mentor, MentorMessage, CareerDNA, RoadmapNode } from '../types/career';

interface MentorConnectViewProps {
  profile: CareerDNA;
  roadmapNodes: RoadmapNode[];
}

export function MentorConnectView({ profile, roadmapNodes }: MentorConnectViewProps) {
  const [mentors, setMentors] = useState<(Mentor & { isConnected?: boolean })[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');

  // New message input
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [showAttachDeliverable, setShowAttachDeliverable] = useState(false);
  const [selectedDeliverableNode, setSelectedDeliverableNode] = useState<RoadmapNode | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load mentors
  const fetchMentors = async () => {
    try {
      setLoadingMentors(true);
      const data = await api.getMentors({
        search: searchQuery,
        role: selectedRoleFilter,
      });
      setMentors(data);
      if (!selectedMentor && data.length > 0) {
        setSelectedMentor(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMentors(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [searchQuery, selectedRoleFilter]);

  // Load messages when selectedMentor changes
  useEffect(() => {
    if (!selectedMentor) return;
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const data = await api.getMentorMessages(selectedMentor.id);
        setMessages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedMentor]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle connect
  const handleConnect = async (mentor: Mentor) => {
    try {
      await api.connectMentor(mentor.id);
      setSelectedMentor(mentor);
      // Refresh list
      setMentors((prev) =>
        prev.map((m) => (m.id === mentor.id ? { ...m, isConnected: true } : m))
      );
      // Refresh messages
      const msgs = await api.getMentorMessages(mentor.id);
      setMessages(msgs);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !messageText.trim()) return;

    try {
      setSending(true);
      const payload: any = {
        text: messageText,
      };

      if (selectedDeliverableNode) {
        payload.attachedDeliverable = {
          nodeTitle: selectedDeliverableNode.title,
          artifactUrl:
            selectedDeliverableNode.evidenceSubmitted?.url ||
            'https://github.com/student/quest-deliverable',
          rubricNote: selectedDeliverableNode.evidenceSubmitted?.note || '',
        };
      }

      // Optimistic append of user message
      const tempUserMsg: MentorMessage = {
        id: `temp-${Date.now()}`,
        senderId: 'current-user',
        recipientId: selectedMentor.id,
        mentorId: selectedMentor.id,
        senderRole: 'student',
        text: messageText,
        timestamp: new Date().toISOString(),
        attachedDeliverable: payload.attachedDeliverable,
      };
      setMessages((prev) => [...prev, tempUserMsg]);
      setMessageText('');
      setSelectedDeliverableNode(null);
      setShowAttachDeliverable(false);

      const res = await api.sendMentorMessage(selectedMentor.id, payload);
      // Replace with returned messages
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        res.userMessage,
        res.mentorMessage,
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            Mentor Connect & Code Advisory
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Direct Mentorship from Industry Staff Engineers
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Match with mentors tailored to your target role in {profile.targetRole}. Submit your quest deliverables for code review, ask architecture questions, and calibrate your engineering portfolio.
          </p>
        </div>

        {/* Quick Goal Tag */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono">
          <div className="text-slate-400 text-[10px] uppercase">Your Target Specialization</div>
          <div className="text-amber-400 font-bold font-display text-sm mt-0.5">
            {profile.targetRole}
          </div>
        </div>
      </div>

      {/* Main Mentor Interface Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mentor Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Specialty Filter */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search mentors by name, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {[
                { id: 'all', label: 'All Specialties' },
                { id: 'AI', label: 'AI & ML' },
                { id: 'Distributed', label: 'Distributed Systems' },
                { id: 'Cloud', label: 'Cloud & MLOps' },
                { id: 'Robotics', label: 'Robotics Autonomy' },
                { id: 'Security', label: 'Cyber Defense' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedRoleFilter(pill.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                    selectedRoleFilter === pill.id
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors Cards List */}
          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {loadingMentors ? (
              <div className="py-12 flex justify-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
              </div>
            ) : mentors.length === 0 ? (
              <div className="p-6 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-400">
                No mentors found matching your search.
              </div>
            ) : (
              mentors.map((mentor) => {
                const isSelected = selectedMentor?.id === mentor.id;
                return (
                  <div
                    key={mentor.id}
                    onClick={() => setSelectedMentor(mentor)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-sky-400/80 shadow-lg shadow-sky-950/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-950 to-indigo-950 border border-sky-500/40 flex items-center justify-center text-sky-300 font-mono font-bold text-sm shrink-0">
                          {mentor.avatarUrl}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            {mentor.name}
                            {mentor.verifiedCompany && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                            )}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <span className="text-slate-300 font-medium">{mentor.company}</span>
                            <span>·</span>
                            <span>{mentor.title}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{mentor.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{mentor.reviewCount} reviews</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {mentor.bio}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {mentor.skills.slice(0, 3).map((sk, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-mono text-slate-400"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-[11px] text-slate-400">
                        {mentor.experienceYears} Years Exp · {mentor.availability}
                      </span>

                      {mentor.isConnected ? (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConnect(mentor);
                          }}
                          className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded text-xs font-bold transition-colors shadow-sm"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Direct Messaging Stream (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[700px] overflow-hidden shadow-2xl">
          {selectedMentor ? (
            <>
              {/* Chat Header */}
              <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-950 to-indigo-950 border border-sky-500/40 flex items-center justify-center text-sky-300 font-mono font-bold text-sm">
                    {selectedMentor.avatarUrl}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {selectedMentor.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    </h3>
                    <div className="text-[11px] text-slate-400">
                      {selectedMentor.title} @ <strong className="text-slate-300">{selectedMentor.company}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Available for Review
                  </span>
                </div>
              </div>

              {/* Chat Message Scroll Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                {loadingMessages ? (
                  <div className="py-12 flex justify-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    No messages yet. Send a greeting or ask a question about your career roadmap!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isStudent = msg.senderRole === 'student';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500 font-mono">
                          <span>{isStudent ? 'You' : selectedMentor.name}</span>
                          <span>·</span>
                          <span>{msg.timestamp.split('T')[1]?.substring(0, 5) || 'Just now'}</span>
                        </div>

                        <div
                          className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                            isStudent
                              ? 'bg-sky-500 text-slate-950 font-medium rounded-tr-xs shadow-md shadow-sky-950/20'
                              : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-xs'
                          }`}
                        >
                          {/* Attached Deliverable Box if any */}
                          {msg.attachedDeliverable && (
                            <div className={`p-2.5 rounded-lg mb-2.5 border text-xs ${
                              isStudent
                                ? 'bg-sky-600/60 border-sky-400/60 text-slate-950'
                                : 'bg-slate-900 border-sky-500/40 text-slate-200'
                            }`}>
                              <div className="flex items-center gap-1.5 font-bold mb-1">
                                <FileCode className="w-3.5 h-3.5" />
                                <span>Quest Deliverable Review Request</span>
                              </div>
                              <div className="font-semibold">{msg.attachedDeliverable.nodeTitle}</div>
                              <div className="text-[11px] truncate mt-0.5 underline">
                                {msg.attachedDeliverable.artifactUrl}
                              </div>
                              {msg.attachedDeliverable.rubricNote && (
                                <div className="text-[11px] italic mt-1 opacity-90">
                                  "{msg.attachedDeliverable.rubricNote}"
                                </div>
                              )}
                            </div>
                          )}

                          <div className="whitespace-pre-line text-xs">{msg.text}</div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Attach Deliverable Selector Drawer */}
              {showAttachDeliverable && (
                <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-sky-400" />
                      Attach Quest Deliverable for Mentor Review:
                    </span>
                    <button
                      onClick={() => setShowAttachDeliverable(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                    {roadmapNodes
                      .filter((n) => n.status === 'completed' || n.status === 'available')
                      .map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            setSelectedDeliverableNode(n);
                            setShowAttachDeliverable(false);
                          }}
                          className={`p-2 text-left rounded-lg border transition-colors ${
                            selectedDeliverableNode?.id === n.id
                              ? 'bg-sky-950/80 border-sky-400 text-sky-200'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-semibold truncate">{n.title}</div>
                          <div className="text-[10px] text-slate-500 uppercase">
                            {n.status} · Tier {n.tier}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Attached Badge in Form */}
              {selectedDeliverableNode && !showAttachDeliverable && (
                <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-sky-300">
                  <div className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Attached: <strong>{selectedDeliverableNode.title}</strong></span>
                  </div>
                  <button
                    onClick={() => setSelectedDeliverableNode(null)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/90 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Attach Quest Deliverable for Review"
                    onClick={() => setShowAttachDeliverable(!showAttachDeliverable)}
                    className={`p-2 rounded-lg border transition-colors ${
                      selectedDeliverableNode
                        ? 'bg-sky-950 border-sky-500 text-sky-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    placeholder={`Message ${selectedMentor.name} for technical feedback, code review, or career advice...`}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />

                  <button
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-sky-500/20 shrink-0"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{sending ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <MessageSquare className="w-10 h-10 text-slate-700 mb-2" />
              <p className="text-sm font-semibold text-slate-400">Select a mentor to start a conversation</p>
              <p className="text-xs text-slate-600 mt-1">Browse the directory to connect with domain experts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
