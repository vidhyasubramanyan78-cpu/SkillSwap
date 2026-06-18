import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy instantiation for Google Gen AI to prevent start-up failure if API key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (aiClient) return aiClient;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error('GEMINI_API_KEY is not configured in your Secrets panel. Please configure it to unlock AI matching.');
  }

  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  return aiClient;
}

// REST route for AI Brain Analysis matching & guidance
app.post('/api/analyze', async (req, res) => {
  try {
    const { profile, communityMembers } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'User profile has not been provided.' });
    }

    const client = getAiClient();

    // Construct the user data representation for the LLM
    const userOffered = profile.offeredSkills?.join(', ') || 'None';
    const userWanted = profile.wantedSkills?.join(', ') || 'None';
    const userLocation = profile.location || 'Unknown';
    const userBio = profile.bio || '';
    const userCompleted = profile.completedSessions || 0;
    const userRating = profile.rating || 5.0;

    const userReviewsStr = profile.reviews && profile.reviews.length > 0
      ? profile.reviews.map((r: any) => `Reviewer: ${r.reviewerName}, Rating: ${r.rating}/5, Words: "${r.text}"`).join('\n')
      : 'No reviews yet.';

    const communityListStr = communityMembers && communityMembers.length > 0
      ? communityMembers.map((m: any) => (
          `ID: ${m.id}, Name: ${m.name}, Location: ${m.location}, Bio: "${m.bio}", Offers: [${m.offeredSkills.join(', ')}], Wants: [${m.wantedSkills.join(', ')}], Rating: ${m.rating}, ActiveSessions: ${m.completedSessions}`
        )).join('\n\n')
      : 'No other community members.';

    const prompt = `
      You are the ultimate AI brain of a peer-to-peer time currency skill exchange platform called "SkillSwap".
      One hour of teaching earns 1 credit, and one hour of learning spends 1 credit.

      We have an active, living community of members looking to trade skills.
      Below is the detailed profile of the target User:
      - Name: ${profile.name}
      - Bio: "${userBio}"
      - Offered Skills: [${userOffered}]
      - Wanted Skills: [${userWanted}]
      - Location: ${userLocation}
      - Completed Sessions: ${userCompleted}
      - Avg Rating: ${userRating}
      - Current Credits: ${profile.currentCredits}

      Target User's Reviews:
      ${userReviewsStr}

      List of other Community Members:
      ${communityListStr}

      Based on these inputs, perform an intelligent and thorough matching and growth analysis:

      Task 1: Recommend the top 5 most suitable users for skill exchange.
      Analyze compatibility:
      - Do they offer what the target user wants?
      - Do they want what the target user offers (creating a direct bilateral exchange opportunity)?
      - Note their rating/trustworthiness level.
      - Take location closeness into account (e.g. if city name matches or is nearby, but do not exclude overseas remote pairs if internet teaching is viable).
      - Compute a precise match score out of 100 based on these criteria.
      - Choose a valid community member's name and avatarSeed (their avatarSeed is exactly their first name lowercase, e.g. "alex", "chloe", "ethan", "sophia", "mia", "kenji", "elena", "oliver", "isabella", "lucas").
      - Describe briefly and pragmatically why they are a compatible match.

      Task 2: Suggest 3 to 5 skills the user should learn next.
      Ensure advice is tailored to their career path or life growth, linked to their current offering or background. Avoid generic filler. Provide difficulty level and why it is useful.

      Task 3: Analyze the user reviews:
      Identify overall sentiment (Positive, Negative, or Neutral), aggregate feedback into a 2-3 line human summary, highlight key strengths, and list any issues or booking complaints mentioned (e.g. rushing, scheduling delays).

      Task 4: Provide 2 to 4 smart actionable growth tips tailored to credit balance and profile completion. Tell them how to optimize matching chance and earn/spend credits.

      Output strictly valid JSON with the format specified below:
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              description: 'List of recommended skill-swap matches, exactly 5 ordered by score descending.',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  avatarSeed: { type: Type.STRING },
                  offeredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  wantedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  matchScore: { type: Type.INTEGER },
                  whyGoodMatch: { type: Type.STRING },
                  location: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  completedSessions: { type: Type.INTEGER },
                },
                required: ['name', 'avatarSeed', 'offeredSkills', 'wantedSkills', 'matchScore', 'whyGoodMatch', 'location', 'rating', 'completedSessions'],
              }
            },
            skillsToLearn: {
              type: Type.ARRAY,
              description: '3 to 5 skill suggestions tailored to user profile growth.',
              items: {
                type: Type.OBJECT,
                properties: {
                  skillName: { type: Type.STRING },
                  whyUseful: { type: Type.STRING },
                  difficulty: { type: Type.STRING, description: 'Must be Beginner, Intermediate, or Advanced.' },
                },
                required: ['skillName', 'whyUseful', 'difficulty'],
              }
            },
            reviewsAnalysis: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                sentiment: { type: Type.STRING, description: 'Must be Positive, Neutral, or Negative.' },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                concerns: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['summary', 'sentiment', 'strengths', 'concerns'],
            },
            growthTips: {
              type: Type.ARRAY,
              description: '2 to 4 distinct tips for credits, matching, or profiling.',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'profile, credits, or matching' },
                },
                required: ['title', 'explanation', 'category'],
              }
            }
          },
          required: ['matches', 'skillsToLearn', 'reviewsAnalysis', 'growthTips'],
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Emply response received from AI model.');
    }

    const parsedData = JSON.parse(resultText.trim());
    return res.json(parsedData);

  } catch (error: any) {
    console.error('AI Core Exception:', error);
    return res.status(500).json({
      error: error.message || 'The Gemini AI model failed to produce results. Please double check that process.env.GEMINI_API_KEY is properly set or try again.'
    });
  }
});

// Configure Vite as middleware in development or serve static assets in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillSwap Full-stack Server booted at http://localhost:${PORT}`);
  });
}

startServer();
