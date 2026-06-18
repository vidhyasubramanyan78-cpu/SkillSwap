import { UserProfile, CommunityMember, CreditLedgerEntry } from './types';

export const SAMPLE_PROFILES: UserProfile[] = [
  {
    name: "Sarah Miller",
    bio: "Full-stack developer who loves building web apps but wants to find calm in yoga and speak beautiful French for an upcoming trip.",
    offeredSkills: ["React", "TypeScript", "Tailwind CSS", "Technical Writing"],
    wantedSkills: ["Yoga Basics", "French Conversation", "Acoustic Guitar"],
    location: "San Francisco, CA",
    currentCredits: 4,
    completedSessions: 14,
    rating: 4.9,
    reviews: [
      {
        id: "r1",
        reviewerName: "Alex Rivera",
        rating: 5,
        text: "Sarah is a fantastic teacher! She explained React hooks so clearly with easy analogies. In return, I taught her guitar tuning.",
        date: "2026-05-10"
      },
      {
        id: "r2",
        reviewerName: "Chloe Dubois",
        rating: 5,
        text: "Super responsive and patient during our technical writing session. Would highly recommend exchanging skills with her!",
        date: "2026-04-22"
      },
      {
        id: "r3",
        reviewerName: "Ethan Carter",
        rating: 4.8,
        text: "Great experience. Sometimes we ran over time by 10 minutes because we got excited about CSS grid, but overall super helpful.",
        date: "2026-04-05"
      }
    ]
  },
  {
    name: "Marcus Laurent",
    bio: "Parisian home cook living in New York. Eager to teach authentic French and gourmet bread making, while mastering Figma and music theory.",
    offeredSkills: ["French Conversation", "Bread Making", "Gourmet Sauce Basics", "French Pronunciation"],
    wantedSkills: ["Figma UI Design", "Music Theory", "Acoustic Guitar", "React"],
    location: "New York, NY",
    currentCredits: 2,
    completedSessions: 8,
    rating: 4.7,
    reviews: [
      {
        id: "r4",
        reviewerName: "Sophia Martinez",
        rating: 5,
        text: "Marcus taught me how to make active sourdough starter. He is energetic and incredibly knowledgeable about French culture!",
        date: "2026-06-02"
      },
      {
        id: "r5",
        reviewerName: "Alex Rivera",
        rating: 4,
        text: "The bread session was amazing, but sometimes it felt a little hurried. He knows his stuff, and I got a delicious loaf out of it.",
        date: "2026-05-15"
      }
    ]
  },
  {
    name: "Lila Chen",
    bio: "Certified Hatha yoga teacher and brand identity strategist. Looking to learn gourmet pastry techniques, SEO, and iOS Swift programming.",
    offeredSkills: ["Yoga Basics", "Mindfulness Meditation", "Brand Strategy", "Logos & Vector Design"],
    wantedSkills: ["Bread Making", "SEO Optimization", "Swift UI", "Gourmet Sauce Basics"],
    location: "Vancouver, BC",
    currentCredits: 5,
    completedSessions: 22,
    rating: 4.9,
    reviews: [
      {
        id: "r6",
        reviewerName: "Mia Thorne",
        rating: 5,
        text: "Lila has a beautiful soothing voice. Her mindfulness meditation session helped me overcome work anxiety. Perfect match!",
        date: "2026-06-11"
      },
      {
        id: "r7",
        reviewerName: "Ethan Carter",
        rating: 5,
        text: "I learned so much about structuring my brand. She goes above and beyond to provide templates and guides.",
        date: "2026-05-20"
      },
      {
        id: "r8",
        reviewerName: "Kenji Tanaka",
        rating: 4.5,
        text: "Highly intuitive teacher, but booking was slightly difficult due to conflicting time zones. Highly recommend her once we connected!",
        date: "2026-05-01"
      }
    ]
  }
];

