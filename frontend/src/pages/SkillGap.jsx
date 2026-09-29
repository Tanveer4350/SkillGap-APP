import React, { useState, useEffect } from 'react';
import { getLatestSkillGap, getTargetRoles, analyzeRoleGap } from '../services/skill_gap';
import { SkillMatrixRadar } from '../components/SkillMatrixRadar';
import { CategoryProgressBar } from '../components/CategoryProgressBar';
import { SkillGapCard } from '../components/SkillGapCard';
import {
  Split,
  Layers,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Plus,
  ArrowRight,
  ShieldCheck,
  FolderGit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SkillGap = () => {
  const [gapData, setGapData] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // all, critical, strong, missing
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gapRes, rolesRes] = await Promise.all([
          getLatestSkillGap(),
          getTargetRoles(),
        ]);
        setGapData(gapRes);
        setRoles(rolesRes);
        setSelectedRoleId(gapRes.target_role_id || (rolesRes[0]?.id ?? 1));
      } catch (err) {
        console.error('Error fetching skill gap data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (roleId) => {
    setSelectedRoleId(roleId);
    setAnalyzing(true);
    try {
      const data = await analyzeRoleGap(roleId, null, null);
      setGapData(data);
    } catch (err) {
      console.error('Error updating target role:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Analyzing Skill Gap Engine...</p>
      </div>
    );
  }

  const allGaps = gapData?.gaps || [];
  const filteredGaps = allGaps.filter((g) => {
    if (activeFilter === 'critical') return g.status === 'missing' || g.status === 'needs_improvement';
    if (activeFilter === 'strong') return g.status === 'strong';
    if (activeFilter === 'developing') return g.status === 'developing';
    if (activeFilter === 'missing') return g.status === 'missing';
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Core Intelligence</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
              Explainable Analysis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Skill Gap Detection Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Comparing your profile evidence against verified market requirements for {gapData?.target_role_name}.
          </p>
        </div>

        {/* Target Role Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 shrink-0">Target Career:</label>
          <select
            value={selectedRoleId || ''}
            disabled={analyzing}
            onChange={(e) => handleRoleChange(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl focus:outline-none focus:border-brand-500 cursor-pointer shadow-lg"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {analyzing && (
        <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-800/40 text-xs text-brand-300 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Re-calculating skill gap metrics and evidence coverage...</span>
        </div>
      )}

      {/* Visualizations Section: Radar Chart + Category Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Matrix */}
        <div className="lg:col-span-6">
          <SkillMatrixRadar categories={gapData?.categories || []} />
        </div>

        {/* Category Breakdown Bars */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Domain Coverage</span>
              <span className="text-xs font-bold text-emerald-400">
                {Math.round(gapData?.skill_coverage_pct || 80)}% Total Coverage
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-5">Skill Requirements by Domain</h3>

            <CategoryProgressBar categories={gapData?.categories || []} />
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
            <span>Scores reflect verified project & assessment evidence, not just self-declarations.</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeFilter === 'all'
                  ? 'bg-brand-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Skills ({allGaps.length})
            </button>
            <button
              onClick={() => setActiveFilter('critical')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeFilter === 'critical'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Critical Gaps ({allGaps.filter((g) => g.status === 'missing' || g.status === 'needs_improvement').length})
            </button>
            <button
              onClick={() => setActiveFilter('strong')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeFilter === 'strong'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Strong Evidence ({allGaps.filter((g) => g.status === 'strong').length})
            </button>
            <button
              onClick={() => setActiveFilter('developing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeFilter === 'developing'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Developing ({allGaps.filter((g) => g.status === 'developing').length})
            </button>
          </div>

          <span className="text-xs text-slate-400">
            Showing {filteredGaps.length} skills
          </span>
        </div>

        {/* Skill Gap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGaps.map((gap, idx) => (
            <SkillGapCard
              key={idx}
              gap={gap}
              onTakeAction={() => navigate('/roadmap')}
            />
          ))}
        </div>
      </div>

      {/* Recommended Projects Engine Section */}
      <div className="pt-6 border-t border-slate-800/80">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Project Recommendation Engine</span>
          <h3 className="text-xl font-black text-white mt-1">
            Projects Specifically Tailored to Bridge Your Gaps
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Instead of generic tutorials, build real-world applications that recruiters and engineering teams respect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gapData?.recommended_projects?.map((proj, idx) => (
            <div key={idx} className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800">
                    {proj.difficulty} • {proj.duration}
                  </span>
                  <FolderGit2 className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{proj.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{proj.description}</p>

                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Demonstrates Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[11px] text-slate-300 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 mb-4">
                  <strong className="text-emerald-400 font-semibold block mb-0.5">Employability Impact:</strong>
                  {proj.impact}
                </div>
              </div>

              <button
                onClick={() => navigate('/roadmap')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Add to My Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
