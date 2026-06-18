import React from 'react';
import { SkillSuggestion } from '../types';
import { BookOpen, Sparkles } from 'lucide-react';

interface SkillSuggestionsProps {
  suggestions: SkillSuggestion[];
  isLoading: boolean;
}

export default function SkillSuggestions({ suggestions, isLoading }: SkillSuggestionsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50">
            <div className="h-4 bg-slate-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-xs">
        Click <span className="font-semibold text-emerald-600">⚡ Retrieve AI Advice</span> to generate your personalized learning roadmap.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {suggestions.map((item, index) => {
        // Color coding for standard difficulty badges
        const levelBadgeColor = 
          item.difficulty === 'Beginner' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : item.difficulty === 'Intermediate' 
            ? 'bg-blue-50 text-blue-700 border-blue-100' 
            : 'bg-purple-50 text-purple-700 border-purple-100';

        const indexStrings = ["01", "02", "03", "04", "05"];

        return (
          <div 
            key={index} 
            id={`skill-suggestion-card-${item.skillName.toLowerCase().replace(/\s+/g, '-')}`}
            className="p-3.5 border border-slate-100/85 rounded-xl bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${levelBadgeColor}`}>
                  {item.difficulty}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {indexStrings[index] || `0${index + 1}`}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight flex items-start gap-1">
                <BookOpen className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>{item.skillName}</span>
              </h4>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-normal">
                {item.whyUseful}
              </p>
            </div>
            
            <div className="mt-3 pt-2 border-t border-dashed border-slate-200/60 flex justify-between items-center">
              <span className="text-[9px] text-indigo-600 font-semibold uppercase tracking-wider">Skill Path</span>
              <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
