'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Send,
  BookOpen,
  MessageSquare,
  Sparkles,
  LogOut,
  User,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Search,
  PlusCircle,
  Database,
  Zap,
  Building,
  Globe,
  LogIn,
  Layers,
  HelpCircle
} from 'lucide-react';

interface ChatCitation {
  id: string;
  docId: string;
  docTitle: string;
  section: string;
  owner: string;
  score: number;
  snippet: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: ChatCitation[];
  metrics?: {
    retrievalLatencyMs: number;
    generationLatencyMs: number;
    totalLatencyMs: number;
    chunksSearched: number;
  };
  timestamp: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'hr_admin' | 'guest';
  department: string;
}

interface PolicyDocument {
  docId: string;
  title: string;
  filename: string;
  owner: string;
  version: string;
  chunkCount: number;
  samplePreview: string;
}

export default function HRRAGChatApp() {
  const router = useRouter();
  
  // Public user state by default (no forced login)
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'guest_user',
    name: 'Workplace Visitor',
    email: 'visitor@northstar.example',
    role: 'guest',
    department: 'General Staff',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Active view tab: 'chat' | 'library' | 'admin'
  const [activeTab, setActiveTab] = useState<'chat' | 'library' | 'admin'>('chat');

  // Quick Admin Login Modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@northstar.example');
  const [adminPassword, setAdminPassword] = useState('AdminPassword2026!');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content:
        "Hi there! 👋 I'm your Sukkur IBA University (SIBAU) HR Advisor, here to walk you through our official **2018 Employee Handbook**.\n\nYou can ask me detailed questions about **Earned Leave (30 days), Casual & Sick leave, Laptop & Vehicle loans, PhD/MS qualification allowances, Tuition fee waivers, Provident Fund & Gratuity, or Campus Transport & Carry Bolan emergency service**.\n\nFeel free to ask naturally in **English, Urdu (اردو), Roman Urdu, or Sindhi (سنڌي)**. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Documents & Library state
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [kbStats, setKbStats] = useState<any>(null);

  // Ingest form state (HR Admin)
  const [newTitle, setNewTitle] = useState('');
  const [newDocId, setNewDocId] = useState('SIBAU-POL-NEW');
  const [newOwner, setNewOwner] = useState('Registrar Office');
  const [newSection, setNewSection] = useState('General Rules');
  const [newContent, setNewContent] = useState('');
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestFeedback, setIngestFeedback] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Multilingual SIBAU quick suggestions
  const suggestedQuestions = [
    { label: '🇬🇧 Earned Leave & Encashment?', query: 'How many days of Earned Leave do employees receive, and what are the encashment rules for non-teaching staff?' },
    { label: '🇬🇧 Laptop Loan for Faculty?', query: 'What is the amount and repayment term for the Faculty Laptop Loan policy?' },
    { label: '🇬🇧 PhD & MS Allowances?', query: 'How much are the monthly qualification allowances for PhD and MS/MPhil degrees at Sukkur IBA?' },
    { label: '🇬🇧 Night Emergency Transport?', query: 'What is the procedure for availing the Carry Bolan emergency transport facility at night?' },
    { label: '🇵🇰 سالانہ چھٹیاں اور رولز؟', query: 'سکھر آئی بی اے یونیورسٹی میں سالانہ چھٹیاں کتنی ملتی ہیں اور ان کے کیا قواعد ہیں؟' },
    { label: '🇵🇰 کار لون کی کیا شرائط ہیں؟', query: 'ایمپلائز وہیکل لون اسکیم کے تحت کون اہل ہے اور لون کی واپسی کے کیا اصول ہیں؟' },
    { label: '🇵🇰 Tuition fee waiver policy?', query: 'SIBAU mein employees aur unke siblings ke liye tuition fee concession ki kya policy hai?' },
    { label: '🇵🇰 Biometric attendance late rules?', query: 'Subah late anay par biometric attendance machine par kitni leave ya salary deduct hoti hai?' },
  ];

  // Check auth session silently (does not block public users!)
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
            setIsAuthenticated(true);
          }
        }
      } catch {
        // Keep guest mode
      }
    }
    checkAuth();
  }, []);

  // Load public policy directory
  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await fetch('/api/documents');
        if (res.ok) {
          const data = await res.json();
          setDocuments(data.documents || []);
          setKbStats(data.stats || null);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    }
    loadDocs();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser({
      id: 'guest_user',
      name: 'Workplace Visitor',
      email: 'visitor@northstar.example',
      role: 'guest',
      department: 'General Staff',
    });
    setIsAuthenticated(false);
    setActiveTab('chat');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginLoading(true);
    setAdminLoginError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setCurrentUser(data.user);
      setIsAuthenticated(true);
      setShowAdminModal(false);
      setActiveTab('admin');
    } catch (err: any) {
      setAdminLoginError(err.message);
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const question = (textToSend || inputValue).trim();
    if (!question || isSending) return;

    setInputValue('');
    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch response.');
      }

      const assistantMsg: Message = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        citations: data.citations,
        metrics: data.metrics,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Inquiry Notification**: ${err.message}\n\nPlease try again or reach out directly to People Operations at \`peopleops@northstar.example\`.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleIngestNewPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIngestLoading(true);
    setIngestFeedback(null);

    try {
      const res = await fetch('/api/documents/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          docId: newDocId,
          owner: newOwner,
          section: newSection,
          content: newContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to ingest');

      setIngestFeedback(`✅ Success: ${data.message}`);
      setNewTitle('');
      setNewContent('');

      // Refresh doc list
      const docsRes = await fetch('/api/documents');
      if (docsRes.ok) {
        const d = await docsRes.json();
        setDocuments(d.documents || []);
        setKbStats(d.stats || null);
      }
    } catch (err: any) {
      setIngestFeedback(`❌ Error: ${err.message}`);
    } finally {
      setIngestLoading(false);
    }
  };

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      d.docId.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchDocQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Top Enterprise Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">Sukkur IBA University</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SIBAU HR Bot
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Employee Handbook 2018 (118 Pages) &bull; Powered by Gemini 3.1 Flash Lite (Backup: 3.5)
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'library'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Policies</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
              {documents.length || 20}
            </span>
          </button>

          {currentUser?.role === 'hr_admin' ? (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Admin</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="HR Admin Login"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin Login</span>
            </button>
          )}
        </div>

        {/* User status & Logout */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  currentUser?.role === 'hr_admin'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                {currentUser?.name} ({currentUser?.role === 'hr_admin' ? 'HR Admin' : 'Employee'})
              </span>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium text-slate-700">Open Public Access</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* ================= CHAT TAB ================= */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-3 sm:p-4 overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-2 space-y-4 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl px-5 py-4 shadow-sm border ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white border-indigo-700 rounded-tr-none'
                        : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-3 mb-2 text-[11px] opacity-75">
                      <span className="font-semibold flex items-center gap-1.5">
                        {msg.role === 'user' ? (
                          <>
                            <User className="w-3.5 h-3.5" /> You
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Sukkur IBA HR Advisor
                          </>
                        )}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Content */}
                    <div className="text-sm leading-relaxed whitespace-pre-line font-normal space-y-2">
                      {msg.content}
                    </div>

                    {/* Assistant Extra: Citations & Performance Metrics */}
                    {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                          <span className="flex items-center gap-1.5 text-indigo-700">
                            <BookOpen className="w-3.5 h-3.5" /> Official Policy Citations ({msg.citations.length})
                          </span>
                          {msg.metrics && (
                            <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-500" />
                              {msg.metrics.totalLatencyMs}ms
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          {msg.citations.map((c) => (
                            <div
                              key={c.id}
                              className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs transition-colors hover:bg-slate-100"
                            >
                              <div
                                onClick={() =>
                                  setExpandedCitationId(
                                    expandedCitationId === c.id ? null : c.id
                                  )
                                }
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px]">
                                    {c.docId}
                                  </span>
                                  <span className="font-medium text-slate-800">
                                    {c.docTitle} &bull; <span className="text-slate-500">{c.section}</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-emerald-600 font-semibold">
                                    {Math.round(c.score * 100)}% match
                                  </span>
                                  {expandedCitationId === c.id ? (
                                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </div>
                              </div>

                              {expandedCitationId === c.id && (
                                <div className="mt-2.5 pt-2 border-t border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                                  <p className="font-semibold text-slate-700 mb-1">Official Policy Text:</p>
                                  <p className="italic bg-white p-2.5 rounded-lg border border-slate-200">
                                    "{c.snippet}"
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-1.5">Department: {c.owner}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Copy action */}
                    {msg.role === 'assistant' && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">Copied to clipboard</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy answer</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex items-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center space-x-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></div>
                    <span className="text-xs text-slate-600 font-medium">
                      Consulting official company policies and phrasing response...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Multilingual Suggestion Chips */}
            <div className="py-2 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
              {suggestedQuestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.query)}
                  disabled={isSending}
                  className="text-xs bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm shrink-0 disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm flex items-end gap-2 mt-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask any question in English, Urdu (اردو), Spanish, etc. (e.g. annual leave, remote policy, payroll)..."
                rows={1}
                className="flex-1 resize-none border-0 focus:ring-0 focus:outline-none p-2 text-sm text-slate-800 placeholder-slate-400"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isSending}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white p-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:shadow-none shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= POLICY LIBRARY TAB ================= */}
        {activeTab === 'library' && (
          <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Official Company Policies</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Search and inspect the 20 indexed policies governing Northstar Digital Services.
                </p>
              </div>

              {/* Search box */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchDocQuery}
                  onChange={(e) => setSearchDocQuery(e.target.value)}
                  placeholder="Filter by title or ID..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.docId}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                        {doc.docId}
                      </span>
                      <span className="text-xs text-slate-400">v{doc.version}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">{doc.title}</h3>
                    <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      Owner: {doc.owner}
                    </p>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic leading-relaxed">
                      "{doc.samplePreview}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {doc.chunkCount} vector chunks
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('chat');
                        handleSendMessage(`Please provide a concise overview of policy ${doc.docId}: ${doc.title}`);
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Ask AI</span>
                      <Sparkles className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ADMIN TAB ================= */}
        {activeTab === 'admin' && currentUser?.role === 'hr_admin' && (
          <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">HR Knowledge Base Administration</h2>
                <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold">
                  HR Admin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage corporate document embeddings, view vector telemetry, and ingest new HR policies.
              </p>
            </div>

            {/* System Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Total Policies</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{kbStats?.totalDocuments || 20}</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Active in RAG</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Vector Chunks</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{kbStats?.totalChunks || 28}</p>
                <span className="text-[10px] text-slate-400">Semantic segments</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Embedding Model</span>
                <p className="text-xs font-bold text-slate-900 mt-1 truncate">gemini-embedding-001</p>
                <span className="text-[10px] text-indigo-600 font-semibold">{kbStats?.embeddingDim || 3072} dimensions</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Chat Model</span>
                <p className="text-xs font-bold text-slate-900 mt-1">gemini-3.8-flash</p>
                <span className="text-[10px] text-purple-600 font-semibold">Multilingual Refusal Mode</span>
              </div>
            </div>

            {/* Ingest Policy Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                Ingest & Embed New Company Policy
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Instantly embed a new policy into the active vector index using the Gemini embedding model.
              </p>

              {ingestFeedback && (
                <div
                  className={`mb-4 p-3 rounded-lg text-xs font-semibold ${
                    ingestFeedback.startsWith('✅')
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {ingestFeedback}
                </div>
              )}

              <form onSubmit={handleIngestNewPolicy} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Policy Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Employee Wellness Program"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Document ID
                    </label>
                    <input
                      type="text"
                      required
                      value={newDocId}
                      onChange={(e) => setNewDocId(e.target.value)}
                      placeholder="e.g. HR-022"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Owner Department
                    </label>
                    <input
                      type="text"
                      value={newOwner}
                      onChange={(e) => setNewOwner(e.target.value)}
                      placeholder="People Operations"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Section Name
                    </label>
                    <input
                      type="text"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      placeholder="e.g. Health Reimbursement"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Policy Content / Text
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Enter policy guidelines here..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={ingestLoading}
                    className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-indigo-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {ingestLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Embed & Ingest Policy</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Admin Login Modal (Optional popup only when admin clicks) */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">HR Admin Access</h3>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Sign in as an administrator to ingest documents or re-embed policy vectors.
            </p>

            {adminLoginError && (
              <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {adminLoginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="w-1/2 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminLoginLoading}
                  className="w-1/2 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-1"
                >
                  {adminLoginLoading ? 'Verifying...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
