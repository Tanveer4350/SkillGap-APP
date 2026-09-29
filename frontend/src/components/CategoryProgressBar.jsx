import React from 'react';

export const CategoryProgressBar = ({ categories = [] }) => {
  return (
    <div className="space-y-4">
      {categories.map((cat, idx) => {
        let barColor = 'bg-brand-500';
        let textColor = 'text-brand-400';
        if (cat.score >= 75) {
          barColor = 'bg-emerald-500';
          textColor = 'text-emerald-400';
        } else if (cat.score >= 45) {
          barColor = 'bg-blue-500';
          textColor = 'text-blue-400';
        } else if (cat.score >= 25) {
          barColor = 'bg-amber-500';
          textColor = 'text-amber-400';
        } else {
          barColor = 'bg-rose-500';
          textColor = 'text-rose-400';
        }

        return (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">{cat.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">
                  {cat.matched_count}/{cat.required_count} Skills
                </span>
                <span className={`font-bold ${textColor}`}>{cat.score}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${Math.min(100, Math.max(4, cat.score))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
