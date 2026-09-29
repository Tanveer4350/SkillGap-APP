import React, { useState, useEffect } from 'react';
import { getOpportunities, analyzeOpportunityMatch } from '../services/opportunities';
import { createApplication } from '../services/applications';
import { OpportunityCard } from '../components/OpportunityCard';
import {
  Briefcase,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Bookmark,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filters, setFilters] = useState({ type: 'all', workplace_type: 'all', search: '' });
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [analyzingMatch, setAnalyzingMatch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpportunities();
  }, [filters]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const data = await getOpportunities(filters);
      setOpportunities(data);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeMatch = async (opp) => {
    setAnalyzingMatch(true);
    try {
      const analysis = await analyzeOpportunityMatch(opp.id);
      setSelectedMatch(analysis);
    } catch (err) {
      console.error('Error analyzing match:', err);
    } finally {
      setAnalyzingMatch(false);
    }
  };

  const handleSaveToTracker = async (opp) => {
    try {
      await createApplication({
        opportunity_id: opp.id,
        custom_title: opp.title,
        custom_company: opp.company,
        status: 'saved',
      });
      setSavedSuccess(`Saved "${opp.title}" to Application Tracker!`);
      setTimeout(() => setSavedSuccess(null), 3500);
    } catch (err) {
      console.error('Error saving application:', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-blue-950/20 via-slate-900/60 to-slate-950">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Market Discovery</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
            Real-Time Matching
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Opportunities & Match Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Explore internships and entry-level positions calibrated to your verified profile skills. Click "Analyze My Match" on any card for an explainable breakdown.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedSuccess}</span>
          </div>
          <button onClick={() => navigate('/applications')} className="font-bold underline">
            View in Kanban Tracker →
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search role, company, or tech skill..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Types</option>
            <option value="internship">Internship</option>
            <option value="full-time">Full-time</option>
          </select>

          <select
            value={filters.workplace_type}
            onChange={(e) => setFilters({ ...filters, workplace_type: e.target.value })}
            className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Workplace</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-site</option>
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-3" />
          <p className="text-xs text-slate-400">Matching opportunities against your profile...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No opportunities match your current filters</h4>
          <p className="text-xs text-slate-400 mt-1">Try clearing some filter criteria to discover more openings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onAnalyzeMatch={handleAnalyzeMatch}
              onSaveApplication={handleSaveToTracker}
            />
          ))}
        </div>
      )}

      {/* Match Breakdown Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">
                  Opportunity Match Analysis
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedMatch.title} • {selectedMatch.company}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Match Gauge */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm">Readiness Score:</span>
                  <p className="text-slate-400 text-[11px]">Computed against job requirements</p>
                </div>
                <span className="text-2xl font-black text-brand-400">
                  {selectedMatch.match_percentage}%
                </span>
              </div>

              {/* Summary */}
              <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                {selectedMatch.readiness_summary}
              </p>

              {/* Matching Skills */}
              <div>
                <span className="font-bold text-slate-300 block mb-1.5">Matching Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMatch.matching_skills.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              {selectedMatch.missing_skills.length > 0 && (
                <div>
                  <span className="font-bold text-slate-300 block mb-1.5">Missing Requirements:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMatch.missing_skills.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-medium">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Focus */}
              <div>
                <span className="font-bold text-slate-300 block mb-1.5">Actionable Recommendations:</span>
                <ul className="space-y-1 text-slate-400">
                  {selectedMatch.suggested_focus.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-brand-400">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedMatch(null);
                    navigate('/roadmap');
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Bridge Gaps in Roadmap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
