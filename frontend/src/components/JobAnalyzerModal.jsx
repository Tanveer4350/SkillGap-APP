import React, { useState } from 'react';
import { X, Sparkles, Loader2, CheckCircle2, AlertTriangle, XCircle, ArrowRight, FileText } from 'lucide-react';
import { analyzeJobDescription } from '../services/skill_gap';

export const JobAnalyzerModal = ({ isOpen, onClose }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!jobTitle || !jobText) {
      setError('Please provide the job title and paste the job description.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await analyzeJobDescription(jobTitle, companyName, jobText);
      setResult(data);
    } catch (err) {
      setError('Analysis failed. Please check the text and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Job Description Skill Gap Analyzer</h3>
              <p className="text-xs text-slate-400">Paste any internship or job posting to test your profile readiness</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!result ? (
            <form onSubmit={handleAnalyze} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Junior Full Stack Developer"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Paste Job Description *</label>
                <textarea
                  required
                  rows={6}
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Paste requirements, responsibilities, or tech stack from LinkedIn, Handshake, or Company Careers..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono text-xs leading-relaxed"
                />
              </div>

              {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Requirements...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Run Real-Time Gap Analysis
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Results View */
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{result.job_title}</h4>
                  <p className="text-slate-400">{result.company_name || 'Custom Posting'}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-brand-400">{result.readiness_pct}%</span>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Profile Match</span>
                </div>
              </div>

              {/* Extracted Skills */}
              <div>
                <span className="font-bold text-slate-300 block mb-2">Extracted Required Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.extracted_requirements?.required_skills?.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-brand-950/60 border border-brand-800/40 text-brand-300 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gaps List */}
              <div>
                <span className="font-bold text-slate-300 block mb-2">Detected Skill Gaps for this Role:</span>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {result.gaps?.map((g, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{g.skill}</span>
                          <span className="text-[10px] text-slate-400 uppercase">{g.category}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-1">{g.recommendation}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        g.status === 'strong' ? 'text-emerald-400 bg-emerald-500/10' :
                        g.status === 'developing' ? 'text-blue-400 bg-blue-500/10' :
                        'text-rose-400 bg-rose-500/10'
                      }`}>
                        {g.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <button
                  onClick={() => setResult(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Analyze another job
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
