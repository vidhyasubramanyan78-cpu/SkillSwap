import React, { useState, useEffect } from 'react';
import { SAMPLE_PROFILES, COMMUNITY_MEMBERS, INITIAL_LEDGER } from './data';
import { UserProfile, MatchResult, SkillSuggestion, ReviewsAnalysis, GrowthTip, CreditLedgerEntry } from './types';
import Ledger from './components/Ledger';
import Matchmaker from './components/Matchmaker';
import SkillSuggestions from './components/SkillSuggestions';
import { 
  Sparkles, 
  Settings, 
  HelpCircle, 
  ShieldCheck, 
  Star, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  X,
  RefreshCw,
  Award,
  BookOpen,
  ArrowRight,
  User,
  Activity,
  ThumbsUp,
  Flame,
  Search,
  MessageSquare
} from 'lucide-react';

export default function App() {
  // Profiles state
  const [profiles, setProfiles] = useState<UserProfile[]>(SAMPLE_PROFILES);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);
  const activeProfile = profiles[selectedProfileIndex];

  // Ledger state associated with the active profile
  const [profileLedgers, setProfileLedgers] = useState<Record<string, CreditLedgerEntry[]>>({
    "Sarah Miller": [...INITIAL_LEDGER],
    "Marcus Laurent": [
      {
        id: "ml-1",
        type: "earn",
        amount: 2,
        description: "Simulated: Taught 'Bread Making' to Sophia Martinez",
        date: "2026-06-15"
      },
      {
        id: "ml-2",
        type: "spend",
        amount: 1,
        description: "Simulated: Learned 'Figma Prototyping' from Sophia Martinez",
        date: "2026-06-11"
      }
    ],
    "Lila Chen": [
      {
        id: "lc-1",
        type: "earn",
        amount: 3,
        description: "Simulated: Taught 'Mindfulness Meditation' to Mia Thorne",
        date: "2026-06-16"
      }
    ]
  });

  // Current ledger list for active profile
  const currentLedger = profileLedgers[activeProfile.name] || [];

  // Edit fields for active Profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedBio, setEditedBio] = useState(activeProfile.bio);
  const [newOfferedSkill, setNewOfferedSkill] = useState('');
  const [newWantedSkill, setNewWantedSkill] = useState('');
  const [currentOfferedList, setCurrentOfferedList] = useState<string[]>(activeProfile.offeredSkills);
  const [currentWantedList, setCurrentWantedList] = useState<string[]>(activeProfile.wantedSkills);

  // AI analysis results state
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [skillsToLearn, setSkillsToLearn] = useState<SkillSuggestion[]>([]);
  const [reviewsAnalysis, setReviewsAnalysis] = useState<ReviewsAnalysis | null>(null);
  const [growthTips, setGrowthTips] = useState<GrowthTip[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Success state for simulated communication
  const [chatPartner, setChatPartner] = useState<MatchResult | null>(null);
  const [showChatConfirmation, setShowChatConfirmation] = useState(false);

  // Add new skill modal/form states
  const [isAddingSuggestedSkill, setIsAddingSuggestedSkill] = useState(false);

  // Sync edit form fields when active user changes
  useEffect(() => {
    setEditedBio(activeProfile.bio);
    setCurrentOfferedList(activeProfile.offeredSkills);
    setCurrentWantedList(activeProfile.wantedSkills);
    // Clear old AI recommendations so they don't look state or stale, and auto-fetch or advise retrieval
    setMatches([]);
    setSkillsToLearn([]);
    setReviewsAnalysis(null);
    setGrowthTips([]);
    setApiError(null);
  }, [selectedProfileIndex]);

  // Handle auto-retrieving recommendations on first load
  useEffect(() => {
    triggerAiAnalysis();
  }, [selectedProfileIndex]);

  // Request analysis from local express API endpoint
  const triggerAiAnalysis = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            ...activeProfile,
            // supply latest state
            bio: editedBio,
            offeredSkills: currentOfferedList,
            wantedSkills: currentWantedList,
          },
          communityMembers: COMMUNITY_MEMBERS
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Fail to interact with backend server.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMatches(data.matches || []);
      setSkillsToLearn(data.skillsToLearn || []);
      setReviewsAnalysis(data.reviewsAnalysis || null);
      setGrowthTips(data.growthTips || []);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Error occurred while contacting Gemini AI engine.');
    } finally {
      setIsLoading(false);
    }
  };

  // Profile save helper
  const handleSaveProfile = () => {
    const updated = [...profiles];
    updated[selectedProfileIndex] = {
      ...activeProfile,
      bio: editedBio,
      offeredSkills: currentOfferedList,
      wantedSkills: currentWantedList
    };
    setProfiles(updated);
    setIsEditingProfile(false);
    // Auto re-analyze with the new traits
    triggerAiAnalysis();
  };

  // Add & delete skills handler
  const addOfferedSkill = () => {
    if (newOfferedSkill.trim() && !currentOfferedList.includes(newOfferedSkill.trim())) {
      setCurrentOfferedList([...currentOfferedList, newOfferedSkill.trim()]);
      setNewOfferedSkill('');
    }
  };

  const removeOfferedSkill = (index: number) => {
    setCurrentOfferedList(currentOfferedList.filter((_, i) => i !== index));
  };

  const addWantedSkill = () => {
    if (newWantedSkill.trim() && !currentWantedList.includes(newWantedSkill.trim())) {
      setCurrentWantedList([...currentWantedList, newWantedSkill.trim()]);
      setNewWantedSkill('');
    }
  };

  const removeWantedSkill = (index: number) => {
    setCurrentWantedList(currentWantedList.filter((_, i) => i !== index));
  };

  // Transaction Ledger handlers
  const handleAddTransaction = (type: 'earn' | 'spend', amount: number, description: string) => {
    const newEntry: CreditLedgerEntry = {
      id: `l-${Date.now()}`,
      type,
      amount,
      description,
      date: new Date().toISOString().split('T')[0]
    };

    // Update active profile ledger history
    const userLedger = currentLedger;
    const updatedLedgers = {
      ...profileLedgers,
      [activeProfile.name]: [newEntry, ...userLedger]
    };
    setProfileLedgers(updatedLedgers);

    // Update active profile credit balances
    const updatedProfiles = [...profiles];
    const target = updatedProfiles[selectedProfileIndex];
    const pointsDelta = type === 'earn' ? amount : -amount;
    
    // Prevent underflow
    const calculatedCredits = Math.max(0, target.currentCredits + pointsDelta);
    const updatedSessions = target.completedSessions + 1;

    updatedProfiles[selectedProfileIndex] = {
      ...target,
      currentCredits: calculatedCredits,
      completedSessions: updatedSessions
    };
    setProfiles(updatedProfiles);
  };

  // Initiate Chat action (1hr credit reservation placeholder)
  const handleConnect = (partner: MatchResult) => {
    setChatPartner(partner);
    setShowChatConfirmation(true);
  };

  const confirmChatConnection = () => {
    if (activeProfile.currentCredits < 1) {
      alert("You don't have enough time credits to reserve a chat session right now! Teach a session first or request help.");
      setShowChatConfirmation(false);
      return;
    }
    // Deduct 1 hour time credit for initiating the connection match
    handleAddTransaction(
      'spend', 
      1, 
      `Reserved 1-hour swap holding space with ${chatPartner?.name} for '${chatPartner?.offeredSkills[0] || 'Skill Swap'}'`
    );
    setShowChatConfirmation(false);
  };

  // Helper to append a recommended skill directly to Wanted Skills
  const handleAddSuggestedToWanted = (skillName: string) => {
    if (!currentWantedList.includes(skillName)) {
      const updatedWanted = [...currentWantedList, skillName];
      setCurrentWantedList(updatedWanted);
      
      const updated = [...profiles];
      updated[selectedProfileIndex] = {
        ...activeProfile,
        wantedSkills: updatedWanted
      };
      setProfiles(updated);
      
      // Flash a mini notification through re-triggering AI setup
      triggerAiAnalysis();
    }
  };

  return (
    <div id="skillswap-intelligence-app" className="min-h-screen bg-[#F1F5F9] text-slate-800 font-sans flex flex-col antialiased">
      
      {/* Top Banner Warning or Notice if Key is missing */}
      {apiError && (
        <div id="secret-notice-banner" className="bg-amber-600 text-white text-xs font-medium px-4 py-3 flex items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-100" />
            <span>
              {apiError.includes("GEMINI_API_KEY") 
                ? "💡 AI Engine Offline: To enable live Gemini pairing & path generation, configure your 'GEMINI_API_KEY' in the Secrets Panel." 
                : `Notice: ${apiError}`}
            </span>
          </div>
          <button 
            onClick={() => setApiError(null)} 
            className="hover:bg-amber-700 p-1 rounded-sm text-amber-200 hover:text-white transition-all text-xs font-bold"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col space-y-4">
        
        {/* Modern Bento Header bar */}
        <header id="app-header" className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-xs">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">SkillSwap Intelligence</h1>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-100">AI Core v3.5-Flash</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                <span>Active Profile:</span>
                <span className="font-semibold text-indigo-600 flex items-center gap-0.5">
                  <User className="h-3 w-3 inline" />
                  {activeProfile.name}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400 font-mono text-[11px]">{activeProfile.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
            {/* Quick Balance Status display matching the theme input representation */}
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Time Balance</p>
              <div className="flex items-center gap-1 justify-end">
                <span id="header-credits-count" className="text-xl font-mono font-black text-slate-900 leading-none">
                  {activeProfile.currentCredits}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">CREDITS</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>

            {/* Profile Switcher Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {profiles.map((p, idx) => (
                <button
                  key={p.name}
                  id={`btn-switch-user-${p.name.split(' ')[0].toLowerCase()}`}
                  onClick={() => setSelectedProfileIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    idx === selectedProfileIndex
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Direct Re-trigger option */}
            <button
              onClick={triggerAiAnalysis}
              disabled={isLoading}
              className="p-2 text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Re-run AI evaluation engines"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Outer Bento Grid */}
        <div id="bento-dashboard-grid" className="grid grid-cols-12 gap-4">
          
          {/* Left Area: Profile Details and Time Credit Ledger (col-span-4) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            
            {/* Bento Card: User profile Card */}
            <div id="user-profile-bento-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Award className="h-4 w-4 text-emerald-600" />
                    <span>Your Trading Card</span>
                  </h3>
                  <button
                    id="btn-edit-active-profile"
                    onClick={() => {
                      setIsEditingProfile(!isEditingProfile);
                      // load values
                      setEditedBio(activeProfile.bio);
                      setCurrentOfferedList(activeProfile.offeredSkills);
                      setCurrentWantedList(activeProfile.wantedSkills);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <Settings className="h-3 w-3" />
                    {isEditingProfile ? 'Cancel' : 'Manage Skills'}
                  </button>
                </div>

                {isEditingProfile ? (
                  /* Live In-App Editor */
                  <div className="space-y-3.5 border-t border-slate-100 pt-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Introduction Bio</label>
                      <textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        rows={3}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                      />
                    </div>

                    {/* Offered skills editor list with input adders */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">I offer to Teach:</label>
                      <div className="flex gap-1.5 mb-1.5">
                        <input
                          type="text"
                          placeholder="e.g. Next.js, Cooking"
                          value={newOfferedSkill}
                          onChange={(e) => setNewOfferedSkill(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOfferedSkill(); }}}
                          className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded"
                        />
                        <button
                          type="button"
                          onClick={addOfferedSkill}
                          className="bg-slate-150 hover:bg-slate-250 border border-slate-200 px-2 py-1 rounded text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {currentOfferedList.map((sk, index) => (
                          <span key={index} className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 py-0.5 rounded">
                            {sk}
                            <button type="button" onClick={() => removeOfferedSkill(index)} className="text-emerald-600 hover:text-emerald-950">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Wanted skills editor list with input adders */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">I want to Learn:</label>
                      <div className="flex gap-1.5 mb-1.5">
                        <input
                          type="text"
                          placeholder="e.g. Conversational French"
                          value={newWantedSkill}
                          onChange={(e) => setNewWantedSkill(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addWantedSkill(); }}}
                          className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded"
                        />
                        <button
                          type="button"
                          onClick={addWantedSkill}
                          className="bg-slate-150 hover:bg-slate-250 border border-slate-200 px-2 py-1 rounded text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {currentWantedList.map((sk, index) => (
                          <span key={index} className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-100 px-1.5 py-0.5 rounded">
                            {sk}
                            <button type="button" onClick={() => removeWantedSkill(index)} className="text-indigo-600 hover:text-indigo-950">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      id="btn-save-edited-profile"
                      onClick={handleSaveProfile}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Save Profile & Recalculate
                    </button>
                  </div>
                ) : (
                  /* Standard Read-Only Profile display */
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-800 text-lg">
                        {activeProfile.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{activeProfile.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold bg-amber-50 px-1 py-0.2 rounded">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {activeProfile.rating.toFixed(1)}
                          </span>
                          <span>•</span>
                          <span>{activeProfile.completedSessions} Sessions Finished</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed italic border border-slate-100/70">
                      &ldquo;{activeProfile.bio}&rdquo;
                    </p>

                    <div>
                      <h5 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">Skills I share</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProfile.offeredSkills.map((sk, idx) => (
                          <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">Skills I seek</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProfile.wantedSkills.map((sk, idx) => (
                          <span key={idx} className="bg-indigo-50 text-indigo-800 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Self-Sovereign Identity verified
                </span>
                <span className="font-mono">P2P v4.2</span>
              </div>
            </div>

            {/* Time credits ledger component */}
            <Ledger 
              credits={activeProfile.currentCredits}
              completedSessions={activeProfile.completedSessions}
              ledger={currentLedger}
              onAddTransaction={handleAddTransaction}
              offeredSkills={activeProfile.offeredSkills}
              wantedSkills={activeProfile.wantedSkills}
            />

          </div>

          {/* Right Area: Dynamic Bento Grid Panels (col-span-8) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
            
            {/* Grid structure matching bento card layout: Peer Matchmaking & Reviews Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Top 5 Peer Matches: Col-span-7 row-span-4 equivalent */}
              <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <Matchmaker 
                    matches={matches} 
                    onConnect={handleConnect} 
                    isLoading={isLoading} 
                  />
                </div>
              </div>

              {/* Col-span-5 area for Review Trust Analysis & Growth Strategy */}
              <div className="md:col-span-5 flex flex-col gap-4">
                
                {/* Trust & Reviews analysis: Row-span-2 equivalent */}
                <div id="reviews-analysis-bento-card" className="bg-indigo-900 text-white rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  {/* Decorative background circle */}
                  <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-800 rounded-full translate-x-8 -translate-y-8 opacity-30 pointer-events-none"></div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                        <span>★ Trust & Review Analysis</span>
                      </h2>
                      {reviewsAnalysis && (
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          reviewsAnalysis.sentiment === 'Positive' 
                            ? 'bg-emerald-555 text-white' 
                            : 'bg-amber-500 text-slate-900'
                        }`}>
                          {reviewsAnalysis.sentiment}
                        </span>
                      )}
                    </div>

                    {isLoading ? (
                      <div className="space-y-3 py-4 animate-pulse">
                        <div className="h-6 bg-indigo-850 rounded w-1/3"></div>
                        <div className="h-4 bg-indigo-850 rounded w-full"></div>
                        <div className="h-4 bg-indigo-850 rounded w-5/6"></div>
                      </div>
                    ) : reviewsAnalysis ? (
                      <div>
                        {/* Rating Display */}
                        <div className="flex items-baseline space-x-2 mt-2">
                          <p id="sentiment-header-txt" className="text-2xl font-black">{reviewsAnalysis.sentiment} Sentiment</p>
                          <p className="text-xl font-mono font-bold text-amber-300 flex items-center gap-0.5">
                            {activeProfile.rating.toFixed(1)}
                            <span className="text-xs font-normal text-indigo-200">/5</span>
                          </p>
                        </div>
                        
                        <p className="text-xs text-indigo-100 mt-2.5 leading-relaxed italic">
                          &ldquo;{reviewsAnalysis.summary}&rdquo;
                        </p>

                        <div className="mt-4 space-y-1.5">
                          <div id="review-strengths-wrap" className="flex flex-wrap gap-1">
                            {reviewsAnalysis.strengths.slice(0, 3).map((st, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white/10 hover:bg-white/15 rounded text-[10px] font-semibold text-white">
                                ✓ {st}
                              </span>
                            ))}
                          </div>
                          
                          {reviewsAnalysis.concerns && reviewsAnalysis.concerns.length > 0 && (
                            <div id="review-issues-wrap" className="text-[10px] text-indigo-200 flex items-start gap-1 p-1 bg-black/10 rounded">
                              <AlertCircle className="h-3 w-3 inline text-amber-400 shrink-0 mt-0.5" />
                              <span>
                                Needs attention: <span className="text-amber-300 font-medium">{reviewsAnalysis.concerns.join(', ')}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-indigo-200 text-xs text-slate-350">
                        No trust metrics analysis retrieved yet.
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-indigo-300 mt-4 pt-2 border-t border-indigo-805 flex justify-between">
                    <span>Aggregated from {activeProfile.reviews.length} reviews</span>
                    <span className="font-semibold text-emerald-400">Verified Trust</span>
                  </div>
                </div>

                {/* Growth Strategy: Row-span-2 equivalent */}
                <div id="growth-strategy-bento-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <span>Growth Recommendation Strategy</span>
                    </h2>

                    {isLoading ? (
                      <div className="space-y-3 py-4 animate-pulse">
                        <div className="h-10 bg-slate-100 rounded w-full"></div>
                        <div className="h-10 bg-slate-100 rounded w-full border-t border-slate-50"></div>
                      </div>
                    ) : growthTips.length > 0 ? (
                      <ul className="space-y-3">
                        {growthTips.slice(0, 3).map((tip, index) => {
                          // Circle identifier backdrops
                          const badgeBg = index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700';

                          return (
                            <li key={index} className="flex items-start">
                              <div className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0 ${badgeBg}`}>
                                {index + 1}
                              </div>
                              <div className="ml-3">
                                <p className="text-xs font-bold text-slate-900 leading-tight">{tip.title}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{tip.explanation}</p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="py-8 text-center text-gray-400 text-xs">
                        No recommendations generated. Get advice above!
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Tailored growth advice</span>
                    <span className="text-indigo-600 font-bold hover:underline cursor-pointer" onClick={triggerAiAnalysis}>Refresh</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Curated Learning Roadmap: Col-span-12 Row-span-2 equivalent */}
            <div id="learning-roadmap-bento-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
                    <span>Curated Learning Roadmap</span>
                  </h2>
                  <p className="text-[10px] text-slate-500">Suggested skills dynamically mapped to your background</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-sm text-slate-600 font-bold">
                    TAILORED ROADMAP
                  </span>
                </div>
              </div>

              <SkillSuggestions 
                suggestions={skillsToLearn} 
                isLoading={isLoading} 
              />
            </div>

          </div>

        </div>

        {/* Footer Area with security indicators and credentials */}
        <footer id="app-footer" className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-medium px-2 py-4 italic gap-2">
          <div className="flex items-center gap-1">
            <span>● End-to-End Encrypted Peer Matching</span>
            <span>•</span>
            <span className="text-indigo-500">SkillSwap Secure Sandbox Active</span>
          </div>
          <div>© 2026 SkillSwap Intelligence v4.2.0 • Created using Gemini API</div>
        </footer>

      </div>

      {/* Connection confirmation modal */}
      {showChatConfirmation && chatPartner && (
        <div id="chat-modal-overlay" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div id="chat-modal-card" className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-sm w-full p-5 animate-scale-up">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1 mb-2">
              <MessageSquare className="h-4.5 w-4.5 text-indigo-600" />
              <span>Confirm Instant Match Chat</span>
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              You are initiating a direct exchange proposal with <strong className="text-slate-900">{chatPartner.name}</strong> from <strong className="text-slate-900">{chatPartner.location}</strong>. 
              This will lock <strong className="text-indigo-600">1 Time Credit</strong> of credit in safety holding space. Once the 1-hour peer chat takes place, the credits are finalized.
            </p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Your current balance:</span>
                <span className="font-bold text-slate-900">{activeProfile.currentCredits} credits</span>
              </div>
              <div className="flex justify-between text-[11px] border-t border-slate-200/50 pt-1.5">
                <span className="text-slate-500">Cost of initiation:</span>
                <span className="font-bold text-indigo-600">-1 credit</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowChatConfirmation(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              >
                No, cancel
              </button>
              <button
                type="button"
                onClick={confirmChatConnection}
                className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Accept and Connect
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