export const COMMUNITY_MEMBERS: CommunityMember[] = [
  {
    id: "m1",
    name: "Alex Rivera",
    bio: "Classical guitarist and bedroom music producer. Teach acoustic guitar, music theory, and audio editing.",
    offeredSkills: ["Acoustic Guitar", "Music Theory", "Audio Editing", "Songwriting"],
    wantedSkills: ["React", "TypeScript", "Tailwind CSS", "Logos & Vector Design"],
    location: "San Francisco, CA",
    rating: 4.8,
    completedSessions: 16,
    avatarSeed: "alex"
  },
  {
    id: "m2",
    name: "Chloe Dubois",
    bio: "Creative writer from Lyon, France. Passionate about languages, literature, and intermediate conversational French.",
    offeredSkills: ["French Conversation", "French Pronunciation", "Creative Writing"],
    wantedSkills: ["Technical Writing", "Brand Strategy", "Mindfulness Meditation"],
    location: "Paris, France",
    rating: 4.9,
    completedSessions: 34,
    avatarSeed: "chloe"
  },
  {
    id: "m3",
    name: "Ethan Carter",
    bio: "Wellness coach and posture specialist. Helping remote workers optimize their physical health through basic yoga.",
    offeredSkills: ["Yoga Basics", "Posture Work", "Core Strength training"],
    wantedSkills: ["React", "Digital Marketing", "SEO Optimization"],
    location: "Los Angeles, CA",
    rating: 4.7,
    completedSessions: 19,
    avatarSeed: "ethan"
  },
  {
    id: "m4",
    name: "Sophia Martinez",
    bio: "Senior Product Designer at a fintech startup. I can teach Figma prototyping, UI audit, and user research.",
    offeredSkills: ["Figma UI Design", "Prototyping", "UI Auditing", "Career Coaching"],
    wantedSkills: ["French Conversation", "Bread Making", "Italian Gourmet Basics", "Acoustic Guitar"],
    location: "New York, NY",
    rating: 5.0,
    completedSessions: 28,
    avatarSeed: "sophia"
  },
  {
    id: "m5",
    name: "Mia Thorne",
    bio: "Growth marketer specializing in organic traffic and search engine rankings. Ready to boost your product visibility.",
    offeredSkills: ["SEO Optimization", "Digital Marketing", "Google Analytics", "Copywriting"],
    wantedSkills: ["Logos & Vector Design", "React", "Mindfulness Meditation"],
    location: "Seattle, WA",
    rating: 4.6,
    completedSessions: 11,
    avatarSeed: "mia"
  },
  {
    id: "m6",
    name: "Kenji Tanaka",
    bio: "Full-stack engineer & weekend home chef. Experienced in JavaScript, Python, Swift programming, and Japanese dashi making.",
    offeredSkills: ["Swift UI", "JavaScript", "Python Basics", "Japanese Cooking"],
    wantedSkills: ["Yoga Basics", "Mindfulness Meditation", "Gourmet Sauce Basics"],
    location: "Tokyo, Japan",
    rating: 4.9,
    completedSessions: 42,
    avatarSeed: "kenji"
  },
  {
    id: "m7",
    name: "Dr. Elena Rostova",
    bio: "Cognitive psychologist and productivity coach. I teach goal setting, focus habits, and academic writing.",
    offeredSkills: ["Academic Writing", "Time Management Tricks", "Focus & Sleep Habits"],
    wantedSkills: ["Figma UI Design", "Excel Macros", "Video Editing Basics"],
    location: "Berlin, Germany",
    rating: 4.8,
    completedSessions: 15,
    avatarSeed: "elena"
  },
  {
    id: "m8",
    name: "Oliver Smith",
    bio: "Expert barista and craft coffee educator. Teach latte art, sensory tasting classes, and home brewing.",
    offeredSkills: ["Home Coffee Brewing", "Latate Art", "Sensory Tasting"],
    wantedSkills: ["Spanish Conversation", "React", "Swift UI"],
    location: "Portland, OR",
    rating: 4.5,
    completedSessions: 9,
    avatarSeed: "oliver"
  },
  {
    id: "m9",
    name: "Isabella Rossi",
    bio: "Italian pasta artisan and bilingual translator. Offering authentic gourmet pasta workshops and Italian tutoring.",
    offeredSkills: ["Italian Gourmet Basics", "Pasta Making", "Italian Conversation"],
    wantedSkills: ["Figma UI Design", "Search Engine Optimization", "Technical Writing"],
    location: "Rome, Italy",
    rating: 4.9,
    completedSessions: 22,
    avatarSeed: "isabella"
  },
  {
    id: "m10",
    name: "Lucas Vance",
    bio: "Video production lead. Offering workshops in video editing, color grading in DaVinci Resolve, and lighting set.",
    offeredSkills: ["Video Editing Basics", "DaVinci Resolve Pro", "Lighting setup"],
    wantedSkills: ["French Pronunciation", "Time Management Tricks", "Brand Strategy"],
    location: "Chicago, IL",
    rating: 4.7,
    completedSessions: 13,
    avatarSeed: "lucas"
  }
];

export const INITIAL_LEDGER: CreditLedgerEntry[] = [
  {
    id: "l1",
    type: "earn",
    amount: 1,
    description: "Taught 'React State Management' (1hr session) to Alex Rivera",
    date: "2026-06-14"
  },
  {
    id: "l2",
    type: "spend",
    amount: 1,
    description: "Learned 'French Prepositions' (1hr session) from Chloe Dubois",
    date: "2026-06-12"
  },
  {
    id: "l3",
    type: "earn",
    amount: 1,
    description: "Taught 'Tailwind Grid Systems' (1hr session) to Ethan Carter",
    date: "2026-06-08"
  },
  {
    id: "l4",
    type: "spend",
    amount: 1,
    description: "Learned 'Vinyasa Flow' (1hr session) from Ethan Carter",
    date: "2026-06-05"
  }
];
