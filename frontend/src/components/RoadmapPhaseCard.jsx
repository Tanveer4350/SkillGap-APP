import React from 'react';
import { CheckCircle2, Circle, Clock, BookOpen, Wrench, Trophy, ExternalLink, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RoadmapPhaseCard = ({ item, onStatusChange }) => {
  const navigate = useNavigate();
  const isCompleted = item.status === 'completed';
  const isInProgress = item.status === 'in_progress';

  return (
    <div
      className={`glass-panel rounded-2xl p-6 transition-all border ${
        isCompleted
          ? 'border-emerald-500/30 bg-emerald-950/10'
          : isInProgress
          ? 'border-brand-500/40 bg-brand-950/10 glow-brand'
          : 'border-slate-800/80 opacity-85'
      }`}
    >
      {/* Top Phase Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
              isCompleted
                ? 'bg-emerald-500 text-slate-950 font-black'
                : isInProgress
                ? 'bg-brand-500 text-white font-bold animate-pulse'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : item.phase_number}
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Phase {item.phase_number} • {item.category}
            </span>
            <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
          </div>
        </div>

        {/* Status selector */}
        <select
          value={item.status}
          onChange={(e) => onStatusChange(item.id, e.target.value)}
          className={`text-xs px-3 py-1.5 rounded-lg border font-semibold outline-none cursor-pointer ${
            isCompleted
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
              : isInProgress
              ? 'bg-brand-950/60 border-brand-500/40 text-brand-400'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Why Learn It */}
      <div className="mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 text-xs">
        <p className="text-slate-300 leading-relaxed">
          <strong className="text-white font-semibold">Why master {item.skill_name}: </strong>
          {item.why_learn}
        </p>
      </div>

      {/* Grid: Objectives & Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
        {/* Objectives */}
        <div className="space-y-2">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand-400" /> Learning Objectives:
          </span>
          <ul className="space-y-1.5 text-slate-400 pl-1">
            {item.learning_objectives && item.learning_objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-brand-400 mt-0.5">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-2">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> Recommended Learning Material:
          </span>
          <div className="space-y-1.5">
            {item.suggested_resources && item.suggested_resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors group"
              >
                <span className="text-slate-300 font-medium group-hover:text-brand-400 transition-colors truncate max-w-[200px]">
                  {res.title}
                </span>
                <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-950">
                  {res.type}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Practical Project / Assessment CTA */}
      <div className="pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {item.project && (
          <div className="flex items-center gap-2 text-slate-300">
            <Wrench className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong className="text-white">Hands-on Project: </strong> {item.project.title}
            </span>
          </div>
        )}

        {item.assessment_skill && (
          <button
            onClick={() => navigate('/assessments')}
            className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold transition-colors"
          >
            <Trophy className="w-3.5 h-3.5" />
            Validate with Assessment
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
