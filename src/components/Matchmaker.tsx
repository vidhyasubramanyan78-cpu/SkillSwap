import { MatchResult } from '../types';
import { UserCheck, Star, MapPin, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';

interface MatchmakerProps {
  matches: MatchResult[];
  onConnect: (partner: MatchResult) => void;
  isLoading: boolean;
}

export default function Matchmaker({ matches, onConnect, isLoading }: MatchmakerProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
        <RefreshCw className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-700">Finding best potential exchange matches...</p>
        <p className="text-xs text-gray-400 mt-1">Analyzing offering alignments & trustworthiness ratings</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
          <UserCheck className="h-5 w-5 text-emerald-600" />
        </div>
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Exchange Matchmaker Ready</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-normal">
          Click the <span className="font-semibold text-emerald-600">⚡ Retrieve AI Advice</span> button above to trigger the Gemini matching engine. It will match you with the top 5 players based on direct skill crossover, proximity, and trust level!
        </p>
      </div>
    );
  }

  return (
    <div id="matchmaker-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Top 5 Recommended Matches</span>
        </h3>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
          AI Sorted Compatibility
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.slice(0, 5).map((match, index) => {
          // Color badge based on score
          const scoreColor = match.matchScore >= 90
            ? 'bg-emerald-500 text-white'
            : match.matchScore >= 80
            ? 'bg-emerald-600 text-white'
            : 'bg-amber-500 text-white';

          return (
            <div
              key={index}
              id={`match-card-${match.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs text-capitalize">
                      {match.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 leading-tight">{match.name}</h4>
                      <p className="text-[10px] text-gray-500 flex items-center gap-0.5 mt-0.5">
                        <MapPin className="h-3 w-3 inline text-gray-400" />
                        <span>{match.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className={`text-xs font-bold px-2 py-1 rounded-lg ${scoreColor} flex items-center gap-1`}>
                    <Sparkles className="h-3 w-3" />
                    <span>{match.matchScore}% Match</span>
                  </div>
                </div>

                {/* Rating & Trustworthiness indicators */}
                <div className="flex items-center gap-3 text-[10px] text-gray-500 border-b border-gray-100 pb-2 mb-2">
                  <span className="flex items-center gap-0.5 font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500 inline" />
                    {match.rating.toFixed(1)}
                  </span>
                  <span>Completed Swaps: <strong>{match.completedSessions}</strong></span>
                </div>

                {/* Skills analysis detail */}
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded-sm uppercase tracking-wide">THEY OFFER:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {match.offeredSkills.map((sk, sIdx) => (
                        <span key={sIdx} className="bg-gray-100 text-gray-700 text-[10px] px-1.5  py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-1.5 py-0.2 rounded-sm uppercase tracking-wide">THEY WANT:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {match.wantedSkills.map((sk, sIdx) => (
                        <span key={sIdx} className="bg-gray-100 text-gray-700 text-[10px] px-1.5 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Why match details block */}
                  <p className="text-gray-600 text-[11px] mt-2 italic bg-slate-50 p-2 rounded-lg leading-normal">
                    &ldquo;{match.whyGoodMatch}&rdquo;
                  </p>
                </div>
              </div>

              {/* Interaction button */}
              <button
                type="button"
                onClick={() => onConnect(match)}
                className="mt-3 w-full py-1.5 px-3 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200 text-gray-600 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Initiate Chat (1hr Credit Hold)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
