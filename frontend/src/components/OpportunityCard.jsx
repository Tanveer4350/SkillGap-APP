import React from 'react';
import { Building2, MapPin, DollarSign, Calendar, Sparkles, CheckCircle2, XCircle, ArrowRight, Bookmark } from 'lucide-react';

export const OpportunityCard = ({
  opportunity,
  onAnalyzeMatch,
  onSaveApplication,
  isSaved = false
}) => {
  const getMatchBadge = (pct) => {
    if (pct >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" /> {pct}% Match
        </span>
      );
    }
    if (pct >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5" /> {pct}% Match
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
        {pct}% Match
      </span>
    );
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between border border-slate-800/80">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
              {opportunity.company_logo ? (
                <img src={opportunity.company_logo} alt={opportunity.company} className="w-6 h-6 object-contain" />
              ) : (
                <Building2 className="w-5 h-5 text-brand-400" />
              )}
            </div>
            <div>
              <h4 className="text-base font-bold text-white leading-tight hover:text-brand-400 transition-colors">
                {opportunity.title}
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{opportunity.company}</p>
            </div>
          </div>
          <div>{getMatchBadge(opportunity.match_percentage || 75)}</div>
        </div>

        {/* Badges / Meta */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-300 mb-3.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-400">
            <MapPin className="w-3 h-3 text-slate-500" /> {opportunity.location}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-400 capitalize">
            {opportunity.type} • {opportunity.workplace_type}
          </span>
          {opportunity.stipend_or_salary && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-950/50 border border-brand-800/40 text-brand-300 font-semibold">
              <DollarSign className="w-3 h-3 text-brand-400" /> {opportunity.stipend_or_salary}
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {opportunity.description}
        </p>

        {/* Skills breakdown */}
        <div className="space-y-1.5 mb-4 text-xs">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Required Skills:</span>
          <div className="flex flex-wrap gap-1.5">
            {opportunity.required_skills && opportunity.required_skills.map((s, idx) => {
              const isMatched = opportunity.matched_skills && opportunity.matched_skills.includes(s);
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                    isMatched
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {isMatched ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-slate-500" />}
                  {s}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Deadline: {opportunity.deadline || 'Rolling'}</span>
        </div>

        <div className="flex items-center gap-2">
          {onSaveApplication && (
            <button
              onClick={() => onSaveApplication(opportunity)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Track Application"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-400 text-brand-400' : ''}`} />
            </button>
          )}

          <button
            onClick={() => onAnalyzeMatch(opportunity)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Analyze My Match
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
