import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SkillGapCard = ({ gap, onTakeAction }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'strong':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Strong Evidence
          </span>
        );
      case 'developing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Developing
          </span>
        );
      case 'needs_improvement':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Needs Evidence
          </span>
        );
      case 'missing':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Critical Gap
          </span>
        );
    }
  };

  const getImportanceBadge = (imp) => {
    if (imp === 'critical') {
      return <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800">Must Have</span>;
    }
    if (imp === 'high') {
      return <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-brand-950/60 text-brand-300 border border-brand-800">Required</span>;
    }
    return <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Preferred</span>;
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between border border-slate-800/80">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-base font-bold text-white">{gap.skill}</h4>
              {getImportanceBadge(gap.importance)}
            </div>
            <span className="text-xs text-slate-400 font-medium">{gap.category}</span>
          </div>
          <div>{getStatusBadge(gap.status)}</div>
        </div>

        {/* Why it Matters */}
        <div className="mb-3.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 text-xs">
          <p className="text-slate-300 leading-relaxed font-normal">
            <strong className="text-white font-semibold">Why it matters: </strong>
            {gap.why_it_matters}
          </p>
        </div>

        {/* Evidence Status */}
        <div className="space-y-2 mb-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block mb-1">Current Verifiable Evidence:</span>
            {gap.current_evidence && gap.current_evidence.length > 0 ? (
              <ul className="space-y-1">
                {gap.current_evidence.map((ev, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                No project, code repository, or assessment evidence detected.
              </p>
            )}
          </div>

          {gap.status !== 'strong' && (
            <div className="pt-2">
              <span className="text-amber-400/90 font-medium block mb-1">What's missing:</span>
              <p className="text-slate-400 leading-relaxed">{gap.what_is_missing}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Recommendation */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 line-clamp-2">{gap.recommendation}</p>
          <button
            onClick={() => {
              if (onTakeAction) {
                onTakeAction(gap);
              } else {
                navigate('/roadmap');
              }
            }}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
          >
            Bridge Gap
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
