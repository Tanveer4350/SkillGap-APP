import React, { useState, useEffect } from 'react';
import { getAssessments } from '../services/assessments';
import { Trophy, Clock, HelpCircle, CheckCircle2, XCircle, ArrowRight, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getAssessments();
        setAssessments(data);
      } catch (err) {
        console.error('Error fetching assessments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Loading Skill Assessments Hub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-slate-950">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Skill Verification</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
            Instant Evidence
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Technical Skill Assessments
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Validate your technical proficiency with practical MCQ, debugging, and scenario assessments. Passing (≥70%) automatically records verified credential evidence on your profile.
        </p>
      </div>

      {/* Assessment Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((a) => (
          <div
            key={a.id}
            className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                  {a.category} • {a.difficulty}
                </span>

                {a.user_passed ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passed ({a.user_best_score}%)
                  </span>
                ) : a.user_best_score !== null && a.user_best_score !== undefined ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Best: {a.user_best_score}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">Not Attempted</span>
                )}
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug">{a.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                {a.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 mb-6 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
                  {a.questions_count} Questions
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {a.time_limit_mins} mins
                </span>
                <span>Pass: {a.pass_score}%</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/assessments/${a.id}`)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                a.user_passed
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20'
              }`}
            >
              <span>{a.user_passed ? 'Retake Assessment' : 'Start Assessment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
