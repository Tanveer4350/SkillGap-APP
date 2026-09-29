import React, { useState, useEffect } from 'react';
import { getPlacementAnalytics } from '../services/profile';
import {
  Building,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Layers,
  GraduationCap,
  Sparkles,
  Loader2,
  Shield
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const PlacementDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getPlacementAnalytics();
        setData(res);
      } catch (err) {
        console.error('Error fetching placement analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Aggregating College Employability Intelligence...</p>
      </div>
    );
  }

  const deptChartData = data?.department_readiness?.map((d) => ({
    name: d.department.split(' ')[0] + ' ' + (d.department.split(' ')[1] || ''),
    Readiness: d.avg_readiness,
    ReadyPct: d.placement_ready_pct,
  })) || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-purple-950/20 via-slate-900/60 to-slate-950">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Institution Portal</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
            Aggregated Cohort Data
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          College Placement Cell Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Aggregated employability metrics, department readiness distributions, and cohort-wide skill gap patterns to accelerate campus hiring.
        </p>
      </div>

      {/* Aggregate KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Enrolled Students</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {data?.summary?.total_students || 480}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">+12% YoY</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Completed Profiles</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-brand-400">
              {data?.summary?.profiles_completed || 390}
            </span>
            <span className="text-xs text-slate-400">({Math.round(((data?.summary?.profiles_completed || 390) / (data?.summary?.total_students || 480)) * 100)}%)</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Average Readiness Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              {data?.summary?.average_readiness_pct || 68.5}%
            </span>
            <span className="text-xs text-slate-400">Cohort Avg</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Active Hiring Drives</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-400">
              {data?.summary?.active_drives || 18}
            </span>
            <span className="text-xs text-slate-400">Partners</span>
          </div>
        </div>
      </div>

      {/* Grid: Department Readiness Bar Chart & Common Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Readiness Bar Chart */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Department Analytics</span>
              <span className="text-xs text-brand-400 font-semibold">Benchmark</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-4">Average Employability Readiness by Department</h3>

            <div className="w-full h-64 my-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`${val}%`, 'Score']}
                  />
                  <Bar dataKey="Readiness" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-around text-xs text-slate-400">
            <span>Data Science & CSE cohorts demonstrate highest market readiness score.</span>
          </div>
        </div>

        {/* Top Cohort-Wide Skill Gaps */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Curriculum Intervention</span>
            <span className="text-xs text-rose-400 font-semibold">Action Needed</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-4">Most Common Student Skill Gaps</h3>

          <div className="space-y-3 text-xs">
            {data?.top_skill_gaps?.map((gap, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-center font-bold text-white">
                  <span>{gap.skill}</span>
                  <span className="text-rose-400">{gap.gap_percentage}% of cohort</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${gap.gap_percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>Category: {gap.category}</span>
                  <span>{gap.students_affected} students affected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Career Interests Distribution */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">Student Career Goals & Placement Target Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          {data?.career_interests?.map((role, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 block truncate">{role.role}</span>
              <span className="text-2xl font-black text-brand-400">{role.percentage}%</span>
              <span className="text-[11px] text-slate-500 block">{role.count} students targeting</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
