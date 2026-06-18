export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  text: string;
  date: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  offeredSkills: string[];
  wantedSkills: string[];
  location: string;
  currentCredits: number;
  completedSessions: number;
  rating: number;
  reviews: Review[];
}

export interface CommunityMember {
  id: string;
  name: string;
  bio: string;
  offeredSkills: string[];
  wantedSkills: string[];
  location: string;
  rating: number;
  completedSessions: number;
  avatarSeed: string;
}

export interface CreditLedgerEntry {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  date: string;
}

export interface MatchResult {
  name: string;
  avatarSeed: string;
  offeredSkills: string[];
  wantedSkills: string[];
  matchScore: number;
  whyGoodMatch: string;
  location: string;
  rating: number;
  completedSessions: number;
}

export interface SkillSuggestion {
  skillName: string;
  whyUseful: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface ReviewsAnalysis {
  summary: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  strengths: string[];
  concerns: string[];
}

export interface GrowthTip {
  title: string;
  explanation: string;
  category: 'profile' | 'credits' | 'matching';
}

export interface AIAnalysisResponse {
  matches: MatchResult[];
  skillsToLearn: SkillSuggestion[];
  reviewsAnalysis: ReviewsAnalysis;
  growthTips: GrowthTip[];
}
