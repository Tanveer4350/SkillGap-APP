import React from 'react';
import { HelpCircle, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const ReadinessGauge = ({
  score = 0,
  skillCoverage = 0,
  evidenceCoverage = 0,
  projectScore = 0,
  resumeScore = 0,
  assessmentScore = 0,
}) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 75) return '#10b981'; // emerald
    if (s >= 50) return '#3b82f6'; // blue
    if (s >= 30) return '#f59e0b'; // amber
    return '#f43f5e'; // rose
  };

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Employability Readiness</span>
          <h3 className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
            Profile Readiness
            <div className="group relative inline-block">
              <HelpCircle className="w-4 h-4 text-slate-400 hover:text-brand-400 cursor-pointer transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-3 bg-slate-900/95 border border-slate-700 rounded-xl text-xs text-slate-300 shadow-2xl z-50 pointer-events-none">
                <p className="font-semibold text-white mb-1">How is this computed?</p>
                <p className="leading-relaxed">
                  Transparent weighted composite: Skill Coverage (35%) + Verifiable Evidence (25%) + Practical Projects (20%) + Resume Completeness (10%) + Assessments (10%).
                </p>
              </div>
            </div>
          </h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
          Explainable Metric
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background Track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800/80"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={getColor(score)}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black tracking-tight text-white">{Math.round(score)}%</span>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Ready</span>
          </div>
        </div>

        {/* Explainable Sub-Metrics Breakdown */}
        <div className="w-full space-y-2.5">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Skill Requirements Coverage</span>
              <span className="text-white font-semibold">{Math.round(skillCoverage)}%</span>
            </div>
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, skillCoverage))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Verifiable Evidence Coverage</span>
              <span className="text-white font-semibold">{Math.round(evidenceCoverage)}%</span>
            </div>
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, evidenceCoverage))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Projects & Portfolio Evidence</span>
              <span className="text-white font-semibold">{Math.round(projectScore)}%</span>
            </div>
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, projectScore))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Resume Calibration (ATS)</span>
              <span className="text-white font-semibold">{Math.round(resumeScore)}%</span>
            </div>
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, resumeScore))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Note:</strong> Profile Readiness represents evidence alignment with your target role. It is not an automated prediction of hiring outcomes.
        </p>
      </div>
    </div>
  );
};
