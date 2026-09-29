import React, { useState, useEffect } from 'react';
import { getSkillEvidence } from '../services/profile';
import {
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  Github,
  Trophy,
  FileText,
  Sparkles,
  ExternalLink,
  Loader2
} from 'lucide-react';

export const Evidence = () => {
  const [evidenceData, setEvidenceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const data = await getSkillEvidence();
        setEvidenceData(data);
      } catch (err) {
        console.error('Error fetching evidence:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvidence();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Auditing Verifiable Skill Evidence Streams...</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'project':
        return <FolderGit2 className="w-4 h-4 text-purple-400" />;
      case 'github':
        return <Github className="w-4 h-4 text-blue-400" />;
      case 'assessment':
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      case 'resume':
      default:
        return <FileText className="w-4 h-4 text-amber-400" />;
    }
  };

  const grouped = evidenceData?.evidence_by_skill || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-slate-950">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Verifiable Proof Engine</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
            {evidenceData?.total_evidence_count || 0} Total Proof Items
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Skill Evidence Audit
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          In SkillGap, skills are backed by verifiable evidence streams: Projects, GitHub code, Technical Assessments, and Resume analysis. Never rely on unproven self-claims.
        </p>
      </div>

      {/* Grouped Skills Evidence Audit */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([skillName, items]) => (
          <div key={skillName} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{skillName}</h3>
                  <span className="text-xs text-slate-400">{items.length} Verifiable Evidence Sources</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                Verified Skill
              </span>
            </div>

            {/* Evidence items list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {items.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-start gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                    {getIcon(ev.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h5 className="font-bold text-white text-xs">{ev.title}</h5>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1.5 py-0.5 rounded bg-slate-950">
                        {ev.type}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed mb-2">{ev.description}</p>
                    
                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800/80">
                      <span className="text-emerald-400 font-semibold">{ev.metric || 'Verified'}</span>
                      {ev.url && (
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-400 hover:underline flex items-center gap-1"
                        >
                          <span>View Proof</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
