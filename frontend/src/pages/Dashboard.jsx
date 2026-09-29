import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLatestSkillGap } from '../services/skill_gap';
import { getProfileCompletion, getProjects } from '../services/profile';
import { getOpportunities } from '../services/opportunities';
import { getRoadmap } from '../services/roadmap';
import { ReadinessGauge } from '../components/ReadinessGauge';
import { SkillGapCard } from '../components/SkillGapCard';
import { OpportunityCard } from '../components/OpportunityCard';
import {
  Sparkles,
  ArrowRight,
  Split,
  Map,
  Trophy,
  Briefcase,
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  FolderGit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [gapData, setGapData] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [gapRes, compRes, oppsRes, roadRes] = await Promise.all([
          getLatestSkillGap(),
          getProfileCompletion(),
          getOpportunities({ type: 'all' }),
          getRoadmap(),
        ]);
        setGapData(gapRes);
        setCompletion(compRes);
        setOpportunities(oppsRes.slice(0, 3));
        setRoadmap(roadRes);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Computing your employability intelligence...</p>
      </div>
    );
  }

  const criticalGaps = gapData?.gaps?.filter((g) => g.status === 'missing' || g.status === 'needs_improvement') || [];
  const strongSkills = gapData?.gaps?.filter((g) => g.status === 'strong') || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Student Dashboard</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
              Target: {gapData?.target_role_name || 'Full Stack Developer'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Good morning, {user?.full_name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here is your explainable career readiness overview and priority next steps.
          </p>
        </div>

        {/* Profile Completion Indicator */}
        <div className="flex items-center gap-3 glass-panel p-3 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-xs">
            {Math.round(completion?.completion_percentage || 80)}%
          </div>
          <div className="text-xs pr-2">
            <span className="font-bold text-white block">Profile Completion</span>
            <span className="text-[11px] text-slate-400">
              {completion?.missing_items?.length > 0 ? completion.missing_items[0] : 'All key sections complete'}
            </span>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Profile Readiness</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400">{Math.round(gapData?.overall_readiness_pct || 78)}%</span>
            <span className="text-[10px] text-slate-500 font-medium">calculated</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Skills Covered</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-brand-400">{strongSkills.length} / {gapData?.gaps?.length || 8}</span>
            <span className="text-[10px] text-slate-500 font-medium">skills</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Critical Gaps</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-400">{criticalGaps.length}</span>
            <span className="text-[10px] text-slate-500 font-medium">to bridge</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Roadmap Progress</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-purple-400">{Math.round(roadmap?.progress_pct || 16)}%</span>
            <span className="text-[10px] text-slate-500 font-medium">Phase {roadmap?.current_phase || 1}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Readiness Gauge + Actionable Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Explainable Readiness Gauge */}
        <div className="lg:col-span-7">
          <ReadinessGauge
            score={gapData?.overall_readiness_pct || 78}
            skillCoverage={gapData?.skill_coverage_pct || 82}
            evidenceCoverage={gapData?.evidence_coverage_pct || 71}
            projectScore={gapData?.project_score_pct || 85}
            resumeScore={gapData?.resume_score_pct || 90}
            assessmentScore={gapData?.assessment_score_pct || 100}
          />
        </div>

        {/* Right: Recommended Priority Next Steps */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Action Plan</span>
              <span className="text-xs text-brand-400 font-semibold">Priority</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">Recommended Next Steps</h3>

            <div className="space-y-3">
              {gapData?.recommendations?.slice(0, 3).map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {rec.step_number}
                  </div>
                  <div className="flex-1 text-xs">
                    <h5 className="font-bold text-white">{rec.title}</h5>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{rec.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(rec.action_link)}
                    className="shrink-0 text-[11px] font-bold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1 mt-1"
                  >
                    <span>{rec.action_label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Want step-by-step guidance?</span>
            <button
              onClick={() => navigate('/roadmap')}
              className="font-bold text-brand-400 hover:underline flex items-center gap-1"
            >
              Open Full Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Skill Gaps Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Top Skill Gaps & Evidence Status</h3>
            <p className="text-xs text-slate-400">Comparing your profile evidence against {gapData?.target_role_name}</p>
          </div>
          <button
            onClick={() => navigate('/skill-gap')}
            className="text-xs font-bold text-brand-400 hover:underline flex items-center gap-1"
          >
            View All Skills <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gapData?.gaps?.slice(0, 3).map((gap, i) => (
            <SkillGapCard key={i} gap={gap} onTakeAction={() => navigate('/roadmap')} />
          ))}
        </div>
      </div>

      {/* Recommended Project Callout */}
      {gapData?.recommended_projects && gapData.recommended_projects.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-brand-500/20 bg-gradient-to-r from-brand-950/40 via-slate-900/60 to-slate-950">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Recommended Gap-Bridging Project
              </span>
              <h3 className="text-xl font-black text-white">{gapData.recommended_projects[0].title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {gapData.recommended_projects[0].description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {gapData.recommended_projects[0].skills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[11px] text-slate-200 font-semibold">
                    {s}
                  </span>
                ))}
                <span className="px-2 py-0.5 rounded bg-brand-900/60 border border-brand-800 text-[11px] text-brand-300 font-semibold">
                  Est. {gapData.recommended_projects[0].duration}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/skill-gap')}
              className="shrink-0 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2"
            >
              <span>View Project Specs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Matched Opportunities Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Matched Opportunities</h3>
            <p className="text-xs text-slate-400">Opportunities matched against your current profile and target role</p>
          </div>
          <button
            onClick={() => navigate('/opportunities')}
            className="text-xs font-bold text-brand-400 hover:underline flex items-center gap-1"
          >
            Explore All Opportunities <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onAnalyzeMatch={() => navigate('/opportunities')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
